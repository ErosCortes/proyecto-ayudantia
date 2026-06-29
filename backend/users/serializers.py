from rest_framework import serializers
from .models import User, StudentProfile, TeacherProfile, AdminProfile, ApprovedSubject


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nombre_completo', 'rut',
                  'correo_institucional', 'telefono', 'direccion']


class ApprovedSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovedSubject
        fields = ['id', 'nrc', 'codigo', 'nombre', 'periodo',
                  'nota', 'oportunidad', 'inscription_type']


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    asignaturas_aprobadas = ApprovedSubjectSerializer(many=True, read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'ppa', 'alerta_academica',
                  'carrera_codigo', 'carrera_nombre',
                  'asignaturas_aprobadas']


class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TeacherProfile
        fields = ['id', 'user', 'rut']


class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = AdminProfile
        fields = ['id', 'user', 'cargo', 'facultad']


class RegisterSerializer(serializers.Serializer):
    rut = serializers.CharField(max_length=12)
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)

    def validate_rut(self, value):
        if User.objects.filter(rut=value).exists():
            raise serializers.ValidationError("Este RUT ya está registrado.")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Las contraseñas no coinciden."})
        return data


class LoginSerializer(serializers.Serializer):
    rut = serializers.CharField(max_length=12)
    password = serializers.CharField(write_only=True)
