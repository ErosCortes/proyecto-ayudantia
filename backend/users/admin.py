from django.contrib import admin
from .models import User, StudentProfile, TeacherProfile, AdminProfile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'nombre_completo', 'rut', 'is_staff')
    search_fields = ('email', 'nombre_completo', 'rut')
    ordering = ('nombre_completo',)


@admin.register(StudentProfile)
class AlumnoProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'ppa', 'sanciones', 'situacion_academica')
    list_filter = ('situacion_academica',)
    search_fields = ('user__email', 'user__nombre_completo')


@admin.register(TeacherProfile)
class ProfesorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'departamento')
    search_fields = ('user__email', 'user__nombre_completo', 'departamento')


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'cargo', 'facultad')
    search_fields = ('user__email', 'user__nombre_completo')