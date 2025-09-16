import os
import sys

# PythonAnywhere uchun path qo'shish
path = '/home/metonex/metonex-marketplace/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
