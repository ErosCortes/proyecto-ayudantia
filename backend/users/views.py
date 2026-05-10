from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


@login_required
def oauth_success(request):

    email = request.user.email.lower()

    # PROFESOR
    if email == "profesorucntest@gmail.com":
        return redirect("http://localhost:3000/teacher")

    # ESTUDIANTE
    if email.endswith("@alumnos.ucn.cl"):
        return redirect("http://localhost:3000/student")

    #cualquier otro correo
    return redirect("http://localhost:3000/")


@require_http_methods(["POST"])
def logout_user(request):
    """Cierra sesión del usuario y limpia OAuth"""
    # Cerrar sesión normal de Django
    auth_logout(request)
    
    return JsonResponse({
        "message": "Sesión cerrada", 
        "redirect": "http://localhost:3000/"
    })