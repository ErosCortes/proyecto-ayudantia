from django.db import models
from django.contrib.auth.models import User

# Modelo para Cursos
class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"
    
    def __str__(self):
        return f"{self.code} - {self.name}"


# Modelo para Ayudantías
class Tutorship(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Activa'),
        ('COMPLETED', 'Completada'),
        ('CANCELLED', 'Cancelada'),
    ]
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="tutorships")
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tutorships_created", null=True)
    student = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="tutorships_assigned", null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Ayudantía"
        verbose_name_plural = "Ayudantías"
    
    def __str__(self):
        return f"Ayudantía: {self.course.code} - {self.status}"


# Modelo para Historial de Ayudantes
class TutorshipHistory(models.Model):
    tutorship = models.ForeignKey(Tutorship, on_delete=models.CASCADE, related_name="history")
    action = models.CharField(max_length=50)  # CREATED, UPDATED, COMPLETED, CANCELLED
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Historial de Ayudantía"
        verbose_name_plural = "Historial de Ayudantías"
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"Historial: {self.tutorship} - {self.action}"


# Modelo para perfil de usuario
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('STUDENT', 'Estudiante'),
        ('TEACHER', 'Profesor'),
        ('ADMIN', 'Administrador'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"
    
    def __str__(self):
        return f"Perfil de {self.user.email} - {self.role}"
