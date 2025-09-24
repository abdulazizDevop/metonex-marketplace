"""
Company URLs - Kompaniyalar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.company_views import (
    CompanyViewSet,
    CompanyProfileView,
    CompanyListView,
    CompanyCreateView,
    CompanyUpdateView
)

# Company router
company_router = DefaultRouter()
company_router.register(r'', CompanyViewSet, basename='company')

company_urlpatterns = [
    # Company profile management (must be before router)
    path('profile/', CompanyProfileView.as_view(), name='company-profile'),
    
    # Custom company actions (must be before router)
    path('my-company/', CompanyViewSet.as_view({'get': 'my_company'}), name='company-my'),
    path('create-profile/', CompanyViewSet.as_view({'post': 'create_profile'}), name='company-create-profile'),
    path('verified/', CompanyViewSet.as_view({'get': 'verified'}), name='company-verified'),
    path('unverified/', CompanyViewSet.as_view({'get': 'unverified'}), name='company-unverified'),
    
    # Router URLs (after custom paths)
    path('', include(company_router.urls)),
    
    # Actions that need pk (after router)
    path('<int:pk>/profile/', CompanyViewSet.as_view({'get': 'profile'}), name='company-profile-detail'),
    path('<int:pk>/verify/', CompanyViewSet.as_view({'post': 'verify'}), name='company-verify'),
    path('<int:pk>/unverify/', CompanyViewSet.as_view({'post': 'unverify'}), name='company-unverify'),
]
