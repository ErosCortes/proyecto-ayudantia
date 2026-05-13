from django.db import models
from users.models import User
from courses.models import Section


class AssistantHistory(models.Model):
    ESTADO_CHOICES = [
        ('COMPLETADA', 'Completada'),
        ('INCOMPLETA', 'Incompleta'),
        ('CANCELADA', 'Cancelada'),
    ]

    id_alumno = models.ForeignKey(User, on_delete=models.CASCADE,
                                  related_name='historial')
    id_curso = models.ForeignKey(Section, on_delete=models.CASCADE,
                                 related_name='historial')
    semestre = models.CharField(max_length=20)   # ej: "2025-1"
    estado_final = models.CharField(max_length=20, choices=ESTADO_CHOICES,
                                    default='COMPLETADA')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Historial de Ayudantía"
        verbose_name_plural = "Historial de Ayudantías"
        ordering = ['-semestre']

    def __str__(self):
        return f"{self.id_alumno.nombre_completo} - {self.id_curso} ({self.semestre})"