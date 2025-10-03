"""
User URLs - Foydalanuvchilar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.user_views import (
    UserViewSet,
    UserListView,
    UserDetailView
)

# User router
user_router = DefaultRouter()
user_router.register(r'', UserViewSet, basename='user')

user_urlpatterns = [
    # Router URLs
    path('', include(user_router.urls)),
    
    # Additional user endpoints
    path('list/', UserListView.as_view({'get': 'list'}), name='user-list'),
    path('<int:pk>/', UserDetailView.as_view({'get': 'retrieve'}), name='user-detail'),
    
    # Custom user actions
    path('me/', UserViewSet.as_view({'get': 'me'}), name='user-me'),
    path('stats/', UserViewSet.as_view({'get': 'stats'}), name='user-stats'),
    path('suppliers/', UserViewSet.as_view({'get': 'suppliers'}), name='user-suppliers'),
    path('buyers/', UserViewSet.as_view({'get': 'buyers'}), name='user-buyers'),
    path('manufacturers/', UserViewSet.as_view({'get': 'manufacturers'}), name='user-manufacturers'),
    path('dealers/', UserViewSet.as_view({'get': 'dealers'}), name='user-dealers'),
    
    # User management actions
    path('<int:pk>/activate/', UserViewSet.as_view({'post': 'activate'}), name='user-activate'),
    path('<int:pk>/deactivate/', UserViewSet.as_view({'post': 'deactivate'}), name='user-deactivate'),
    
    # User details with related data
    path('<int:pk>/products/', UserDetailView.as_view({'get': 'products'}), name='user-products'),
    path('<int:pk>/rfqs/', UserDetailView.as_view({'get': 'rfqs'}), name='user-rfqs'),
    path('<int:pk>/offers/', UserDetailView.as_view({'get': 'offers'}), name='user-offers'),
    path('<int:pk>/orders/', UserDetailView.as_view({'get': 'orders'}), name='user-orders'),
    path('<int:pk>/stats/', UserDetailView.as_view({'get': 'stats'}), name='user-stats'),
]
