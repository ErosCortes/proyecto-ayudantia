from rest_framework import serializers
from .models import AssistantHistory


class AssistantHistorySerializer(serializers.ModelSerializer):
    alumno_nombre = serializers.CharField(source='id_alumno.nombre_completo', read_only=True)
    alumno_rut = serializers.CharField(source='id_alumno.rut', read_only=True)
    curso_nombre = serializers.CharField(source='id_curso.course.nombre', read_only=True)
    curso_codigo = serializers.CharField(source='id_curso.course.codigo_curso', read_only=True)
    seccion_nrc = serializers.CharField(source='id_curso.nrc', read_only=True)

    class Meta:
        model = AssistantHistory
        fields = [
            'id',
            'id_alumno',
            'alumno_nombre',
            'alumno_rut',
            'id_curso',
            'curso_nombre',
            'curso_codigo',
            'seccion_nrc',
            'semestre',
            'estado_final',
            'created_at',
        ]
