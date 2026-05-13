from django.db import models
from users.models import User

class Course(models.Model):
  METODO_SELECCION = [
    ('COORDINADOR', 'Un profesor coordina todos los paralelos'),
    ('INDIVIDUAL', 'Cada profesor elije su propio ayudante'),
  ]

  codigo_curso = models.CharField(max_length=20, unique=True)
  nombre = models.CharField(max_length=100)
  description = models.TextField(blank=True)
  metodo_seleccion = models.CharField(max_length=20,
                                      choices=METODO_SELECCION,
                                      default='INDIVIDUAL')
  coordinador = models.ForeignKey(User, on_delete=models.SET_NULL,null=True, blank=True,
                                  related_name='cursos_coordinados')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    verbose_name = "Curso"
    verbose_name_plural = "Cursos"

  def __str__(self):
    return f"{self.codigo_curso} - {self.nombre}"


class Section(models.Model):
  course = models.ForeignKey(Course, on_delete=models.CASCADE,
                             related_name='sections')
  numero = models.IntegerField()
  profesor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='secciones')
  semestre = models.CharField(max_length=20) # ej 2025-1
  year  = models.IntegerField()

  class Meta:
    verbose_name = "Seccion"
    verbose_name ="Secciones"
    unique_together =['course','numero','semestre','year']

  def __str__(self):
    return f"{self.course.codigo_curso} - Seccion {self.numero} ({self.semestre})"
# Create your models here.
