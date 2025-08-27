# create_superuser.py
import os
import django

# Set the correct settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")  # core.settings is correct for your project

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Read superuser credentials from environment variables
username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin123")

# Create superuser only if it doesn't exist
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' created successfully")
else:
    print(f"Superuser '{username}' already exists")
