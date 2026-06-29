from rest_framework.permissions import BasePermission, SAFE_METHODS


class EsAdmin(BasePermission):
    """Solo administradores"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            hasattr(request.user, 'admin_profile') or request.user.is_staff
        )


class EsProfesor(BasePermission):
    """Solo profesores"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profesor_profile')


class EsAlumno(BasePermission):
    """Solo alumnos"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'alumno_profile')


class EsAdminOSoloLectura(BasePermission):
    """Admin puede todo, el resto solo puede leer (GET)"""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return hasattr(request.user, 'admin_profile') or request.user.is_staff