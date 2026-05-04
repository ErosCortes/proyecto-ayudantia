def save_user_role(backend, user, response, *args, **kwargs):
    email = user.email

    if email.endswith("@alumnos.ucn.cl"):
        user.tipo_usuario = "estudiante"

    elif email.endswith("@ucn.cl") or email.endswith("@ce.ucn.cl"):
        user.tipo_usuario = "profesor"

    else:
        raise Exception("Correo no autorizado")

    user.save()