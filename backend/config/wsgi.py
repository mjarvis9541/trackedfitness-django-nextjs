import os

from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv

load_dotenv()


os.environ.setdefault("DJANGO_SETTINGS_MODULE", os.environ.get("SETTINGS_MODULE"))

application = get_wsgi_application()
