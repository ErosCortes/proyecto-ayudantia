from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):

    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Tutorship(models.Model):

    subject = models.CharField(max_length=100)

    professor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tutorships'
    )

    slots = models.IntegerField()

    requirements = models.TextField()

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.subject


class Application(models.Model):

    STATUS_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('Aceptado', 'Aceptado'),
        ('Rechazado', 'Rechazado'),
    ]

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    tutorship = models.ForeignKey(
        Tutorship,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    average = models.FloatField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pendiente'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.student.username} - {self.tutorship.subject}"