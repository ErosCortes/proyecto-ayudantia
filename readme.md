# Proyecto Ayudantías UCN

## 🧱 Tecnologías

* Backend: Django + PostgreSQL
* Frontend: React

---

## 🚀 Backend

```bash
cd backend
# Crear entorno virtual
python -m venv venv

# Activar entorno
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py migrate

# Poblar base de datos con datos de prueba
python seed.py

# Ejecutar servidor
python manage.py runserver
```

---

## ⚛️ Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar proyecto
npm start
```

---

## 🔐 Variables de entorno

Crear archivo `.env` en `backend/`:

DB_NAME=ayudantias_db
DB_USER=postgres
DB_PASSWORD=Admin2307
DB_HOST=localhost
DB_PORT=5432

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=<Las credenciales son las de las otra vez que mando el Eros, esta e el wtsp>
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=<Las credenciales son las de las otra vez que mando el Eros, esta e el wtsp>   
---

## 🌐 OAuth Google

Configurar credenciales en Google Cloud Console.
Aqui yo ya cree las credenciales con google, cualquier cosa me dicen nomas xd (funciona 24/7 suuuuuu)

Redirect URI:

```
http://localhost:8000/auth/complete/google-oauth2/
```


---

## 🧪 Usuarios de prueba

Para probar el sistema sin correos institucionales, agregar en `users/pipeline.py`:

```python
# ── CORREOS DE PRUEBA (eliminar antes de entregar) ── #A mi no me dejo crear un correo en google, por el numero de telefono
if email == "tucorreo@gmail.com": #solo cambien el correo en el if y esta listo 
    AdminProfile.objects.get_or_create(user=user, defaults={'cargo': '', 'facultad': ''})
    user.is_staff = True
    user.save()
    return
```

Dominios válidos en producción:
- `@alumnos.ucn.cl` → Alumno
- `@ce.ucn.cl` → Profesor
- `@ucn.cl` → Administrador

---

## 📁 Estructura del proyecto
backend/
core/          → configuración Django
users/         → usuarios y perfiles
courses/       → cursos y secciones
applications/  → postulaciones
history/       → historial de ayudantías
seed.py        → datos de prueba
frontend/
src/
pages/       → páginas por rol (admin, student, teacher)
components/  → componentes reutilizables
config/      → configuración de la API
data/        → datos mock temporales
