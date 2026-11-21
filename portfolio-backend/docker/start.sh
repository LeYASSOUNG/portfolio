#!/usr/bin/env bash
set -e

# Render fournit le port via $PORT
PORT="${PORT:-10000}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

if [ -z "${APP_KEY}" ]; then
  echo "ERREUR : APP_KEY est vide. Générez-la avec 'php artisan key:generate --show' et ajoutez-la dans Render." >&2
  exit 1
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Compte admin (idempotent) : nécessite ADMIN_EMAIL et ADMIN_PASSWORD (12+ caractères)
if [ -n "${ADMIN_EMAIL}" ] && [ -n "${ADMIN_PASSWORD}" ]; then
  php artisan db:seed --class=AdminSeeder --force
fi

# Contenu initial du portfolio (projets, compétences...) : mettre RUN_SEED=true
# pour le 1er démarrage seulement, puis le retirer. N'exécute JAMAIS DatabaseSeeder
# (il crée un compte test@example.com avec un mot de passe par défaut).
if [ "${RUN_SEED}" = "true" ]; then
  php artisan db:seed --class=PortfolioSeeder --force
fi

php artisan storage:link || true

chown -R www-data:www-data storage bootstrap/cache
exec apache2-foreground
