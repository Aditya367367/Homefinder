import os
import django
from django.contrib.auth import get_user_model
from django.conf import settings

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings") 

django.setup()

User = get_user_model()

# Superuser credentials from environment variables
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
# Assuming 'name' is required for your custom user model
name = os.environ.get('DJANGO_SUPERUSER_NAME')

if not all([email, password, name]):
    print("Error: One or more superuser environment variables (EMAIL, PASSWORD, NAME) are not set. Skipping creation.")
else:
    # Use the email field to check for existence, as it is the USERNAME_FIELD
    if not User.objects.filter(email=email).exists():
        # Create the superuser using the correct fields for your model
        User.objects.create_superuser(email=email, password=password, name=name)
        print(f"Superuser '{email}' created successfully.")
    else:
        print(f"Superuser '{email}' already exists. Skipping creation.")