from django.contrib import admin

from .models import Usuario, Alumno, Profesor

admin.site.register(Usuario)
admin.site.register(Alumno)
admin.site.register(Profesor)