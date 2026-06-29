import json
import os
from django.core.management.base import BaseCommand
from users.models import User, StudentProfile, ApprovedSubject


class Command(BaseCommand):
    help = 'Importa un estudiante desde un archivo JSON (ejemploEstudiante.txt)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default=os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ejemploEstudiante.txt'),
            help='Ruta al archivo JSON del estudiante'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='test1234',
            help='Contraseña para el usuario'
        )

    def handle(self, *args, **options):
        filepath = os.path.abspath(options['file'])
        password = options['password']

        if not os.path.exists(filepath):
            self.stderr.write(self.style.ERROR(f'Archivo no encontrado: {filepath}'))
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        rut = data.get('rut')
        if not rut:
            self.stderr.write(self.style.ERROR('El archivo no contiene un RUT válido'))
            return

        if User.objects.filter(rut=rut).exists():
            self.stdout.write(self.style.WARNING(f'El usuario con RUT {rut} ya existe. Saltando...'))
            return

        user = User.objects.create_user(
            username=rut,
            rut=rut,
            password=password,
            nombre_completo=data.get('nombre', ''),
            correo_institucional=data.get('correo', ''),
            telefono=data.get('telefono', ''),
            direccion=data.get('direccion', ''),
        )

        carrera = data.get('carrera', {})
        profile = StudentProfile.objects.create(
            user=user,
            ppa=data.get('ppa'),
            alerta_academica=data.get('alertaAcademica', False),
            carrera_codigo=carrera.get('codigo', ''),
            carrera_nombre=carrera.get('nombre', ''),
        )

        asignaturas = data.get('asignaturasAprobadas', [])
        for mat in asignaturas:
            ApprovedSubject.objects.create(
                student=profile,
                nrc=mat.get('nrc', ''),
                codigo=mat.get('codigo', ''),
                nombre=mat.get('nombre', ''),
                periodo=mat.get('periodo', ''),
                nota=mat.get('nota', 0),
                oportunidad=mat.get('oportunidad', 1),
                inscription_type=mat.get('inscriptionType', 'REGULAR'),
            )

        self.stdout.write(self.style.SUCCESS(
            f'Estudiante {data.get("nombre")} ({rut}) creado exitosamente.\n'
            f'  Login: {rut} / {password}'
        ))
