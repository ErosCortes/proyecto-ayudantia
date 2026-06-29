from rest_framework import serializers
from .models import Postulation


class PostulationSerializer(serializers.ModelSerializer):
    alumno_nombre = serializers.CharField(source='id_alumno.nombre_completo', read_only=True)
    alumno_rut = serializers.CharField(source='id_alumno.rut', read_only=True)
    curso_nombre = serializers.CharField(source='id_curso.course.nombre', read_only=True)
    seccion_nrc = serializers.CharField(source='id_curso.nrc', read_only=True)
    alumno_ppa = serializers.SerializerMethodField()

    class Meta:
        model = Postulation
        fields = ['id', 'id_alumno', 'alumno_nombre', 'alumno_rut', 'alumno_ppa',
                  'id_curso', 'curso_nombre', 'seccion_nrc',
                  'estado', 'comentario', 'fecha_creacion', 'updated_at']

    def get_alumno_ppa(self, obj):
        profile = getattr(obj.id_alumno, 'alumno_profile', None)
        return str(profile.ppa) if profile and profile.ppa else None
