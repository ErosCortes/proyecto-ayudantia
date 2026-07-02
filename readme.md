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

# Poblar base de datos con datos de prueba (para admin y usuarios random)
python seed.py

#  Crear la estudiante de prueba María (IMPORTANTE, SINO NO FUNCIONARA)
python manage.py import_student

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

DB_NAME=nombre_de_database
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contrasena_de_postgres
DB_HOST=localhost
DB_PORT=colocas_tu_port

SECRET_KEY= pongan cualquier cosa acá
UCN_API_PUCLARO=<el link de puclaro, solo copia el link hasta /api ya que el resto de la url lo maneja el codigo>
UCN_API_LOSVILOS=<lo mismo pero con los vilos>
UCN_API_TOKEN=<el token que nos dieron>
---
