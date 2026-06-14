from django.contrib import admin
from .models import Course, Section


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('codigo_curso', 'nombre', 'metodo_seleccion', 'coordinador')
    list_filter = ('metodo_seleccion',)
    search_fields = ('codigo_curso', 'nombre_curso')


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('course', 'nrc', 'profesor', 'semestre', 'year')
    list_filter = ('semestre', 'year')
    search_fields = ('course__codigo_curso', 'profesor__email')