from rest_framework import serializers
from .models import User, StudentProfile, TeacherProfile, AdminProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'nombre_completo', 'rut', 'correo_institucional']


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'ppa', 'sanciones', 'situacion_academica']


class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TeacherProfile
        fields = ['id', 'user', 'departamento']


class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = AdminProfile
        fields = ['id', 'user', 'cargo', 'facultad']
