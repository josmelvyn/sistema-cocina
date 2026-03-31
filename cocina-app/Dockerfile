# Dockerfile para Laravel + Node + Railway

# 1️⃣ Base PHP + Apache
FROM php:8.3-apache

# 2️⃣ Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libonig-dev \
    curl \
    npm \
    && docker-php-ext-install pdo_mysql zip mbstring

# 3️⃣ Instalar Composer global
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4️⃣ Configurar directorio de trabajo
WORKDIR /app
COPY . /app

# 5️⃣ Instalar dependencias de PHP
RUN composer install --ignore-platform-reqs --no-interaction --optimize-autoloader

# 6️⃣ Instalar dependencias de Node (usar npm install para evitar problemas con lock)
RUN npm install
RUN npm run build

# 7️⃣ Configurar permisos y Apache
RUN chown -R www-data:www-data /app
RUN a2enmod rewrite

# 8️⃣ No ejecutar migraciones aquí; se harán en Start Command de Railway
# 9️⃣ Comando por defecto para iniciar Apache
CMD ["vendor/bin/heroku-php-apache2", "public/"]