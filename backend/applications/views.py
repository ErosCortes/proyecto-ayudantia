from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import EsAlumno, EsProfesor
from rest_framework.permissions import IsAuthenticated
from .models import Postulation
from .serializers import PostulationSerializer
from courses.models import Course, Section
from history.models import AssistantHistory


class PostulationViewSet(viewsets.ModelViewSet):
    queryset = Postulation.objects.all()
    serializer_class = PostulationSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['apply', 'my_applications']:
            return [EsAlumno()]
        if self.action in ['update_status', 'pending', 'assign_section']:
            return [EsProfesor()]
        return [IsAuthenticated()]

    def _puede_revisar(self, user, course):
        if course.metodo_seleccion == 'COORDINADOR':
            return course.coordinador_id == user.id
        return course.sections.filter(profesor=user).exists()

    def _mis_cursos(self, user):
        return Course.objects.filter(
            Q(sections__profesor=user, metodo_seleccion='INDIVIDUAL') |
            Q(coordinador=user, metodo_seleccion='COORDINADOR')
        ).distinct()

    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        postulations = Postulation.objects.filter(id_alumno=request.user)
        serializer = self.get_serializer(postulations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def apply(self, request):
        curso_id = request.data.get('curso_id')

        ya_postulo = Postulation.objects.filter(
            id_alumno=request.user,
            curso_id=curso_id
        ).exists()

        if ya_postulo:
            return Response(
                {'error': 'Ya postulaste a este curso anteriormente.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            postulation = Postulation.objects.create(
                id_alumno=request.user,
                curso_id=curso_id,
                estado='PENDIENTE'
            )
            serializer = self.get_serializer(postulation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        postulation = self.get_object()

        if not self._puede_revisar(request.user, postulation.curso):
            return Response(
                {'error': 'No tienes permiso para revisar esta postulación'},
                status=status.HTTP_403_FORBIDDEN
            )

        nuevo_estado = request.data.get('estado')

        ESTADOS_VALIDOS = ['PENDIENTE', 'ACEPTADA', 'RECHAZADA']
        if nuevo_estado not in ESTADOS_VALIDOS:
            return Response(
                {'error': f'Estado inválido. Debe ser uno de: {ESTADOS_VALIDOS}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        postulation.estado = nuevo_estado
        postulation.comentario = request.data.get('comentario', '')
        postulation.save()

        if nuevo_estado == 'ACEPTADA' and postulation.seccion_asignada:
            AssistantHistory.objects.get_or_create(
                id_alumno=postulation.id_alumno,
                id_curso=postulation.seccion_asignada,
                defaults={
                    'semestre': postulation.seccion_asignada.semestre,
                    'estado_final': 'COMPLETADA'
                }
            )

        serializer = self.get_serializer(postulation)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_section(self, request, pk=None):
        postulation = self.get_object()

        if postulation.estado != 'ACEPTADA':
            return Response(
                {'error': 'Solo puedes asignar sección a postulaciones aceptadas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not self._puede_revisar(request.user, postulation.curso):
            return Response(
                {'error': 'No tienes permiso para asignar sección a esta postulación'},
                status=status.HTTP_403_FORBIDDEN
            )

        seccion_id = request.data.get('seccion_id')
        if not seccion_id:
            return Response(
                {'error': 'seccion_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            section = Section.objects.get(id=seccion_id, course=postulation.curso)
        except Section.DoesNotExist:
            return Response(
                {'error': 'La sección no existe o no pertenece al curso de esta postulación'},
                status=status.HTTP_400_BAD_REQUEST
            )

        postulation.seccion_asignada = section
        postulation.save()

        AssistantHistory.objects.get_or_create(
            id_alumno=postulation.id_alumno,
            id_curso=section,
            defaults={
                'semestre': section.semestre,
                'estado_final': 'COMPLETADA'
            }
        )

        serializer = self.get_serializer(postulation)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        user = request.user
        criterio = request.query_params.get('orden', 'prioridad')
        curso_id = request.query_params.get('curso_id')
        estado = request.query_params.get('estado', 'PENDIENTE')

        cursos = self._mis_cursos(user)
        postulations = Postulation.objects.filter(
            estado=estado,
            curso__in=cursos
        )

        if curso_id:
            postulations = postulations.filter(curso_id=curso_id)

        postulations = postulations.distinct().ordenar_por(criterio)

        serializer = self.get_serializer(postulations, many=True)
        return Response(serializer.data)
