#def save_user_role(backend, user, response, *args, **kwargs):
#    email = user.email
#
#    if email.endswith("@alumnos.ucn.cl"):
#        user.tipo_usuario = "estudiante"
#
#    elif email.endswith("@ucn.cl") or email.endswith("@ce.ucn.cl"):
#        user.tipo_usuario = "profesor"
#
#    else:
#        raise Exception("Correo no autorizado")
#
#    user.save()


def redirect_user(backend, user, response, *args, **kwargs):

    email = user.email.lower()

    # PROFESOR
    if email == "profesorucntest@gmail.com":
        return {
            "redirect_url": "http://localhost:3000/teacher"
        }

    # ESTUDIANTE
    if email == "lucastrujillo01@alumnos.ucn.cl":
        return {
            "redirect_url": "http://localhost:3000/student"
        }

    return {
        "redirect_url": "http://localhost:3000/"
    }