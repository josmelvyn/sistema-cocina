FROM php:8.3-apache

# Dependencias del sistema
RUN apt-get update && apt-get install -y git unzip libzip-dev libonig-dev curl npm \
    && docker-php-ext-install pdo_mysql zip mbstring

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . /app

# PHP
RUN composer install --ignore-platform-reqs

# Node
RUN npm install
RUN npm run build

# Permisos y Apache
RUN chown -R www-data:www-data /app
RUN a2enmod rewrite

# Start command de Railway se encarga de migraciones
CMD ["vendor/bin/heroku-php-apache2", "public/"]