from rest_framework import serializers
from .models import Postulation


class PostulationSerializer(serializers.ModelSerializer):
    alumno_nombre = serializers.CharField(source='id_alumno.nombre_completo', read_only=True)
    curso_nombre = serializers.CharField(source='id_curso.course.nombre', read_only=True)
    seccion_numero = serializers.CharField(source='id_curso.numero', read_only=True)

    class Meta:
        model = Postulation
        fields = ['id', 'id_alumno', 'alumno_nombre', 'id_curso', 'curso_nombre', 'seccion_numero', 'estado', 'comentario', 'fecha_creacion', 'updated_at']
