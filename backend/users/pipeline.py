from users.models import StudentProfile, TeacherProfile, AdminProfile


def asignar_perfil_por_correo(backend, user, response, *args, **kwargs):
    email = user.email.lower()
    print(f"DEBUG EMAIL: '{email}'")

    # ── CORREOS DE PRUEBA (eliminar antes de entregar) ──
    if email == "maurolainez555@gmail.com":
        AdminProfile.objects.get_or_create(user=user, defaults={'cargo': '', 'facultad': ''})
        user.is_staff = True
        user.save()
        return
    # TODO: eliminar antes de deploy a producción

    if email == "profesorucntest@gmail.com":
        TeacherProfile.objects.get_or_create(user=user, defaults={'departamento': ''})
        return

    # ── PRODUCCIÓN ──
    if email.endswith('@alumnos.ucn.cl'):
        StudentProfile.objects.get_or_create(user=user)

    elif email.endswith('@ce.ucn.cl'):
        TeacherProfile.objects.get_or_create(user=user, defaults={'departamento': ''})

    elif email.endswith('@ucn.cl'):
        user.is_staff = True
        user.save()
        AdminProfile.objects.get_or_create(user=user, defaults={'cargo': '', 'facultad': ''})

    else:
        # Bloquear correos no institucionales que no sean de prueba
        raise Exception("Correo no autorizado.")


def redirect_por_rol(backend, user, response, *args, **kwargs):
    email = user.email.lower()

    # ── CORREOS DE PRUEBA ──
    if email == "maurolainez555@gmail.com":
        return {'redirect_url': 'http://localhost:3000/admin'}

    if email == "profesorucntest@gmail.com":
        return {'redirect_url': 'http://localhost:3000/teacher'}

    # ── PRODUCCIÓN ──
    if email.endswith('@alumnos.ucn.cl'):
        return {'redirect_url': 'http://localhost:3000/student'}
    elif email.endswith('@ce.ucn.cl'):
        return {'redirect_url': 'http://localhost:3000/teacher'}
    elif email.endswith('@ucn.cl'):
        return {'redirect_url': 'http://localhost:3000/admin'}

    return {'redirect_url': 'http://localhost:3000/'}