from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from api.models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Notification.objects.select_related(
        "recipient_user", 
        "recipient_company", 
        "related_request", 
        "related_order"
    ).all().order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(recipient_user=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def read(self, request, pk=None):
        notif = self.get_object()
        if notif.recipient_user_id != request.user.id:
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        if not notif.read_at:
            notif.read_at = timezone.now()
            notif.save(update_fields=["read_at"])
        return Response({"detail": "O'qildi"})
    
    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def mark_all_read(self, request):
        """Barcha notification'larni o'qilgan deb belgilash"""
        Notification.objects.filter(
            recipient_user=request.user,
            read_at__isnull=True
        ).update(read_at=timezone.now())
        return Response({"detail": "Barcha xabarlar o'qilgan deb belgilandi"})
    
    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def stats(self, request):
        """Notification statistikasi"""
        total = Notification.objects.filter(recipient_user=request.user).count()
        unread = Notification.objects.filter(
            recipient_user=request.user,
            read_at__isnull=True
        ).count()
        return Response({
            "total": total,
            "unread": unread,
            "read": total - unread
        })

