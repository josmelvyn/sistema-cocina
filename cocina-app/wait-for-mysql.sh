#!/bin/sh

# Esperar a que MySQL esté listo antes de ejecutar migraciones
echo "Esperando a MySQL en $DB_HOST:$DB_PORT..."

until mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "select 1" > /dev/null 2>&1; do
  echo "MySQL no disponible aún, esperando 5 segundos..."
  sleep 5
done

echo "MySQL listo, continuando..."