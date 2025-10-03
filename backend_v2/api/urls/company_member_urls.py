"""
Company Member URLs - Kompaniya a'zolari uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.company_member_views import CompanyMemberViewSet

# Company member router
company_member_router = DefaultRouter()
company_member_router.register(r'', CompanyMemberViewSet, basename='company-member')

company_member_urlpatterns = [
    # Router URLs
    path('', include(company_member_router.urls)),
    
    # Custom company member actions
    path('my_company_members/', CompanyMemberViewSet.as_view({'get': 'my_company_members'}), name='company-member-my'),
    path('add-member/', CompanyMemberViewSet.as_view({'post': 'add_member'}), name='company-member-add'),
    path('<int:pk>/update-member/', CompanyMemberViewSet.as_view({'put': 'update_member'}), name='company-member-update'),
    path('<int:pk>/remove-member/', CompanyMemberViewSet.as_view({'delete': 'remove_member'}), name='company-member-remove'),
]
