from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Postulation
from .serializers import PostulationSerializer


class PostulationViewSet(viewsets.ModelViewSet):
    queryset = Postulation.objects.all()
    serializer_class = PostulationSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """Obtiene postulaciones del usuario actual"""
        postulations = Postulation.objects.filter(id_alumno=request.user)
        serializer = self.get_serializer(postulations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def apply(self, request):
        """Crea una nueva postulación"""
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
        """Actualiza el estado de una postulación"""
        postulation = self.get_object()
        postulation.estado = request.data.get('estado')
        postulation.comentario = request.data.get('comentario', '')
        postulation.save()
        serializer = self.get_serializer(postulation)
        return Response(serializer.data)
