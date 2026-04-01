# ----------------------
# Imagen base PHP + Apache
# ----------------------
FROM php:8.3-apache

# ----------------------
# Dependencias del sistema
# ----------------------
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev curl npm \
    && docker-php-ext-install pdo_mysql zip mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ----------------------
# Composer
# ----------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ----------------------
# Directorio de trabajo
# ----------------------
WORKDIR /app
COPY . /app

# ----------------------
# PHP: instalar dependencias
# ----------------------
RUN composer install --ignore-platform-reqs --no-interaction --optimize-autoloader

# ----------------------
# Node / Frontend
# ----------------------
RUN npm install
RUN npm run build

# ----------------------
# Permisos y Apache
# ----------------------
RUN chown -R www-data:www-data /app
RUN a2enmod rewrite

# ----------------------
# CMD seguro: migraciones solo si DB está lista
# ----------------------
CMD ["sh", "-c", "\
  php artisan config:clear && \
  php artisan cache:clear && \
  until php -r \"try { new PDO('mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); echo 'DB ready'; } catch (Exception $e) { exit(1); }\"; do echo 'Waiting for DB...'; sleep 3; done && \
  php artisan migrate --force && \
  vendor/bin/heroku-php-apache2 public/ \
"]