#!/bin/sh

echo "🛠️ Aplicando migraciones a la DB..."
if [ ! -d "migrations/versions" ] || [ -z "$(ls -A migrations/versions 2>/dev/null)" ]; then
  flask db migrate -m "initial"
fi

until flask db upgrade; do
  echo "Esperando a que la base de datos esté lista..."
  sleep 2
done

echo "🌱 Ejecutando seed inicial..."
python -m app.database.seed_runner

echo "🔥 Levantando la app con Gunicorn..."
exec gunicorn -b 0.0.0.0:5000 main:app