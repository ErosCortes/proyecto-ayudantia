from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UsuarioManager(BaseUserManager):

    def create_user(
        self,
        email,
        nombre_completo,
        password=None,
        **extra_fields
    ):

        if not email:
            raise ValueError('El correo es obligatorio')

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            nombre_completo=nombre_completo,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user


    def create_superuser(
        self,
        email,
        nombre_completo,
        password=None,
        **extra_fields
    ):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(
            email,
            nombre_completo,
            password,
            **extra_fields
        )


class Usuario(AbstractUser):

    objects = UsuarioManager()

    username = None

    rut = models.CharField(max_length=12,unique=True)

    email = models.EmailField(unique=True)

    nombre_completo = models.CharField(max_length=200)

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = [
        'nombre_completo',
        'rut'
    ]

    def __str__(self):
        return self.nombre_completo


class Alumno(models.Model):

    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='alumno'
    )

    ppa = models.DecimalField(
        max_digits=4,
        decimal_places=2
    )

    sanciones = models.BooleanField(default=False)

    situacion_academica = models.CharField(
        max_length=50
    )

    def puede_postular(self):

        return (
            not self.sanciones
            and self.situacion_academica == 'regular'
        )

    def __str__(self):
        return self.usuario.nombre_completo


class Profesor(models.Model):

    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='profesor'
    )

    departamento = models.CharField(
        max_length=100
    )

    def __str__(self):
        return self.usuario.nombre_completo