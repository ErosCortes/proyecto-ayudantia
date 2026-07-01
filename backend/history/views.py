from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import EsAlumno, EsProfesor, EsAdmin
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
        if self.action == 'by_student':
            return [EsProfesor()]
        if self.action == 'all_history':
            return [EsAdmin()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def my_history(self, request):
        """Historial del alumno actual (solo para el propio alumno)"""
        history = AssistantHistory.objects.filter(
            id_alumno=request.user
        ).select_related('id_curso__course')
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_semester(self, request):
        """Historial del alumno actual filtrado por semestre"""
        semestre = request.query_params.get('semestre')
        history = AssistantHistory.objects.filter(
            id_alumno=request.user,
            semestre=semestre
        ).select_related('id_curso__course')
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """
        Historial de un alumno específico — accesible para profesores.
        Uso: GET /api/history/by_student/?student_id=<id>
        """
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'Se requiere el parámetro student_id'}, status=400)

        history = AssistantHistory.objects.filter(
            id_alumno_id=student_id
        ).select_related('id_alumno', 'id_curso__course')
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def all_history(self, request):
        """
        Historial completo con filtros — solo administradores.
        Filtros opcionales: ?alumno=<nombre_o_rut>&semestre=<semestre>&estado=<estado>&curso=<nombre>
        """
        qs = AssistantHistory.objects.select_related(
            'id_alumno', 'id_curso__course'
        ).order_by('-semestre', 'id_alumno__nombre_completo')

        alumno = request.query_params.get('alumno', '').strip()
        semestre = request.query_params.get('semestre', '').strip()
        estado = request.query_params.get('estado', '').strip()
        curso = request.query_params.get('curso', '').strip()

        if alumno:
            qs = qs.filter(
                id_alumno__nombre_completo__icontains=alumno
            ) | qs.filter(
                id_alumno__rut__icontains=alumno
            )
        if semestre:
            qs = qs.filter(semestre=semestre)
        if estado:
            qs = qs.filter(estado_final=estado)
        if curso:
            qs = qs.filter(id_curso__course__nombre__icontains=curso)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
