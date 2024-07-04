import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY")

# Application definition
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
]

THIRD_PARTY_APPS = [
    "corsheaders",
    "django_extensions",
    "django_filters",
    "rest_framework",
]

PROJECT_APPS = [
    "apps.brands",
    "apps.categories",
    "apps.diet_settings",
    "apps.diet_targets",
    "apps.diet",
    "apps.exercises",
    "apps.followers",
    "apps.food",
    "apps.meals",
    "apps.muscle_groups",
    "apps.profiles",
    "apps.progress",
    "apps.targets",
    "apps.training",
    "apps.training_plans",
    "apps.users",
    "apps.utils",
    # "apps.workout_exercises",
    # "apps.workout_sets",
    # "apps.workouts",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + PROJECT_APPS

AUTH_USER_MODEL = "users.User"

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "https://trackedfitness.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

CSRF_TRUSTED_ORIGINS = [
    "https://trackedfitness.com",
    "https://api.trackedfitness.com",
]

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
        # "rest_framework.permissions.IsAdminUser",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "config.authentication.AccessTokenAuthentication",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "corsheaders.middleware.CorsPostCsrfMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "apps/templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization

LANGUAGE_CODE = "en-gb"

TIME_ZONE = "GMT"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)

STATIC_URL = "static/"
STATICFILES_DIRS = [
    BASE_DIR / "apps/static"
]  # using collectstatic - retrieve files from
STATIC_ROOT = BASE_DIR / "apps/staticfiles"  # using collectstatic - send files to

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

TEST_RUNNER = "config.runner.NoLoggingTestRunner"

# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "handlers": {
#         "file": {
#             "class": "logging.FileHandler",
#             "filename": "general.log",
#             "formatter": "verbose",
#             "level": "DEBUG",
#         },
#     },
#     "loggers": {
#         "": {
#             "level": "DEBUG",
#             "handlers": ["file"],
#         },
#     },
#     "formatters": {
#         "verbose": {
#             "format": "{name} {levelname} {asctime} {module} {process:d} {thread:d} {message}",
#             "style": "{",
#         },
#         "simple": {
#             "format": "{levelname} {message}",
#             "style": "{",
#         },
#     },
# }
