"""
Django settings for auth_service project.

Generated by 'django-admin startproject' using Django 5.1.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from datetime import timedelta
from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

SECRET_KEY = os.getenv('SECRET_KEY')
JWT_ALGORITHM = os.getenv('JWT_ALGO')
DB_NAME = os.getenv('POSTGRES_AUTH_DB')
DB_USER = os.getenv('POSTGRES_USER')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD')
DB_HOST = os.getenv('POSTGRES_AUTH_HOST')
DB_PORT = os.getenv('POSTGRES_PORT')
CLIENT42_ID = os.getenv('42_CLIENT_ID')
CLIENT42_SECRET = os.getenv('42_CLIENT_SECRET')
CLIENT42_STATE = os.getenv('42_STATE')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# If using nginx/proxy
ALLOWED_HOSTS = ['localhost', 'auth-service']

AUTH_USER_MODEL = 'user_app.UserProfile'

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_USE_TLS = True
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_HOST_USER = 'youremail@gmail.com'
# EMAIL_HOST_PASSWORD = 'email_password'
# EMAIL_PORT = 587

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': JWT_ALGORITHM,
    'AUTH_TOKEN_CLASSES': (
        'rest_framework_simplejwt.tokens.AccessToken',
    ),
}

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',

    'auth_app',
    'user_app',
    'oauth_app',

    'django_prometheus', #prometheus
	'watchman', #health check
    'django_crontab', #cron job
]

# Add these to your settings.py
# Set base directory for cron
CRONTAB_DJANGO_PROJECT_NAME = 'auth_service'
CRONTAB_COMMAND_PREFIX = 'cd /app && '

CRONJOBS = [
    # Format: ('cron schedule', 'path.to.function', ['optional args'], {'optional kwargs'}, 'job comment')
    ('*/10 * * * *', 'user_app.tasks.update_inactive_users', '>> /app/cron.log 2>&1')
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware', # prometheus
    'django.middleware.security.SecurityMiddleware',
    'user_app.middleware.DatabaseConnectionMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'user_app.middleware.UserActivityMiddleware',
    'django_prometheus.middleware.PrometheusAfterMiddleware', #prometheus
]


CORS_ALLOW_ALL_ORIGINS = False  # Not recommended in production, change after development

CORS_ALLOW_CREDENTIALS = True # If you need to send cookies or authentication headers (e.g., for JWT)

CORS_ALLOWED_ORIGINS = [
    "https://localhost",
]


# Allow specific headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Allow specific methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]


#CSRF settings
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_TRUSTED_ORIGINS = [
    'https://localhost',
]

ROOT_URLCONF = 'auth_service.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'auth_service.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django_prometheus.db.backends.postgresql',  # This uses psycopg2
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_HOST,
        'PORT': DB_PORT,
    }
}

OAUTH2_PROVIDERS = {
    '42': {
        'CLIENT_ID': CLIENT42_ID,
        'CLIENT_SECRET': CLIENT42_SECRET,
        'STATE': CLIENT42_STATE,
        'REDIRECT_URI': 'https://localhost/',
        'AUTHORIZATION_URL': 'https://api.intra.42.fr/oauth/authorize',
        'TOKEN_URL': 'https://api.intra.42.fr/oauth/token',
        'USER_INFO_URL': 'https://api.intra.42.fr/v2/me',
        'SCOPE': 'public',
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # Default backend
    'auth_app.backends.EmailOrUsernameModelBackend',  # Custom backend
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

CSP_DEFAULT_SRC = ("'self'", "blob:")

CSP_SCRIPT_SRC = (
	"'self'",
    "https://cdn.jsdelivr.net",
    "https://auth.42.fr",
    "unsafe-eval",
	)

CSP_CONNECT_SRC = (
	"'self'",
    "'blob:",
    "https://threejs.org",)

CSP_IMG_SRC = (
	"'self'",
    "data:",
    "blob:"
	)

CSP_MEDIA_SRC = (
	"'self'",
    "'blob:'"
	)


CSP_FONT_SRC = (
	"'self'",
    "data:",
    "https://threejs.org"
	)

CSP_MEDIA_SRC = (
	"'self'",
    "blob:",
	)

CSP_STYLE_SRC = ("'self'",)





# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

LOGIN_URL = 'auth-service/auth/login/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
