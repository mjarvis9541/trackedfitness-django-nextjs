from .base import *

DEBUG = False

ALLOWED_HOSTS = [os.environ.get("ALLOWED_HOSTS")]

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "NAME": config["PRODUCTION_DB_NAME"],
#         "USER": config["PRODUCTION_DB_USER"],
#         "PASSWORD": config["PRODUCTION_DB_PASS"],
#         "HOST": config["PRODUCTION_DB_HOST"],
#         "PORT": config["PRODUCTION_DB_PORT"],
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


# Set to True to avoid transmitting the CSRF cookie over HTTP accidentally.
# CSRF_COOKIE_SECURE = True

# Set to True to avoid transmitting the session cookie over HTTP accidentally.
# SESSION_COOKIE_SECURE = True

FRONTEND_DOMAIN = "https://trackedfitness.com"

DEFAULT_FROM_EMAIL = "noreply@trackedfitness.com"

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = "smtp.sendgrid.net"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get("EMAIL_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_PASSWORD")

STATIC_URL = "staticfiles/"
