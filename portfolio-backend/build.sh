#!/usr/bin/env bash

# Exit on error
set -e

echo "Installation des dépendances Composer..."
composer install --no-dev --optimize-autoloader

echo "Mise en cache de la configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Exécution des migrations de la base de données..."
php artisan migrate --force

echo "Génération de la clé d'application si absente..."
php artisan key:generate --force || true

echo "Build terminé avec succès !"
