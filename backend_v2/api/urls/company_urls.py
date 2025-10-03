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
from ..views.company_document_views import CompanyDocumentView

# Company router
company_router = DefaultRouter()
company_router.register(r'', CompanyViewSet, basename='company')

company_urlpatterns = [
    # Company profile management (must be before router)
    path('profile/', CompanyProfileView.as_view(), name='company-profile'),
    
    # Company documents management (must be before router)
    path('documents/', CompanyDocumentView.as_view(), name='company-documents'),
    
    # Custom company actions (must be before router)
    path('my-company/', CompanyViewSet.as_view({'get': 'my_company'}), name='company-my'),
    path('create-profile/', CompanyViewSet.as_view({'post': 'create_profile'}), name='company-create-profile'),
    path('dealer-factories/', CompanyViewSet.as_view({'post': 'dealer_factories'}), name='company-dealer-factories'),
    path('factories/', CompanyViewSet.as_view({'get': 'factories'}), name='company-factories'),
    path('verified/', CompanyViewSet.as_view({'get': 'verified'}), name='company-verified'),
    path('unverified/', CompanyViewSet.as_view({'get': 'unverified'}), name='company-unverified'),
    
    # Company members management
    path('members/', CompanyViewSet.as_view({'get': 'members', 'post': 'members'}), name='company-members'),
    path('members/<int:member_id>/', CompanyViewSet.as_view({'put': 'member_detail', 'delete': 'member_detail'}), name='company-member-detail'),
    
    # Router URLs (after custom paths)
    path('', include(company_router.urls)),
    
    # Actions that need pk (after router)
    path('<int:pk>/profile/', CompanyViewSet.as_view({'get': 'profile'}), name='company-profile-detail'),
    path('<int:pk>/verify/', CompanyViewSet.as_view({'post': 'verify'}), name='company-verify'),
    path('<int:pk>/unverify/', CompanyViewSet.as_view({'post': 'unverify'}), name='company-unverify'),
]
