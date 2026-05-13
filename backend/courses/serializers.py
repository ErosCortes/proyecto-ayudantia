from rest_framework import serializers
from .models import Course, Section
from users.models import User


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'codigo_curso', 'nombre', 'description', 'metodo_seleccion', 'coordinador', 'created_at', 'updated_at']


class SectionSerializer(serializers.ModelSerializer):
    course_nombre = serializers.CharField(source='course.nombre', read_only=True)
    profesor_nombre = serializers.CharField(source='profesor.nombre_completo', read_only=True)

    class Meta:
        model = Section
        fields = ['id', 'course', 'course_nombre', 'numero', 'profesor', 'profesor_nombre', 'semestre', 'year']
