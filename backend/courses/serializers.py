from rest_framework import serializers
from .models import Course, Section
from users.models import User
from applications.models import Postulation


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'codigo_curso', 'nombre', 'metodo_seleccion', 'coordinador','ayudantia_activa']


class SectionSerializer(serializers.ModelSerializer):
    course_nombre = serializers.CharField(source='course.nombre', read_only=True)
    profesor_nombre = serializers.CharField(source='profesor.nombre_completo', read_only=True)
    postulantes_pendientes = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ['id', 'course', 'course_nombre', 'nrc', 'profesor', 'profesor_nombre',
                  'semestre', 'year', 'postulantes_pendientes']

    def get_postulantes_pendientes(self, obj):
        return Postulation.objects.filter(curso=obj.course, estado='PENDIENTE').count()
