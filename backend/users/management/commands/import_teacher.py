from django.core.management.base import BaseCommand
from users.models import User, TeacherProfile, StudentProfile, ApprovedSubject
from courses.models import Course, Section


TEACHER_DATA = {
    'rut': '6543250-1',
    'username': '6543250-1',
    'password': 'profe1234',
    'nombre_completo': 'MARCOS ENRIQUE CHAIT BOLLO',
    'correo_institucional': 'marcos.chait@ucn.cl',
    'telefono': '+56987654321',
    'direccion': 'Calle del Profesor 123',
}

STUDENT_RUT = '12530047-K'

ASIGNATURAS = [
    {
        'nrc': '22851',
        'codigo': 'ECIN-00464',
        'nombre': 'ARQUITECTURA Y ORG. DE COMP.',
        'periodo': '202520',
        'nota': 5.5,
        'oportunidad': 1,
        'inscription_type': 'REGULAR',
    },
    {
        'nrc': '22850',
        'codigo': 'ECIN-00508',
        'nombre': 'ARQ. Y ORG. DE COMPUTADORES',
        'periodo': '202520',
        'nota': 5.5,
        'oportunidad': 1,
        'inscription_type': 'REGULAR',
    },
]


class Command(BaseCommand):
    help = 'Crea profesor de prueba, cursos, secciones y agrega asignaturas a María'

    def handle(self, *args, **options):
        self._crear_profesor()
        self._crear_cursos_y_secciones()
        self._agregar_asignaturas_a_maria()
        self.stdout.write(self.style.SUCCESS(
            f'\nTodo listo. Profesor: {TEACHER_DATA["rut"]} / {TEACHER_DATA["password"]}'
        ))

    def _crear_profesor(self):
        if User.objects.filter(rut=TEACHER_DATA['rut']).exists():
            self.stdout.write(self.style.WARNING('Profesor ya existe. Saltando...'))
            self.profesor = User.objects.get(rut=TEACHER_DATA['rut'])
            return

        user = User.objects.create_user(
            username=TEACHER_DATA['username'],
            rut=TEACHER_DATA['rut'],
            password=TEACHER_DATA['password'],
            nombre_completo=TEACHER_DATA['nombre_completo'],
            correo_institucional=TEACHER_DATA['correo_institucional'],
            telefono=TEACHER_DATA['telefono'],
            direccion=TEACHER_DATA['direccion'],
        )
        TeacherProfile.objects.create(user=user)
        self.profesor = user
        self.stdout.write(self.style.SUCCESS(f'Profesor {user.nombre_completo} creado'))

    def _crear_cursos_y_secciones(self):
        for idx, data in enumerate(ASIGNATURAS):
            course, created = Course.objects.get_or_create(
                codigo_curso=data['codigo'],
                defaults={'nombre': data['nombre']}
            )
            if created:
                self.stdout.write(f'  Curso creado: {course.nombre}')
            else:
                self.stdout.write(f'  Curso ya existe: {course.nombre}')

            section, created = Section.objects.update_or_create(
                nrc=data['nrc'],
                defaults={
                    'course': course,
                    'profesor': self.profesor,
                    'semestre': '1',
                    'year': 2025,
                }
            )
            if created:
                self.stdout.write(f'  Sección creada: NRC {section.nrc}')
            else:
                self.stdout.write(f'  Sección actualizada: NRC {section.nrc}')

    def _agregar_asignaturas_a_maria(self):
        try:
            student_user = User.objects.get(rut=STUDENT_RUT)
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f'Estudiante con RUT {STUDENT_RUT} no encontrado'))
            return

        profile = student_user.alumno_profile

        for data in ASIGNATURAS:
            _, created = ApprovedSubject.objects.get_or_create(
                student=profile,
                codigo=data['codigo'],
                defaults={
                    'nrc': data['nrc'],
                    'nombre': data['nombre'],
                    'periodo': data['periodo'],
                    'nota': data['nota'],
                    'oportunidad': data['oportunidad'],
                    'inscription_type': data['inscription_type'],
                }
            )
            if created:
                self.stdout.write(f'  Asignatura "{data["nombre"]}" agregada a María')
            else:
                self.stdout.write(f'  Asignatura "{data["nombre"]}" ya estaba en María')
