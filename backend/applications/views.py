from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import EsAlumno, EsProfesor
from rest_framework.permissions import IsAuthenticated
from .models import Postulation
from .serializers import PostulationSerializer
from history.models import AssistantHistory


class PostulationViewSet(viewsets.ModelViewSet):
    queryset = Postulation.objects.all()
    serializer_class = PostulationSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Permisos distintos según la acción"""
        if self.action in ['apply', 'my_applications']:
            return [EsAlumno()]
        if self.action == 'update_status':
            return [EsProfesor()]
        if self.action == 'pending':
            return [EsProfesor()]
        return [IsAuthenticated()]

    def _puede_revisar(self, user, section):
        """
        Determina si `user` puede revisar/decidir postulaciones de `section`,
        según el método de selección del curso al que pertenece:
        - INDIVIDUAL: solo el profesor asignado a esa sección específica.
        - COORDINADOR: solo el coordinador asignado al curso (puede revisar
          postulaciones de todas las secciones de ese curso, no solo la suya).
        """
        course = section.course
        if course.metodo_seleccion == 'COORDINADOR':
            return course.coordinador_id == user.id
        return section.profesor_id == user.id

    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """Postulaciones del alumno actual"""
        postulations = Postulation.objects.filter(id_alumno=request.user)
        serializer = self.get_serializer(postulations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def apply(self, request):
        """Alumno postula a una sección"""
        id_curso = request.data.get('id_curso')

        ya_postulo = Postulation.objects.filter(
            id_alumno=request.user,
            id_curso_id=id_curso
        ).exists()

        if ya_postulo:
            return Response(
                {'error': 'Ya postulaste a esta ayudantía anteriormente.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            postulation = Postulation.objects.create(
                id_alumno=request.user,
                id_curso_id=id_curso,
                estado='PENDIENTE'
            )
            serializer = self.get_serializer(postulation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Profesor o coordinador acepta o rechaza una postulación"""
        postulation = self.get_object()

        if not self._puede_revisar(request.user, postulation.id_curso):
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

        if nuevo_estado == 'ACEPTADA':
            AssistantHistory.objects.get_or_create(
                id_alumno=postulation.id_alumno,
                id_curso=postulation.id_curso,
                defaults={
                    'semestre': postulation.id_curso.semestre,
                    'estado_final': 'COMPLETADA'
                }
            )

        serializer = self.get_serializer(postulation)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """
        Postulaciones pendientes que el usuario actual puede revisar.
        Soporta ?orden=ppa | nota_curso | fecha | fecha_desc | nombre | prioridad
        y ?section_id= para filtrar por sección específica.
        """
        user = request.user
        criterio = request.query_params.get('orden', 'prioridad')
        section_id = request.query_params.get('section_id')

        postulations = Postulation.objects.filter(estado='PENDIENTE').filter(
            Q(id_curso__profesor=user, id_curso__course__metodo_seleccion='INDIVIDUAL') |
            Q(id_curso__course__coordinador=user, id_curso__course__metodo_seleccion='COORDINADOR')
        )

        if section_id:
            postulations = postulations.filter(id_curso_id=section_id)

        postulations = postulations.distinct().ordenar_por(criterio)

        serializer = self.get_serializer(postulations, many=True)
        return Response(serializer.data)