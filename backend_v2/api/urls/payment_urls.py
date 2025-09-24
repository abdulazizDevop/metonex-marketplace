"""
Payment URLs - To'lovlar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.payment_views import (
    PaymentViewSet,
    PaymentListView,
    PaymentDetailView,
    PaymentCreateView,
    PaymentConfirmView,
    PaymentReleaseView,
    PaymentRefundView,
    PaymentSearchView,
    PaymentAnalyticsView
)

# Payment router
payment_router = DefaultRouter()
payment_router.register(r'', PaymentViewSet, basename='payment')

payment_urlpatterns = [
    # Router URLs
    path('', include(payment_router.urls)),
    
    # Additional payment endpoints
    path('list/', PaymentListView.as_view({'get': 'list'}), name='payment-list'),
    path('<int:pk>/detail/', PaymentDetailView.as_view({'get': 'retrieve'}), name='payment-detail'),
    path('create/', PaymentCreateView.as_view(), name='payment-create'),
    
    # Payment actions
    path('<int:pk>/confirm/', PaymentConfirmView.as_view(), name='payment-confirm'),
    path('<int:pk>/release/', PaymentReleaseView.as_view(), name='payment-release'),
    path('<int:pk>/refund/', PaymentRefundView.as_view(), name='payment-refund'),
    
    # Payment search and analytics
    path('search/', PaymentSearchView.as_view(), name='payment-search'),
    path('analytics/', PaymentAnalyticsView.as_view(), name='payment-analytics'),
    
    # Custom payment actions
    path('my-payments/', PaymentViewSet.as_view({'get': 'my_payments'}), name='payment-my'),
    path('pending/', PaymentViewSet.as_view({'get': 'pending'}), name='payment-pending'),
    path('received/', PaymentViewSet.as_view({'get': 'received'}), name='payment-received'),
    path('held-in-escrow/', PaymentViewSet.as_view({'get': 'held_in_escrow'}), name='payment-held-in-escrow'),
    path('released/', PaymentViewSet.as_view({'get': 'released'}), name='payment-released'),
    path('refunded/', PaymentViewSet.as_view({'get': 'refunded'}), name='payment-refunded'),
    path('by-order/', PaymentViewSet.as_view({'get': 'by_order'}), name='payment-by-order'),
    path('by-method/', PaymentViewSet.as_view({'get': 'by_method'}), name='payment-by-method'),
    
    # Payment management actions
    path('<int:pk>/confirm-cash/', PaymentViewSet.as_view({'post': 'confirm_cash'}), name='payment-confirm-cash'),
    path('<int:pk>/release-escrow/', PaymentViewSet.as_view({'post': 'release_escrow'}), name='payment-release-escrow'),
    path('<int:pk>/process-refund/', PaymentViewSet.as_view({'post': 'process_refund'}), name='payment-process-refund'),
]
