"""
MetOneX Backend v2 - URLs Package
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.admin import admin_site
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from .auth_urls import auth_urlpatterns
from .user_urls import user_urlpatterns
from .company_urls import company_urlpatterns
from .company_member_urls import company_member_urlpatterns
from .catalog_urls import catalog_urlpatterns
from .metadata_urls import metadata_urlpatterns
from .product_urls import product_urlpatterns
from .rfq_urls import rfq_urlpatterns
from .offer_urls import offer_urlpatterns
from .order_urls import order_urlpatterns
from .payment_urls import payment_urlpatterns
from .notification_urls import notification_urlpatterns
from .document_urls import document_urlpatterns

# Main router for API v1
router = DefaultRouter()

# Include all URL patterns
urlpatterns = [
    # Admin
    path('admin/', admin_site.urls),
    
    # API v1
    path('api/v1/', include([
        # Authentication
        path('auth/', include(auth_urlpatterns)),
        
        # User management
        path('users/', include(user_urlpatterns)),
        
        # Company management
        path('companies/', include(company_urlpatterns)),
        
        # Company member management
        path('company-members/', include(company_member_urlpatterns)),
        
        # Catalog management
        path('catalog/', include(catalog_urlpatterns)),
        path('', include(metadata_urlpatterns)),
        
        # Product management
        path('products/', include(product_urlpatterns)),
        
        # RFQ management
        path('rfqs/', include(rfq_urlpatterns)),
        
        # Offer management
        path('offers/', include(offer_urlpatterns)),
        
        # Order management
        path('orders/', include(order_urlpatterns)),
        
        # Payment management - Temporarily disabled (escrow orqali admin panel orqali boshqariladi)
        # path('payments/', include(payment_urlpatterns)),
        
        # Notification management
        path('notifications/', include(notification_urlpatterns)),
        
        # Document management
        path('documents/', include(document_urlpatterns)),
    ])),
    
    # Router URLs
    path('api/v1/', include(router.urls)),
]

__all__ = [
    'urlpatterns',
    'router',
    'auth_urlpatterns',
    'user_urlpatterns',
    'company_urlpatterns',
    'company_member_urlpatterns',
    'catalog_urlpatterns',
    'metadata_urlpatterns',
    'product_urlpatterns',
    'rfq_urlpatterns',
    'offer_urlpatterns',
    'order_urlpatterns',
    'payment_urlpatterns',
    'notification_urlpatterns',
    'document_urlpatterns',
]
