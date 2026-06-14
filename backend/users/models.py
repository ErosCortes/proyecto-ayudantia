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
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='alumno_profile')

    def __str__(self):
        return f"Alumno: {self.user.nombre_completo}"
    

class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='profesor_profile')
    rut = models.CharField(max_length=12, blank= True)

    def __str__(self):
        return f"Profesor: {self.user.nombre_completo}"


class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='admin_profile')
    cargo = models.CharField(max_length=100, blank=True)
    facultad = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Admin: {self.user.nombre_completo}"
