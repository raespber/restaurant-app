# Restaurantes-App (Backend)

API REST desarrollada en **Flask** con soporte para gestión de **reservas** y **restaurantes**. Utiliza **PostgreSQL** como base de datos y **SQLAlchemy** como ORM. El proyecto está dockerizado para facilitar su despliegue.

---

## 🚀 Tecnologías

- Python 3
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- PostgreSQL
- Docker + Docker Compose
- Swagger (documentación)

---

## ⚙️ Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` con los siguientes campos:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_PASSWORD=tu_password
DATABASE_USER=tu_usuario
DATABASE_NAME=restaurantes_db
DATABASE_URL=postgresql://tu_usuario:tu_password@localhost:5432/restaurantes_db
DOCKER_CONTAINER_NAME_DB=restaurantes-db
JWT_SECRET_KEY=super_secret_key

⚠️ Aunque se define JWT_SECRET_KEY, actualmente la API no utiliza autenticación.

---

### 2. Levantar el Proyecto

docker-compose up --build

Esto levanta dos servicios:
- db: Base de datos PostgreSQL (puerto 5432)
- web: API Flask (puerto 5000)

### 3. Truco importante: migraciones y seeders

Al levantar el proyecto por primera vez con docker-compose up, la base de datos se crea pero las tablas no se aplican automáticamente.

Para que todo funcione correctamente:
Espera a que el contenedor termine de inicializar.
Presiona Ctrl + C para detener los contenedores.

Luego ejecuta:
docker-compose up -d

Esto aplicará correctamente:

Las migraciones

Los datos de prueba (seeders)

📚 Documentación de la API
Una vez levantado el backend, accede a la documentación Swagger en:
- http://localhost:5000/api/docs

📌 Endpoints Principales
Los endpoints disponibles permiten:

CRUD de restaurantes: /restaurantes, /restaurantes/:id

Crear reserva: POST /reservations

Listar reservas: GET /reservations

Buscar reserva por DNI y código: GET /reservations/search

Editar fecha de reserva: PUT /reservations/:id

Eliminar reserva (soft delete): DELETE /reservations/:id

Los filtros por restaurante y fecha se pueden pasar como query params en /reservations, pero también es posible traer todas las reservas.

 Tests
(No se incluyen pruebas unitarias por ahora, pero puede integrarse pytest en el futuro si se desea escalar el sistema.)

✅ Estado del Proyecto
✅ Funcional y conectado al frontend
🔧 Falta implementar autenticación si se desea restringir accesos
📄 Código limpio, estructurado y fácil de mantener

💡 Notas Finales
Corre en red local, ideal para evaluación o pruebas offline

Backend abierto, sin auth, pensado para simplicidad

Puedes inspeccionar directamente la base con cualquier cliente PostgreSQL si necesitas
