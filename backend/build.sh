#!/usr/bin/env bash

# Exit on any error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate --noinput

# Create superuser if the environment variable is set
if [ "$CREATE_SUPERUSER" = "true" ]; then
  echo "Creating superuser..."
  python manage.py createsuperuser --noinput
  echo "Superuser created successfully."
fi

# Collect static files
python manage.py collectstatic --noinput