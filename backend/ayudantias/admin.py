from django.contrib import admin

from .models import (
    Postulacion,
    AyudanteAsignado,
    HistorialAyudantias
)


admin.site.register(Postulacion)
admin.site.register(AyudanteAsignado)
admin.site.register(HistorialAyudantias)