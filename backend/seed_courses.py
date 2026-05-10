import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import Course

# Cursos basados en el mockData
courses_data = [
    {
        'name': 'Programación I',
        'code': 'INF101',
        'description': 'Fundamentos de programación'
    },
    {
        'name': 'Bases de Datos',
        'code': 'INF201',
        'description': 'Diseño y modelado de bases de datos'
    },
    {
        'name': 'Cálculo II',
        'code': 'MAT102',
        'description': 'Cálculo avanzado'
    },
]

for course_data in courses_data:
    course, created = Course.objects.get_or_create(
        code=course_data['code'],
        defaults={
            'name': course_data['name'],
            'description': course_data['description']
        }
    )
    if created:
        print(f"✅ Curso creado: {course.code} - {course.name}")
    else:
        print(f"⚠️ Curso ya existe: {course.code}")

print("\n✅ Script completado")
