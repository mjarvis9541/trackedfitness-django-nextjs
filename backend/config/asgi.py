import os

from django.core.asgi import get_asgi_application
from dotenv import load_dotenv

load_dotenv()


os.environ.setdefault("DJANGO_SETTINGS_MODULE", os.environ.get("SETTINGS_MODULE"))

application = get_asgi_application()
