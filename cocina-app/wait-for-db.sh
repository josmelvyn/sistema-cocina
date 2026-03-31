#!/bin/bash
set -e

host="$MYSQLHOST"
port="$MYSQLPORT"

echo "Esperando a que MySQL esté disponible en $host:$port..."

while ! nc -z "$host" "$port"; do
  echo "MySQL no está listo, esperando..."
  sleep 2
done

echo "MySQL está listo!"