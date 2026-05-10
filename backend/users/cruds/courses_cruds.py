from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied
from ..models import Course, UserProfile
import json


@api_view(['GET', 'POST'])
def manage_courses(request):
    """
    GET: Lista todos los cursos
    POST: Crea un nuevo curso (solo para administradores)
    """
    if request.method == 'GET':
        courses = Course.objects.all().values('id', 'name', 'code', 'description', 'created_at')
        return Response(list(courses), status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Verificar si el usuario es admin
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.role != 'ADMIN':
                raise PermissionDenied("Solo administradores pueden crear cursos")
        except UserProfile.DoesNotExist:
            return Response({"error": "Perfil de usuario no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            data = json.loads(request.body)
            course = Course.objects.create(
                name=data.get('name'),
                code=data.get('code'),
                description=data.get('description', '')
            )
            return Response({
                'id': course.id,
                'name': course.name,
                'code': course.code,
                'description': course.description,
            }, status=status.HTTP_201_CREATED)
        except KeyError as e:
            return Response({"error": f"Campo faltante: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def course_detail(request, course_id):
    """
    GET: Obtiene detalles de un curso
    PUT: Actualiza un curso (solo admin)
    DELETE: Elimina un curso (solo admin)
    """
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Curso no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        return Response({
            'id': course.id,
            'name': course.name,
            'code': course.code,
            'description': course.description,
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        # Verificar si es admin
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.role != 'ADMIN':
                raise PermissionDenied("Solo administradores pueden editar cursos")
        except UserProfile.DoesNotExist:
            return Response({"error": "Perfil de usuario no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            data = json.loads(request.body)
            course.name = data.get('name', course.name)
            course.code = data.get('code', course.code)
            course.description = data.get('description', course.description)
            course.save()
            return Response({
                'id': course.id,
                'name': course.name,
                'code': course.code,
                'description': course.description,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Verificar si es admin
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.role != 'ADMIN':
                raise PermissionDenied("Solo administradores pueden eliminar cursos")
        except UserProfile.DoesNotExist:
            return Response({"error": "Perfil de usuario no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
        
        course.delete()
        return Response({"message": "Curso eliminado"}, status=status.HTTP_204_NO_CONTENT)
