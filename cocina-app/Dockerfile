# Usamos PHP + Apache
FROM php:8.3-apache

# Instalaciones necesarias (Composer, Node.js, extensiones PHP)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    npm \
    && docker-php-ext-install pdo_mysql zip

# Instalar Composer global
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar proyecto al contenedor
WORKDIR /app
COPY . /app

# Instalar dependencias
RUN composer install --ignore-platform-reqs
RUN npm ci
RUN npm run build

# Configurar Apache para Laravel
RUN chown -R www-data:www-data /app
RUN a2enmod rewrite

# No ejecutar php artisan migrate aquí, se hará en Start Command
CMD ["vendor/bin/heroku-php-apache2", "public/"]