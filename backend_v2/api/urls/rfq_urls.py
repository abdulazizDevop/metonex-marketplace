"""
RFQ URLs - Request for Quote uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.rfq_views import (
    RFQViewSet,
    RFQListView,
    RFQDetailView,
    RFQCreateView,
    RFQUpdateView,
    RFQSearchView
)

# RFQ router
rfq_router = DefaultRouter()
rfq_router.register(r'', RFQViewSet, basename='rfq')

rfq_urlpatterns = [
    # Router URLs
    path('', include(rfq_router.urls)),
    
    # RFQ search
    path('search/', RFQSearchView.as_view(), name='rfq-search'),
    
    # Custom RFQ actions
    path('my-rfqs/', RFQViewSet.as_view({'get': 'my_rfqs'}), name='rfq-my'),
    path('active/', RFQViewSet.as_view({'get': 'active'}), name='rfq-active'),
    path('completed/', RFQViewSet.as_view({'get': 'completed'}), name='rfq-completed'),
    path('cancelled/', RFQViewSet.as_view({'get': 'cancelled'}), name='rfq-cancelled'),
    path('by-category/', RFQViewSet.as_view({'get': 'by_category'}), name='rfq-by-category'),
    path('by-buyer/', RFQViewSet.as_view({'get': 'by_buyer'}), name='rfq-by-buyer'),
    path('<int:pk>/offers/', RFQViewSet.as_view({'get': 'offers'}), name='rfq-offers'),
    path('<int:pk>/accept-offer/', RFQViewSet.as_view({'post': 'accept_offer'}), name='rfq-accept-offer'),
    path('<int:pk>/cancel/', RFQViewSet.as_view({'post': 'cancel'}), name='rfq-cancel'),
    path('<int:pk>/complete/', RFQViewSet.as_view({'post': 'complete'}), name='rfq-complete'),
]
