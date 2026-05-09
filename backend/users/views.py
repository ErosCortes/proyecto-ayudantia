from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required


@login_required
def oauth_success(request):

    email = request.user.email.lower()

    # PROFESOR
    if email == "profesorucntest@gmail.com":
        return redirect("http://localhost:3000/teacher")

    # ESTUDIANTE
    if email == "lucastrujillo01@alumnos.ucn.cl":
        return redirect("http://localhost:3000/student")

    return redirect("http://localhost:3000/")