"""
Notification URLs - Xabarnomalar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.notification_views import (
    NotificationViewSet,
    NotificationListView,
    NotificationDetailView,
    NotificationCreateView,
    NotificationMarkReadView,
    NotificationMarkUnreadView,
    NotificationBulkActionView,
    NotificationSettingsView,
    NotificationStatsView,
    NotificationSearchView
)

# Notification router
notification_router = DefaultRouter()
notification_router.register(r'', NotificationViewSet, basename='notification')

notification_urlpatterns = [
    # Router URLs
    path('', include(notification_router.urls)),
    
    # Additional notification endpoints
    path('list/', NotificationListView.as_view({'get': 'list'}), name='notification-list'),
    path('<int:pk>/detail/', NotificationDetailView.as_view({'get': 'retrieve'}), name='notification-detail'),
    path('create/', NotificationCreateView.as_view(), name='notification-create'),
    
    # Notification actions
    path('<int:pk>/mark-read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('<int:pk>/mark-unread/', NotificationMarkUnreadView.as_view(), name='notification-mark-unread'),
    path('bulk-action/', NotificationBulkActionView.as_view(), name='notification-bulk-action'),
    
    # Notification settings and stats
    path('settings/', NotificationSettingsView.as_view(), name='notification-settings'),
    path('stats/', NotificationStatsView.as_view(), name='notification-stats'),
    
    # Notification search
    path('search/', NotificationSearchView.as_view(), name='notification-search'),
    
    # Custom notification actions
    path('my-notifications/', NotificationViewSet.as_view({'get': 'my_notifications'}), name='notification-my'),
    path('unread/', NotificationViewSet.as_view({'get': 'unread'}), name='notification-unread'),
    path('read/', NotificationViewSet.as_view({'get': 'read'}), name='notification-read'),
    path('by-type/', NotificationViewSet.as_view({'get': 'by_type'}), name='notification-by-type'),
    path('by-channel/', NotificationViewSet.as_view({'get': 'by_channel'}), name='notification-by-channel'),
    
    # Notification management actions
    path('mark-all-read/', NotificationViewSet.as_view({'post': 'mark_all_read'}), name='notification-mark-all-read'),
    path('mark-all-unread/', NotificationViewSet.as_view({'post': 'mark_all_unread'}), name='notification-mark-all-unread'),
    path('delete-read/', NotificationViewSet.as_view({'post': 'delete_read'}), name='notification-delete-read'),
    path('delete-old/', NotificationViewSet.as_view({'post': 'delete_old'}), name='notification-delete-old'),
]
