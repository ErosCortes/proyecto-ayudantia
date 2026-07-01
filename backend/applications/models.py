from decimal import Decimal
from django.core.exceptions import ValidationError
from django.db.models import OuterRef, Subquery
from django.db import models
from django.conf import settings
from courses.models import Section
from users.models import ApprovedSubject
class PostulationQuerySet(models.QuerySet):

    CRITERIOS_ORDEN = {
        'ppa': ['-id_alumno__alumno_profile__ppa', 'fecha_creacion'],
        'nota_curso': ['-nota_en_curso', 'fecha_creacion'],
        'fecha': ['fecha_creacion'],
        'fecha_desc': ['-fecha_creacion'],
        'nombre': ['id_alumno__nombre_completo'],
        'prioridad': [
            '-id_alumno__alumno_profile__ppa',
            '-nota_en_curso',
            'fecha_creacion',
        ],
    }

    def con_nota_curso(self):
        nota_subquery = ApprovedSubject.objects.filter(
            student__user=OuterRef('id_alumno'),
            codigo=OuterRef('id_curso__course__codigo_curso'),
        ).order_by('-nota').values('nota')[:1]

        return self.annotate(nota_en_curso=Subquery(nota_subquery))

    def ordenar_por(self, criterio='prioridad'):
        campos = self.CRITERIOS_ORDEN.get(criterio, self.CRITERIOS_ORDEN['prioridad'])
        qs = self.select_related('id_alumno__alumno_profile', 'id_curso__course')

        if 'nota_en_curso' in ''.join(campos):
            qs = qs.con_nota_curso()

        return qs.order_by(*campos)

    def por_prioridad(self):
        return self.ordenar_por('prioridad')
    
class Postulation(models.Model):
    PPA_MINIMO = Decimal('5.0')

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

    objects = PostulationQuerySet.as_manager()

    class Meta:
        verbose_name = "Postulación"
        verbose_name_plural = "Postulaciones"
        unique_together = ['id_alumno', 'id_curso']

    def __str__(self):
        return f"{self.id_alumno.nombre_completo} → {self.id_curso} ({self.estado})"

    def clean(self):
        super().clean()

        # Estas validaciones solo aplican al CREAR la postulación,
        # no al cambiar su estado después.
        if self.pk is None:
            if not self.id_alumno.es_alumno:
                raise ValidationError("Solo alumnos activos pueden postular.")

            perfil = self.id_alumno.alumno_profile
            curso = self.id_curso.course

            if not curso.ayudantia_activa:
                raise ValidationError("Este curso no tiene ayudantía activa este semestre.")

            if perfil.ppa is None:
                raise ValidationError("El alumno no tiene PPA registrado.")

            if perfil.ppa < self.PPA_MINIMO:
                raise ValidationError(f"El PPA mínimo para postular es {self.PPA_MINIMO}.")

            aprobo_el_curso = ApprovedSubject.objects.filter(
                student=perfil,
                codigo=curso.codigo_curso,
            ).exists()

            if not aprobo_el_curso:
                raise ValidationError("No puedes postular a ayudante de un curso que no has aprobado")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)