# Restaurantes-App (Frontend)

Aplicación frontend en React para gestionar reservas de restaurantes. Permite crear, listar, editar y cancelar reservas. Está conectada a un backend desarrollado en Flask.

## 🚀 Tecnologías

- React + Vite
- TypeScript
- Tailwind CSS
- Axios
- Context API para manejo de estado global
- Icons: Lucide

## 📦 Estructura del Proyecto

/src
├── components/ # Componentes reutilizables
├── pages/ # Páginas principales
├── services/ # Lógica de conexión con el backend (Axios)
├── context/ # AppContext global
├── types/ # Definición de interfaces y tipos
├── utils/ # Conexión con las variables de entorno
├── env.ts # Variables de entorno (API_URL, etc.)
└── main.tsx # Entry point

## ⚙️ Configuración Inicial

1. Clona el repositorio:
   ```bash
   git clone <repo_url>
   cd frontend

--   

2. Crea un archivo .env en la raíz con las siguientes variables:

VITE_PUBLIC_API_URL=http://<tu_ip_local>:5000/api
VITE_APP_NAME=Restaurantes-App

--

3. Instala las dependencias:

npm install

--

4. Corre la aplicación:

npm run dev

--

🧠 Funcionalidades Principales
📋 Listado de reservas

➕ Crear nueva reserva

✅ Confirmar / ❌ Cancelar reserva

🔍 Buscar reserva por DNI + código

🗑️ Eliminar reserva (soft delete)

🏢 Gestión de restaurantes (crear, editar, eliminar)

🔗 Conexión con Backend
El frontend consume una API REST hecha en Flask disponible en VITE_PUBLIC_API_URL.

📌 Notas
El proyecto está preparado para funcionar en red local (útil para evaluaciones).

El manejo de estado se realiza a través de useAppContext.

Las reservas se ordenan por fecha/hora descendente en el listado.