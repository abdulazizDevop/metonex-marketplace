"""
Metadata URLs - Status va boshqa metadata ma'lumotlari uchun URL patterns
"""

from django.urls import path
from ..views.metadata_views import (
    OrderStatusesView,
    RFQStatusesView,
    OfferStatusesView,
    AllStatusesView
)

metadata_urlpatterns = [
    # Status endpoints
    path('orders/statuses/', OrderStatusesView.as_view(), name='order-statuses'),
    path('rfqs/statuses/', RFQStatusesView.as_view(), name='rfq-statuses'),
    path('offers/statuses/', OfferStatusesView.as_view(), name='offer-statuses'),
    path('statuses/', AllStatusesView.as_view(), name='all-statuses'),
]
