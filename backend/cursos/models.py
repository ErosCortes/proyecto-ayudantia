from django.db import models
from users.models import Profesor


# ─────────────────────────────────────────
# CURSO
# ─────────────────────────────────────────
class Curso(models.Model):

    codigo_curso = models.CharField(
        max_length=20,
        unique=True
    )

    nombre_curso = models.CharField(
        max_length=200
    )

    def __str__(self):

        return (
            f"{self.codigo_curso} "
            f"- {self.nombre_curso}"
        )


# ─────────────────────────────────────────
# PARALELO
# ─────────────────────────────────────────
class Paralelo(models.Model):

    ESTADO_POSTULACION = [
        ('abierta', 'Abierta'),
        ('cerrada', 'Cerrada'),
    ]

    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name='paralelos'
    )

    profesor = models.ForeignKey(
        Profesor,
        on_delete=models.CASCADE,
        related_name='paralelos'
    )

    seccion = models.CharField(
        max_length=10
    )

    semestre = models.CharField(
        max_length=10
    )

    estado_postulacion = models.CharField(
        max_length=20,
        choices=ESTADO_POSTULACION,
        default='abierta'
    )

    vacantes = models.PositiveIntegerField(
        default=1
    )

    # Requisitos específicos del paralelo
    ppa_minimo = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        null=True,
        blank=True
    )

    requiere_entrevista = models.BooleanField(
        default=False
    )

    class Meta:

        unique_together = [
            'curso',
            'seccion',
            'semestre'
        ]

    def __str__(self):

        return (
            f"{self.curso.codigo_curso} "
            f"- Sección {self.seccion} "
            f"({self.semestre})"
        )