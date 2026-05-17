from django.db import models
from django.conf import settings
from courses.models import Section


class Postulation(models.Model):
    STATUS_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('ACEPTADA', 'Aceptada'),
        ('RECHAZADA', 'Rechazada'),
    ]

    id_alumno = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                  related_name='postulaciones')
    id_curso = models.ForeignKey(Section, on_delete=models.CASCADE,
                                 related_name='postulaciones')
    estado = models.CharField(max_length=20, choices=STATUS_CHOICES,
                              default='PENDIENTE')
    comentario = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Postulación"
        verbose_name_plural = "Postulaciones"
        unique_together = ['id_alumno', 'id_curso']

    def __str__(self):
        return f"{self.id_alumno.nombre_completo} → {self.id_curso} ({self.estado})"