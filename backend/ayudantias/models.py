from django.db import models
from users.models import Alumno
from cursos.models import Paralelo


# ─────────────────────────────────────────
# POSTULACION
# ─────────────────────────────────────────
class Postulacion(models.Model):

    ESTADO = [
        ('pendiente', 'Pendiente'),
        ('aceptada', 'Aceptada'),
        ('rechazada', 'Rechazada'),
    ]

    alumno = models.ForeignKey(
        Alumno,
        on_delete=models.CASCADE,
        related_name='postulaciones'
    )

    paralelo = models.ForeignKey(
        Paralelo,
        on_delete=models.CASCADE,
        related_name='postulaciones'
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADO,
        default='pendiente'
    )

    comentario = models.TextField(
        blank=True
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        unique_together = [
            'alumno',
            'paralelo'
        ]

    def __str__(self):

        return (
            f"{self.alumno} "
            f"→ {self.paralelo} "
            f"[{self.estado}]"
        )


# ─────────────────────────────────────────
# AYUDANTE ASIGNADO
# ─────────────────────────────────────────
class AyudanteAsignado(models.Model):

    alumno = models.ForeignKey(
        Alumno,
        on_delete=models.CASCADE,
        related_name='ayudantias'
    )

    paralelo = models.ForeignKey(
        Paralelo,
        on_delete=models.CASCADE,
        related_name='ayudantes'
    )

    fecha_asignacion = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.alumno} "
            f"- {self.paralelo}"
        )


# ─────────────────────────────────────────
# HISTORIAL DE AYUDANTÍAS
# ─────────────────────────────────────────
class HistorialAyudantias(models.Model):

    alumno = models.ForeignKey(
        Alumno,
        on_delete=models.CASCADE,
        related_name='historial'
    )

    paralelo = models.ForeignKey(
        Paralelo,
        on_delete=models.CASCADE,
        related_name='historial'
    )

    estado_final = models.CharField(
        max_length=50
    )

    def __str__(self):

        return (
            f"{self.alumno} | "
            f"{self.paralelo}"
        )