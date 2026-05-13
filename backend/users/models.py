from django.db import models
from django.contrib.auth.models import AbstractUser

#Usuario
class User(AbstractUser):
    rut = models.CharField(max_length=12, unique=True, null=True, blank=True)
    correo_institucional = models.EmailField(unique=True, null=True, blank=True)
    nombre_completo = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"{self.nombre_completo} ({self.email})"

    @property
    def es_alumno(self):
        return hasattr(self, 'alumno_profile')

    @property
    def es_profesor(self):
        return hasattr(self, 'profesor_profile')

    @property
    def es_admin(self):
        return hasattr(self, 'admin_profile') or self.is_staff

    
#Alumno
class StudentProfile(models.Model):
    SITUACION_CHOICES = [
        ('REGULAR', 'Regular'),
        ('CONDICIONAL', 'Condicional'),
        ('SUSPENDIDO', 'Suspendido'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='alumno_profile')
    ppa = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    sanciones = models.IntegerField(default=0)
    situacion_academica = models.CharField(max_length=20,
                                           choices=SITUACION_CHOICES,
                                           default='REGULAR')

    def __str__(self):
        return f"Alumno: {self.user.nombre_completo}"
    

#Profesor 
class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='profesor_profile')
    departamento = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Profesor: {self.user.nombre_completo}"

#Admin 
class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='admin_profile')
    cargo = models.CharField(max_length=100, blank=True)
    facultad = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Admin: {self.user.nombre_completo}"
