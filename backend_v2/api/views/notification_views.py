"""
Notification views - Xabarnomalar uchun views
"""

from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

from ..models import Notification, User
from ..serializers import (
    NotificationSerializer,
    NotificationListSerializer,
    NotificationCreateSerializer,
    NotificationSearchSerializer,
    NotificationSettingsSerializer,
    NotificationStatsSerializer
)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    Xabarnomalar uchun ViewSet
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['recipient_user', 'type', 'delivery_method']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'sent_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Notification.objects.select_related('recipient_user')
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return NotificationListSerializer
        elif self.action == 'create':
            return NotificationCreateSerializer
        return NotificationSerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'search', 'my_notifications']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Xabarnoma yaratish"""
        serializer.save()
    
    def perform_update(self, serializer):
        """Xabarnoma yangilash"""
        # Faqat xabarnoma egasi yoki admin yangilay oladi
        notification = serializer.instance
        if notification.recipient_user != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu xabarnomani yangilay olmaysiz")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Xabarnoma o'chirish"""
        # Faqat xabarnoma egasi yoki admin o'chira oladi
        if instance.recipient_user != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu xabarnomani o'chira olmaysiz")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def my_notifications(self, request):
        """Joriy foydalanuvchi xabarnomalari"""
        notifications = self.get_queryset().filter(recipient_user=request.user)
        serializer = NotificationListSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """O'qilmagan xabarnomalar"""
        notifications = self.get_queryset().filter(recipient_user=request.user, read_at__isnull=True)
        serializer = NotificationListSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def read(self, request):
        """O'qilgan xabarnomalar"""
        notifications = self.get_queryset().filter(recipient_user=request.user, read_at__isnull=False)
        serializer = NotificationListSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Tur bo'yicha xabarnomalar"""
        notification_type = request.query_params.get('type')
        if not notification_type:
            return Response({'error': 'type parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        notifications = self.get_queryset().filter(recipient_user=request.user, type=notification_type)
        serializer = NotificationListSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_channel(self, request):
        """Kanal bo'yicha xabarnomalar"""
        channel = request.query_params.get('channel')
        if not channel:
            return Response({'error': 'channel parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        notifications = self.get_queryset().filter(recipient_user=request.user, delivery_method=channel)
        serializer = NotificationListSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Xabarnomani o'qilgan deb belgilash"""
        notification = self.get_object()
        if notification.recipient_user != request.user:
            raise permissions.PermissionDenied("Siz bu xabarnomani o'qilgan deb belgilay olmaysiz")
        
        notification.read_at = timezone.now()
        notification.save()
        
        return Response({'message': 'Xabarnoma o\'qilgan deb belgilandi'})
    
    @action(detail=True, methods=['post'])
    def mark_unread(self, request, pk=None):
        """Xabarnomani o'qilmagan deb belgilash"""
        notification = self.get_object()
        if notification.recipient_user != request.user:
            raise permissions.PermissionDenied("Siz bu xabarnomani o'qilmagan deb belgilay olmaysiz")
        
        notification.read_at = None
        notification.save()
        
        return Response({'message': 'Xabarnoma o\'qilmagan deb belgilandi'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Barcha xabarnomalarni o'qilgan deb belgilash"""
        Notification.objects.filter(recipient_user=request.user, read_at__isnull=True).update(read_at=timezone.now())
        return Response({'message': 'Barcha xabarnomalar o\'qilgan deb belgilandi'})
    
    @action(detail=False, methods=['post'])
    def mark_all_unread(self, request):
        """Barcha xabarnomalarni o'qilmagan deb belgilash"""
        Notification.objects.filter(recipient_user=request.user, read_at__isnull=False).update(read_at=None)
        return Response({'message': 'Barcha xabarnomalar o\'qilmagan deb belgilandi'})
    
    @action(detail=False, methods=['post'])
    def delete_read(self, request):
        """O'qilgan xabarnomalarni o'chirish"""
        Notification.objects.filter(recipient_user=request.user, read_at__isnull=False).delete()
        return Response({'message': 'O\'qilgan xabarnomalar o\'chirildi'})
    
    @action(detail=False, methods=['post'])
    def delete_old(self, request):
        """Eski xabarnomalarni o'chirish"""
        days = request.data.get('days', 30)
        cutoff_date = timezone.now() - timedelta(days=days)
        Notification.objects.filter(recipient_user=request.user, created_at__lt=cutoff_date).delete()
        return Response({'message': f'{days} kun oldingi xabarnomalar o\'chirildi'})


class NotificationListView(viewsets.ReadOnlyModelViewSet):
    """
    Xabarnomalar ro'yxati uchun ViewSet
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['recipient_user', 'type', 'delivery_method']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'sent_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Notification.objects.select_related('recipient_user')


class NotificationDetailView(viewsets.ReadOnlyModelViewSet):
    """
    Xabarnoma batafsil ma'lumotlari uchun ViewSet
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Notification.objects.select_related('recipient_user')


class NotificationCreateView(APIView):
    """
    Xabarnoma yaratish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Xabarnoma yaratish"""
        serializer = NotificationCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            notification = serializer.save()
            response_serializer = NotificationSerializer(notification)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationMarkReadView(APIView):
    """
    Xabarnomani o'qilgan deb belgilash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Xabarnomani o'qilgan deb belgilash"""
        try:
            notification = Notification.objects.get(pk=pk, recipient_user=request.user)
            notification.read_at = timezone.now()
            notification.save()
            
            return Response({'message': 'Xabarnoma o\'qilgan deb belgilandi'})
        except Notification.DoesNotExist:
            return Response({'error': 'Xabarnoma topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class NotificationMarkUnreadView(APIView):
    """
    Xabarnomani o'qilmagan deb belgilash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Xabarnomani o'qilmagan deb belgilash"""
        try:
            notification = Notification.objects.get(pk=pk, recipient_user=request.user)
            notification.read_at = None
            notification.save()
            
            return Response({'message': 'Xabarnoma o\'qilmagan deb belgilandi'})
        except Notification.DoesNotExist:
            return Response({'error': 'Xabarnoma topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class NotificationBulkActionView(APIView):
    """
    Xabarnomalar bulk action uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Bulk action"""
        action_type = request.data.get('action')
        notification_ids = request.data.get('notification_ids', [])
        
        if not action_type or not notification_ids:
            return Response({'error': 'action va notification_ids kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        notifications = Notification.objects.filter(
            id__in=notification_ids, 
            recipient_user=request.user
        )
        
        if action_type == 'mark_read':
            notifications.update(read_at=timezone.now())
            return Response({'message': 'Xabarnomalar o\'qilgan deb belgilandi'})
        elif action_type == 'mark_unread':
            notifications.update(read_at=None)
            return Response({'message': 'Xabarnomalar o\'qilmagan deb belgilandi'})
        elif action_type == 'delete':
            notifications.delete()
            return Response({'message': 'Xabarnomalar o\'chirildi'})
        else:
            return Response({'error': 'Noto\'g\'ri action'}, 
                           status=status.HTTP_400_BAD_REQUEST)


class NotificationSettingsView(APIView):
    """
    Xabarnoma sozlamalari uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Xabarnoma sozlamalarini olish"""
        # Hozircha placeholder
        return Response({'message': 'Xabarnoma sozlamalari'})
    
    def post(self, request):
        """Xabarnoma sozlamalarini yangilash"""
        # Hozircha placeholder
        return Response({'message': 'Xabarnoma sozlamalari yangilandi'})


class NotificationStatsView(APIView):
    """
    Xabarnoma statistikasi uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Xabarnoma statistikasi"""
        user_notifications = Notification.objects.filter(recipient_user=request.user)
        
        stats = {
            'total': user_notifications.count(),
            'unread': user_notifications.filter(read_at__isnull=True).count(),
            'read': user_notifications.filter(read_at__isnull=False).count(),
            'by_type': {},
            'by_channel': {}
        }
        
        # Tur bo'yicha statistikalar
        for notification_type in ['new_rfq', 'offer_received', 'payment_received', 'order_update']:
            stats['by_type'][notification_type] = user_notifications.filter(type=notification_type).count()
        
        # Kanal bo'yicha statistikalar
        for channel in ['push', 'sms', 'email']:
            stats['by_channel'][channel] = user_notifications.filter(delivery_method=channel).count()
        
        return Response(stats)


class NotificationSearchView(APIView):
    """
    Xabarnoma qidirish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Xabarnoma qidirish"""
        serializer = NotificationSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = Notification.objects.filter(recipient_user=request.user)
        
        filters = serializer.validated_data
        
        # Filterlar
        if filters.get('type'):
            queryset = queryset.filter(type=filters['type'])
        if filters.get('is_read') is not None:
            if filters['is_read']:
                queryset = queryset.filter(read_at__isnull=False)
            else:
                queryset = queryset.filter(read_at__isnull=True)
        if filters.get('channel'):
            queryset = queryset.filter(delivery_method=filters['channel'])
        if filters.get('date_from'):
            queryset = queryset.filter(created_at__gte=filters['date_from'])
        if filters.get('date_to'):
            queryset = queryset.filter(created_at__lte=filters['date_to'])
        
        # Qidiruv matni
        if filters.get('search'):
            search_term = filters['search']
            queryset = queryset.filter(
                Q(title__icontains=search_term) |
                Q(message__icontains=search_term)
            )
        
        serializer = NotificationListSerializer(queryset, many=True)
        return Response(serializer.data)
