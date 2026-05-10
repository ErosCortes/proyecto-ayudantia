# Importar todos los cruds para facilitar el acceso
from .courses_cruds import manage_courses, course_detail
from .tutorship_cruds import get_tutorship_history

__all__ = [
    'manage_courses',
    'course_detail',
    'get_tutorship_history',
]
