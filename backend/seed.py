import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User, StudentProfile, TeacherProfile, AdminProfile
from courses.models import Course, Section
from applications.models import Postulation

print("🌱 Creando datos de prueba...")

# ─── USUARIOS ───────────────────────────────────────────

# Admin
admin = User.objects.create_superuser(
    username='admin',
    email='admin@ucn.cl',
    password='admin1234',
    nombre_completo='Administrador UCN'
)
AdminProfile.objects.create(user=admin, cargo='Jefe de Departamento', facultad='Ingeniería')
print("✓ Admin creado")

# Profesores
prof1 = User.objects.create_user(
    username='profesor1',
    email='juan.perez@ce.ucn.cl',
    password='prof1234',
    nombre_completo='Juan Pérez'
)
TeacherProfile.objects.create(user=prof1, departamento='Informática')

prof2 = User.objects.create_user(
    username='profesor2',
    email='maria.gonzalez@ce.ucn.cl',
    password='prof1234',
    nombre_completo='María González'
)
TeacherProfile.objects.create(user=prof2, departamento='Matemáticas')
print("✓ Profesores creados")

# Alumnos
alumnos_data = [
    ('pedro.ramirez', 'pedro.ramirez@alumnos.ucn.cl', 'Pedro Ramírez', 5.8),
    ('camila.torres', 'camila.torres@alumnos.ucn.cl', 'Camila Torres', 6.1),
    ('javier.soto', 'javier.soto@alumnos.ucn.cl', 'Javier Soto', 5.2),
    ('ana.silva', 'ana.silva@alumnos.ucn.cl', 'Ana Silva', 6.5),
    ('luis.mora', 'luis.mora@alumnos.ucn.cl', 'Luis Mora', 4.9),
]

alumnos = []
for username, email, nombre, ppa in alumnos_data:
    alumno = User.objects.create_user(
        username=username,
        email=email,
        password='alumno1234',
        nombre_completo=nombre
    )
    StudentProfile.objects.create(user=alumno, ppa=ppa)
    alumnos.append(alumno)

print("✓ Alumnos creados")

# ─── CURSOS ─────────────────────────────────────────────

curso1 = Course.objects.create(
    codigo_curso='ICI3103',
    nombre='Programación I',
    metodo_seleccion='INDIVIDUAL'
)

curso2 = Course.objects.create(
    codigo_curso='ICI4150',
    nombre='Bases de Datos',
    metodo_seleccion='COORDINADOR',
    coordinador=prof1
)

curso3 = Course.objects.create(
    codigo_curso='MAT1101',
    nombre='Cálculo I',
    metodo_seleccion='INDIVIDUAL'
)
print("✓ Cursos creados")

# ─── SECCIONES ──────────────────────────────────────────

secciones = [
    Section(course=curso1, numero=1, profesor=prof1, semestre='2025-1', year=2025),
    Section(course=curso1, numero=2, profesor=prof2, semestre='2025-1', year=2025),
    Section(course=curso2, numero=1, profesor=prof1, semestre='2025-1', year=2025),
    Section(course=curso3, numero=1, profesor=prof2, semestre='2025-1', year=2025),
    Section(course=curso3, numero=2, profesor=prof2, semestre='2025-1', year=2025),
]
Section.objects.bulk_create(secciones)
secciones = list(Section.objects.all())
print("✓ Secciones creadas")

# ─── POSTULACIONES ──────────────────────────────────────

Postulation.objects.create(id_alumno=alumnos[0], id_curso=secciones[0], estado='PENDIENTE')
Postulation.objects.create(id_alumno=alumnos[1], id_curso=secciones[0], estado='ACEPTADA')
Postulation.objects.create(id_alumno=alumnos[2], id_curso=secciones[1], estado='RECHAZADA')
Postulation.objects.create(id_alumno=alumnos[3], id_curso=secciones[2], estado='PENDIENTE')
Postulation.objects.create(id_alumno=alumnos[4], id_curso=secciones[3], estado='PENDIENTE')
print("✓ Postulaciones creadas")

print("\n✅ Seed completado.")
print("   Admin:    admin@ucn.cl / admin1234")
print("   Profesor: juan.perez@ce.ucn.cl / prof1234")
print("   Alumno:   pedro.ramirez@alumnos.ucn.cl / alumno1234")