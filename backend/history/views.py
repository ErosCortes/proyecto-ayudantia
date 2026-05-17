from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import EsAlumno
from rest_framework.permissions import IsAuthenticated
from .models import AssistantHistory
from .serializers import AssistantHistorySerializer


class AssistantHistoryViewSet(viewsets.ModelViewSet):
    queryset = AssistantHistory.objects.all()
    serializer_class = AssistantHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['my_history', 'by_semester']:
            return [EsAlumno()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def my_history(self, request):
        """Historial del alumno actual"""
        history = AssistantHistory.objects.filter(id_alumno=request.user)
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_semester(self, request):
        semestre = request.query_params.get('semestre')
        history = AssistantHistory.objects.filter(
            id_alumno=request.user,
            semestre=semestre
        )
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)