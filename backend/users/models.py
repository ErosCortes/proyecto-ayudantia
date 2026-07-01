from django.db import models
from django.contrib.auth.models import AbstractUser

#Usuario
class User(AbstractUser):
    rut = models.CharField(max_length=12, unique=True, null=True, blank=True)
    correo_institucional = models.EmailField(unique=True, null=True, blank=True)
    nombre_completo = models.CharField(max_length=150, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    direccion = models.TextField(blank=True)

    def __str__(self):
        return f"{self.nombre_completo} ({self.rut})"

    @property
    def es_alumno(self):
        return hasattr(self, 'alumno_profile') and self.alumno_profile.alumno_activo
    
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
    ppa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    alerta_academica = models.BooleanField(default=False)
    carrera_codigo = models.CharField(max_length=10, blank=True)
    carrera_nombre = models.CharField(max_length=150, blank=True)
    alumno_activo = models.BooleanField(default=True)
    def __str__(self):
        return f"Alumno: {self.user.nombre_completo}"


class ApprovedSubject(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE,
                                related_name='asignaturas_aprobadas')
    nrc = models.CharField(max_length=20)
    codigo = models.CharField(max_length=20)
    nombre = models.CharField(max_length=200)
    periodo = models.CharField(max_length=10)
    nota = models.DecimalField(max_digits=4, decimal_places=2)
    oportunidad = models.IntegerField()
    inscription_type = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.codigo} - {self.nombre} ({self.nota})"


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
