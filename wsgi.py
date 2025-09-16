import os
import sys

# Add your project directory to the Python path
path = '/home/metonex/metonex-marketplace/backend'
if path not in sys.path:
    sys.path.append(path)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Import Django's WSGI handler
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
