#!/usr/bin/env python
"""
Takliflar muddatini tekshirish va tugatish uchun cron job
Har kuni ishga tushadi: 0 0 * * * /path/to/python /path/to/expire_offers_cron.py
"""

import os
import sys
import django

# Django setup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.management import call_command

if __name__ == '__main__':
    try:
        call_command('expire_offers')
        print("Takliflar muddati muvaffaqiyatli tekshirildi")
    except Exception as e:
        print(f"Xato yuz berdi: {e}")
        sys.exit(1)
