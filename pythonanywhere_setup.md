# PythonAnywhere Setup Guide

## 1. Account yaratish
- https://www.pythonanywhere.com/ ga kiring
- Free account yarating (username: metonex)

## 2. Code yuklash
```bash
# Terminal'da
cd ~
git clone https://github.com/abdulazizDevop/metonex-marketplace.git
cd metonex-marketplace/backend
```

## 3. Virtual Environment
```bash
# Python 3.11 virtual environment yaratish
mkvirtualenv --python=/usr/bin/python3.11 metonex
workon metonex
pip install -r requirements.txt
```

## 4. Database sozlash
```bash
# SQLite3 ishlatamiz (free account uchun)
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

## 5. Static files
```bash
python manage.py collectstatic --noinput
```

## 6. Web App sozlash
- Web tab'ga o'ting
- "Add a new web app" -> Manual configuration
- Python 3.11 tanlang
- WSGI configuration file'ni o'zgartiring:

```python
import os
import sys

path = '/home/metonex/metonex-marketplace/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

## 7. Domain sozlash
- Web tab'da "Reload" tugmasini bosing
- URL: https://metonex.pythonanywhere.com

## 8. pgAdmin ulash (Agar kerak bo'lsa)
- PythonAnywhere'da PostgreSQL yo'q, faqat MySQL
- Agar PostgreSQL kerak bo'lsa, paid plan kerak
- Yoki external PostgreSQL service ishlatish kerak (ElephantSQL, etc.)

## 9. Media files
- PythonAnywhere'da media files uchun alohida sozlash kerak
- Files tab'da media papkasini yaratish
- Settings'da MEDIA_ROOT va MEDIA_URL ni sozlash
