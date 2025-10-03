"""
Order URLs - Buyurtmalar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.order_views import (
    OrderViewSet,
    OrderListView,
    OrderDetailView,
    OrderCreateView,
    OrderUpdateView,
    OrderStatusUpdateView,
    OrderDocumentViewSet,
    OrderStatusHistoryViewSet,
    OrderSearchView
)
from ..views.order_document_views import OrderDocumentView

# Order routers
order_router = DefaultRouter()
order_router.register(r'', OrderViewSet, basename='order')

order_document_router = DefaultRouter()
order_document_router.register(r'documents', OrderDocumentViewSet, basename='order-document')

order_status_history_router = DefaultRouter()
order_status_history_router.register(r'status-history', OrderStatusHistoryViewSet, basename='order-status-history')

order_urlpatterns = [
    # Custom order actions (must be before router)
    path('my_orders/', OrderViewSet.as_view({'get': 'my_orders'}), name='order-my'),
    path('my_buyer_orders/', OrderViewSet.as_view({'get': 'buyer_orders'}), name='order-buyer'),
    path('my_supplier_orders/', OrderViewSet.as_view({'get': 'supplier_orders'}), name='order-supplier'),
    path('created/', OrderViewSet.as_view({'get': 'created'}), name='order-created'),
    path('awaiting_payment/', OrderViewSet.as_view({'get': 'awaiting_payment'}), name='order-awaiting-payment'),
    path('payment_confirmed/', OrderViewSet.as_view({'get': 'payment_confirmed'}), name='order-payment-confirmed'),
    path('ready_for_delivery/', OrderViewSet.as_view({'get': 'ready_for_delivery'}), name='order-ready-for-delivery'),
    path('in_preparation/', OrderViewSet.as_view({'get': 'in_preparation'}), name='order-in-preparation'),
    path('in_transit/', OrderViewSet.as_view({'get': 'in_transit'}), name='order-in-transit'),
    path('delivered/', OrderViewSet.as_view({'get': 'delivered'}), name='order-delivered'),
    path('confirmed/', OrderViewSet.as_view({'get': 'confirmed'}), name='order-confirmed'),
    path('completed/', OrderViewSet.as_view({'get': 'completed'}), name='order-completed'),
    path('cancelled/', OrderViewSet.as_view({'get': 'cancelled'}), name='order-cancelled'),
    
    # Order search
    path('search/', OrderSearchView.as_view(), name='order-search'),
    
    # Router URLs (after custom paths)
    path('', include(order_router.urls)),
    path('<int:order_pk>/', include(order_document_router.urls)),
    path('<int:order_pk>/', include(order_status_history_router.urls)),
    
    # Order status update
    path('<int:pk>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
    
    # Order management actions
    path('<int:pk>/confirm-payment/', OrderViewSet.as_view({'post': 'confirm_payment'}), name='order-confirm-payment'),
    path('<int:pk>/upload-payment-proof/', OrderViewSet.as_view({'post': 'upload_payment_proof'}), name='order-upload-payment-proof'),
    path('<int:pk>/upload-ttn/', OrderViewSet.as_view({'post': 'upload_ttn'}), name='order-upload-ttn'),
    path('<int:pk>/upload-contract/', OrderViewSet.as_view({'post': 'upload_contract'}), name='order-upload-contract'),
    path('<int:pk>/upload-invoice/', OrderViewSet.as_view({'post': 'upload_invoice'}), name='order-upload-invoice'),
    path('<int:pk>/confirm-delivery/', OrderViewSet.as_view({'post': 'confirm_delivery'}), name='order-confirm-delivery'),
    path('<int:pk>/cancel/', OrderViewSet.as_view({'post': 'cancel'}), name='order-cancel'),
    path('<int:pk>/complete/', OrderViewSet.as_view({'post': 'complete'}), name='order-complete'),
    
    # Order documents (yangi Document model)
    path('<int:order_id>/documents/', OrderDocumentView.as_view(), name='order-documents-new'),
    
    # Order documents (eski)
    path('<int:order_pk>/documents/', OrderDocumentViewSet.as_view({'get': 'list', 'post': 'create'}), name='order-documents'),
    path('<int:order_pk>/documents/<int:pk>/', OrderDocumentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='order-document-detail'),
    
    # Order status history
    path('<int:order_pk>/status-history/', OrderStatusHistoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='order-status-history'),
    path('<int:order_pk>/status-history/<int:pk>/', OrderStatusHistoryViewSet.as_view({'get': 'retrieve'}), name='order-status-history-detail'),
]
