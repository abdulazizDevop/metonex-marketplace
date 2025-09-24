# Import custom admin site
from .admin import admin_site

# Export admin_site for use in URLs
__all__ = ['admin_site']
