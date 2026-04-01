# Usamos PHP 8.3 con Apache
FROM php:8.3-apache

# -------------------------
# Dependencias del sistema
# -------------------------
RUN apt-get update && \
    apt-get install -y git unzip libzip-dev libonig-dev curl npm && \
    docker-php-ext-install pdo_mysql zip mbstring

# -------------------------
# Composer
# -------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -------------------------
# Directorio de trabajo
# -------------------------
WORKDIR /app
COPY . /app

# -------------------------
# PHP - Composer install
# -------------------------
RUN composer install --ignore-platform-reqs --no-interaction --prefer-dist

# -------------------------
# Node.js - Build frontend
# -------------------------
RUN npm install
RUN npm run build

# -------------------------
# Permisos y Apache
# -------------------------
RUN chown -R www-data:www-data /app
RUN a2enmod rewrite

# -------------------------
# Variables de entorno para producción
# -------------------------
ENV APP_ENV=production
ENV APP_DEBUG=false

# -------------------------
# Comando de arranque
# -------------------------
# Solo corre Apache, las migraciones se hacen aparte
CMD ["vendor/bin/heroku-php-apache2", "public/"]