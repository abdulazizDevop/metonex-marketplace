"""
Test runner for MetOneX API
"""
import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner

def run_tests():
    """Run all tests"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(['api.tests'])
    
    if failures:
        sys.exit(bool(failures))

if __name__ == '__main__':
    run_tests()
