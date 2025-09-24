"""
Test configuration and settings
"""
import os
import django
from django.conf import settings

# Set up Django settings for testing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Test database configuration
TEST_DATABASE = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Test settings
TEST_SETTINGS = {
    'DEBUG': True,
    'SECRET_KEY': 'test-secret-key',
    'ALLOWED_HOSTS': ['testserver'],
    'DATABASES': TEST_DATABASE,
    'INSTALLED_APPS': [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'rest_framework',
        'rest_framework_simplejwt',
        'rest_framework_simplejwt.token_blacklist',
        'drf_spectacular',
        'api',
    ],
    'MIDDLEWARE': [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ],
    'ROOT_URLCONF': 'core.urls',
    'TEMPLATES': [
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
    ],
    'AUTH_USER_MODEL': 'api.User',
    'REST_FRAMEWORK': {
        'DEFAULT_AUTHENTICATION_CLASSES': [
            'rest_framework_simplejwt.authentication.JWTAuthentication',
        ],
        'DEFAULT_PERMISSION_CLASSES': [
            'rest_framework.permissions.IsAuthenticated',
        ],
        'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
        'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
        'PAGE_SIZE': 20,
    },
    'SIMPLE_JWT': {
        'ACCESS_TOKEN_LIFETIME': 60 * 60,  # 1 hour
        'REFRESH_TOKEN_LIFETIME': 7 * 24 * 60 * 60,  # 7 days
        'ROTATE_REFRESH_TOKENS': True,
        'BLACKLIST_AFTER_ROTATION': True,
    },
    'SPECTACULAR_SETTINGS': {
        'TITLE': 'MetOneX API',
        'DESCRIPTION': 'B2B Construction Materials Trading Platform API',
        'VERSION': '1.0.0',
        'SERVE_INCLUDE_SCHEMA': False,
        'COMPONENT_SPLIT_REQUEST': True,
        'SCHEMA_PATH_PREFIX': '/api/v1/',
        'EXCLUDE_ERRORS': True,
    },
}
