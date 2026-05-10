from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Tutorship


@api_view(['GET'])
def get_tutorship_history(request):
    """Obtiene el historial de ayudantías del estudiante (cursos donde fue ayudante)"""
    try:
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Obtener todas las ayudantías donde el usuario es el estudiante (ayudante asignado)
        tutorships = Tutorship.objects.filter(student=user).select_related('course', 'teacher')
        
        tutorship_data = []
        for tutorship in tutorships:
            tutorship_data.append({
                'id': tutorship.id,
                'course': tutorship.course.name,
                'course_code': tutorship.course.code,
                'teacher': tutorship.teacher.email if tutorship.teacher else 'N/A',
                'status': tutorship.status,
                'start_date': tutorship.start_date.isoformat() if tutorship.start_date else None,
                'end_date': tutorship.end_date.isoformat() if tutorship.end_date else None,
                'description': tutorship.description,
                'created_at': tutorship.created_at.isoformat(),
            })
        
        return Response(tutorship_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
