#Solo para DEMO no usar como version definitva

# Proyecto Ayudantías UCN

## 🧱 Tecnologías

* Backend: Django + PostgreSQL
* Frontend: React

---

## 🚀 Backend

```bash
cd backend

# Version de python utilizada es: (para que lo tengan en consideracion)
python version 3.14.4

# Crear entorno virtual
python -m venv venv

# Activar entorno
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py migrate

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

```
DB_NAME=ayudantias_db
DB_USER=postgres
DB_PASSWORD=tu_password  (Admin2307 le puse esa al azars, por si crean una bd en sus pc para tener la misma password los 3)
DB_HOST=localhost
DB_PORT=5432
```

---

## 🌐 OAuth Google

Configurar credenciales en Google Cloud Console.
Aqui yo ya cree las credenciales con google, cualquier cosa me dicen nomas xd (funciona 24/7 suuuuuu)

Redirect URI:

```
http://localhost:8000/auth/complete/google-oauth2/
```
