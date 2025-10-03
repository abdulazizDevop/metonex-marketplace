"""
Offer URLs - Takliflar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.offer_views import (
    OfferViewSet,
    MyOffersView,
    OfferListView,
    OfferDetailView,
    OfferCreateView,
    OfferUpdateView,
    OfferAcceptView,
    OfferRejectView,
    CounterOfferViewSet,
    CounterOfferCreateView,
    CounterOfferAcceptView,
    CounterOfferRejectView,
    OfferSearchView
)

# Offer routers
offer_router = DefaultRouter()
offer_router.register(r'', OfferViewSet, basename='offer')

counter_offer_router = DefaultRouter()
counter_offer_router.register(r'counter-offers', CounterOfferViewSet, basename='counter-offer')

offer_urlpatterns = [
    # Custom offer actions (MUST be before router URLs)
    path('my_offers/', MyOffersView.as_view(), name='offer-my'),
    path('pending/', OfferViewSet.as_view({'get': 'pending'}), name='offer-pending'),
    path('accepted/', OfferViewSet.as_view({'get': 'accepted'}), name='offer-accepted'),
    path('rejected/', OfferViewSet.as_view({'get': 'rejected'}), name='offer-rejected'),
    path('counter-offered/', OfferViewSet.as_view({'get': 'counter_offered'}), name='offer-counter-offered'),
    path('by-rfq/', OfferViewSet.as_view({'get': 'by_rfq'}), name='offer-by-rfq'),
    path('by-supplier/', OfferViewSet.as_view({'get': 'by_supplier'}), name='offer-by-supplier'),
    path('<int:pk>/counter-offers/', OfferViewSet.as_view({'get': 'counter_offers'}), name='offer-counter-offers'),
    
    # Offer actions
    path('<int:pk>/accept/', OfferAcceptView.as_view(), name='offer-accept'),
    path('<int:pk>/reject/', OfferRejectView.as_view(), name='offer-reject'),
    
    # Counter offer endpoints
    path('counter-offers/create/', CounterOfferCreateView.as_view(), name='counter-offer-create'),
    path('counter-offers/<int:pk>/accept/', CounterOfferAcceptView.as_view(), name='counter-offer-accept'),
    path('counter-offers/<int:pk>/reject/', CounterOfferRejectView.as_view(), name='counter-offer-reject'),
    
    # Offer search
    path('search/', OfferSearchView.as_view(), name='offer-search'),
    
    # Router URLs (TEMPORARILY COMMENTED OUT)
    # path('', include(offer_router.urls)),
    # path('', include(counter_offer_router.urls)),
]
