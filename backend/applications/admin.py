from django.contrib import admin
from .models import Postulation


@admin.register(Postulation)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id_alumno', 'id_curso', 'estado', 'fecha_creacion')
    list_filter = ('estado',)
    search_fields = ('id_alumno__email', 'id_curso__course__codigo_curso')