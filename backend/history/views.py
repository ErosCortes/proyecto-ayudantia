from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AssistantHistory
from .serializers import AssistantHistorySerializer


class AssistantHistoryViewSet(viewsets.ModelViewSet):
    queryset = AssistantHistory.objects.all()
    serializer_class = AssistantHistorySerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_history(self, request):
        """Obtiene historial del usuario actual"""
        history = AssistantHistory.objects.filter(id_alumno=request.user)
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_semester(self, request):
        """Obtiene historial por semestre"""
        semestre = request.query_params.get('semestre')
        history = AssistantHistory.objects.filter(id_alumno=request.user, semestre=semestre)
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)
