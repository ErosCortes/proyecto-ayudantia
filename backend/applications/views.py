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
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """Postulaciones del alumno actual"""
        postulations = Postulation.objects.filter(id_alumno=request.user)
        serializer = self.get_serializer(postulations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def apply(self, request):
        """Alumno postula a una sección"""
        try:
            postulation = Postulation.objects.create(
                id_alumno=request.user,
                id_curso_id=request.data.get('id_curso'),
                estado='PENDIENTE'
            )
            serializer = self.get_serializer(postulation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@action(detail=True, methods=['patch'])
def update_status(self, request, pk=None):
    """Profesor acepta o rechaza una postulación"""
    postulation = self.get_object()
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