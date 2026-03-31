FROM php:8.3-apache

# Dependencias
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

# Permisos
RUN chown -R www-data:www-data /app

EXPOSE 80

# Script de espera para BD
RUN apt-get install -y netcat-traditional
COPY wait-for-db.sh /usr/local/bin/wait-for-db.sh
RUN chmod +x /usr/local/bin/wait-for-db.sh

# Start command con espera
CMD ["sh", "-c", "wait-for-db.sh && php artisan config:clear && php artisan cache:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"]