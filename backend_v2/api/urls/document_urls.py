"""
Document URLs - Hujjatlar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.document_views import (
    DocumentViewSet,
    DocumentListView,
    DocumentSearchView
)

# Document routers
document_router = DefaultRouter()
document_router.register(r'', DocumentViewSet, basename='document')

document_urlpatterns = [
    # Router URLs
    path('', include(document_router.urls)),
    
    # Document search
    path('search/', DocumentSearchView.as_view(), name='document-search'),
    
    # Custom document actions
    path('my-documents/', DocumentViewSet.as_view({'get': 'my_documents'}), name='document-my'),
    path('by-type/', DocumentViewSet.as_view({'get': 'by_type'}), name='document-by-type'),
]