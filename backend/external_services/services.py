import requests
from django.conf import settings


def get_cursos(periodo='202520'):
    """Obtiene todos los cursos de un período"""
    try:
        response = requests.get(
            f'{settings.UCN_API_PUCLARO}/course/ecin-courses',
            params={
                'token': settings.UCN_API_TOKEN,
                'period': periodo
            }
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error al obtener cursos: {e}")
        return []


def get_alumnos(periodo='202520'):
    """Obtiene los alumnos de un período"""
    url = f'{settings.UCN_API_LOSVILOS}/estudiantes-periodo-a?{periodo}'
    print(f"[DEBUG] URL: {url}")
    try:
        response = requests.post(url, headers={'X-HAWAII-AUTH': settings.UCN_API_TOKEN})
        print(f"[DEBUG] Status: {response.status_code}")
        print(f"[DEBUG] Response (first 200): {response.text[:200]}")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"[DEBUG] Error: {e}")
        return []


def get_profesor(rut, periodo='202520'):
    """Obtiene los datos de un profesor por RUT"""
    try:
        response = requests.get(
            f'{settings.UCN_API_PUCLARO}/teacher/teacher-courses',
            params={
                'token': settings.UCN_API_TOKEN,
                'period': periodo,
                'rut': rut
            }
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error al obtener profesor {rut}: {e}")
        return None


def sync_profesor(rut, periodo='202520'):
    """Sincroniza las secciones de un profesor desde la API UCN"""
    from courses.models import Course, Section
    from users.models import User

    rut_base = rut.replace('.', '').replace('-', '')
    try:
        profesor = User.objects.get(rut=rut)
    except User.DoesNotExist:
        try:
            profesor = User.objects.get(rut=rut_base)
        except User.DoesNotExist:
            try:
                profesor = User.objects.get(rut__contains=rut_base)
            except User.DoesNotExist:
                return None

    data = get_profesor(rut_base, periodo)
    if not data or not data.get('asignaturas'):
        return None

    year = int(str(periodo)[:4])
    semestre = str(periodo)[4:]

    for asignatura in data['asignaturas']:
        course, _ = Course.objects.get_or_create(
            codigo_curso=asignatura['codigo'],
            defaults={'nombre': asignatura.get('asignatura', '')}
        )
        Section.objects.update_or_create(
            nrc=asignatura['nrc'],
            defaults={
                'course': course,
                'profesor': profesor,
                'semestre': semestre,
                'year': year
            }
        )

    return data