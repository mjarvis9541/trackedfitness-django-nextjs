from .base import *

DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "backend"]

INTERNAL_IPS = ["127.0.0.1"]

INSTALLED_APPS += ["debug_toolbar"]

MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "NAME": config["LOCAL_DB_NAME"],
#         "USER": config["LOCAL_DB_USER"],
#         "PASSWORD": config["LOCAL_DB_PASS"],
#         "HOST": config["LOCAL_DB_HOST"],
#         "PORT": config["LOCAL_DB_PORT"],
#     }
# }


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_NAME"),
        "USER": os.environ.get("POSTGRES_USER"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
        "HOST": os.environ.get("POSTGRES_HOST"),
        "PORT": os.environ.get("POSTGRES_PORT"),
    }
}


FRONTEND_DOMAIN = "http://localhost:3000"

DEFAULT_FROM_EMAIL = "Trackedfitness <noreply@trackedfitness.com>"

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


def show_toolbar(request):
    return True


DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": show_toolbar,
}
