from pathlib import Path
from datetime import timedelta
import os
import dj_database_url
import environ

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------
# Env
# ---------------------
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = [h for h in env('ALLOWED_HOSTS', default='').split(',') if h]
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# ---------------------
# Apps
# ---------------------
INSTALLED_APPS = [
    # Django
    "jazzmin",
    'django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes',
    'django.contrib.sessions', 'django.contrib.messages', 'django.contrib.staticfiles',

    # 3rd party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'oauth2_provider',
    'social_django',
    'drf_social_oauth2',
    'django_celery_results',
    
   
    'cloudinary',
    'cloudinary_storage',

    # Local
    'users',
]

# ---------------------
# DRF: lean JSON pipeline for speed
# ---------------------
REST_FRAMEWORK = {
    # Auth
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
        'drf_social_oauth2.authentication.SocialAuthentication',
    ),
    # Renderers/parsers: keep only JSON in prod for speed
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ) if not DEBUG else (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ),
    # Throttles (safe throttle classes to avoid cache deserialization issues)
    'DEFAULT_THROTTLE_CLASSES': [
        'users.throttling.AnonDefaultThrottle',
        'users.throttling.UserDefaultThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon_burst': '30/min',
        'user_burst': '120/min',
        'anon_sustained': '1000/day',
        'user_sustained': '5000/day',
        'anon': '60/min',
        'user': '1000/day',
    },
    # Pagination disabled (explicit in views when needed)
    'DEFAULT_PAGINATION_CLASS': None,
    'PAGE_SIZE': None,
}

# ---------------------
# JWT
# ---------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}

# ---------------------
# Middleware
# NOTE: GZip + WhiteNoise stay. Add cache middleware pair early for API GETs.
# Cache middleware safely no-ops on Authorization/CSRF requests by default.
# ---------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'core.cache.SelectiveCacheMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.gzip.GZipMiddleware',
]

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

# ---------------------
# Templates
# ---------------------
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

# ---------------------
# DB (reuse existing; keep connection pooling)
# ---------------------
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,  # persistent connections
            ssl_require=True
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': env('DB_NAME'),
            'USER': env('DB_USER'),
            'PASSWORD': env('DB_PASSWORD'),
            'HOST': env('DB_HOST', default='localhost'),
            'PORT': env('DB_PORT', default='5432'),
            'CONN_MAX_AGE': 600,
        }
    }

# ---------------------
# Password validators
# ---------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ---------------------
# I18N
# ---------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------
# Static & Media
# ---------------------
# STATIC_URL = '/static/'
# STATIC_ROOT = BASE_DIR / 'staticfiles'
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# MEDIA_URL = '/media/'
# MEDIA_ROOT = BASE_DIR / 'media'
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ⚡ Cloudinary media storage
MEDIA_URL = '/media/'
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# ---------------------
# Cloudinary Config
# ---------------------
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': env('CLOUDINARY_API_KEY'),
    'API_SECRET': env('CLOUDINARY_API_SECRET'),
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------
# Auth / Users
# ---------------------
AUTH_USER_MODEL = 'users.CustomUser'
CORS_ALLOW_ALL_ORIGINS = True

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'drf_social_oauth2.backends.DjangoOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = env('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY', default='')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = env('SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET', default='')

DRFSO2_URL_NAMESPACE = 'drf'
OAUTH2_PROVIDER = {'ACCESS_TOKEN_EXPIRE_SECONDS': 36000}

# ---------------------
# Email
# ---------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env('EMAIL_PORT', cast=int)
EMAIL_USE_TLS = env('EMAIL_USE_TLS', cast=bool)
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
SERVER_EMAIL = DEFAULT_FROM_EMAIL

FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:3000')
SITE_NAME = env('SITE_NAME', default='MySite')

# ---------------------
# Redis Cache (compressed) + Global cache middleware config
# ---------------------
REDIS_URL = env('REDIS_URL', default='redis://127.0.0.1:6379/1')

# Remove stray middleware string (now properly added above)

# Update CACHES configuration
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            # Enable compression to reduce payload + memory
            "COMPRESSOR": "django_redis.compressors.zlib.ZlibCompressor",
            # Use custom msgpack serializer that handles ExtraData exceptions
            "SERIALIZER": "core.serializers.CustomMSGPackSerializer",
            # Connection pooling
            "CONNECTION_POOL_KWARGS": {"max_connections": 100},
            # Ignore exceptions (don't crash on cache errors)
            "IGNORE_EXCEPTIONS": True,
        },
        "KEY_PREFIX": env('CACHE_KEY_PREFIX', default='homefinder'),
        "TIMEOUT": None,  # use per-view/per-mw timeouts below
    }
}

# Adjust cache middleware settings for better performance
CACHE_MIDDLEWARE_SECONDS = env('CACHE_MIDDLEWARE_SECONDS', default=60)  # increased from 45
CACHE_MIDDLEWARE_KEY_PREFIX = env('CACHE_MIDDLEWARE_KEY_PREFIX', default='mw')

# Adjust API cache TTLs for better performance
API_CACHE_TTL_SHORT = env('API_CACHE_TTL_SHORT', default=90)     # increased from 60
API_CACHE_TTL_MEDIUM = env('API_CACHE_TTL_MEDIUM', default=180)  # increased from 120
API_CACHE_TTL_LONG = env('API_CACHE_TTL_LONG', default=600)      # increased from 300

# Add GZip content types for compression
GZIP_CONTENT_TYPES = (
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/x-javascript',
    'application/json',
    'application/vnd.api+json',
)

# Update throttle rates for better rate limiting without clobbering previous config
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon_burst': '20/min',
    'user_burst': '60/min',
    'anon_sustained': '500/day',
    'user_sustained': '2000/day',
    'anon': '40/min',
    'user': '800/day',
}

# ---------------------
# Celery
# ---------------------
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default=REDIS_URL)
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND', default=f"{REDIS_URL[:-1]}2")
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_TIME_LIMIT = 60
CELERY_WORKER_MAX_TASKS_PER_CHILD = 100

# ---------------------
# Logging (fast console, silence noisy loggers in prod)
# ---------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'WARNING'},
    'loggers': {
        'django.db.backends': {'level': 'WARNING'},  
        'django.request': {'level': 'WARNING'},
    }
}

PROJECT_INFO = {
    "name": "Real Estate Platform",
    "version": "v1.0",
    "owner": "Aditya Chauhan",
    "email": "suryachauhan367367@gmail.com",
    "linkedin": "https://www.linkedin.com/in/aditya-chauhan-1b1a95228",
    "copyright": "© 2025 Aditya Chauhan. All rights reserved."
}