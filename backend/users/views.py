from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, StudentProfile, TeacherProfile, AdminProfile
from .serializers import UserSerializer, StudentProfileSerializer, TeacherProfileSerializer, AdminProfileSerializer


@login_required
def oauth_success(request):

    email = request.user.email.lower()

    # PROFESOR
    if email == "profesorucntest@gmail.com":
        return redirect("http://localhost:3000/teacher")

    # ESTUDIANTE
    if email.endswith("@alumnos.ucn.cl"):
        return redirect("http://localhost:3000/student")

    #cualquier otro correo
    return redirect("http://localhost:3000/")


@require_http_methods(["POST"])
def logout_user(request):
    """Cierra sesión del usuario y limpia OAuth"""
    # Cerrar sesión normal de Django
    auth_logout(request)
    
    return JsonResponse({
        "message": "Sesión cerrada", 
        "redirect": "http://localhost:3000/"
    })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Obtiene el usuario actual autenticado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def profile_type(self, request):
        """Obtiene el tipo de perfil del usuario autenticado"""
        user = request.user
        profile_type = None
        profile_data = None

        if hasattr(user, 'alumno_profile'):
            profile_type = 'student'
            profile_data = StudentProfileSerializer(user.alumno_profile).data
        elif hasattr(user, 'profesor_profile'):
            profile_type = 'teacher'
            profile_data = TeacherProfileSerializer(user.profesor_profile).data
        elif hasattr(user, 'admin_profile') or user.is_staff:
            profile_type = 'admin'
            profile_data = AdminProfileSerializer(user.admin_profile).data if hasattr(user, 'admin_profile') else {}

        return Response({
            'profile_type': profile_type,
            'user': UserSerializer(user).data,
            'profile': profile_data
        })


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]


class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated]


class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAuthenticated]