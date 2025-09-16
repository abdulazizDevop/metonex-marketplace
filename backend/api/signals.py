from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Offer, Request, Notification, Order, Rating


@receiver(pre_save, sender=Offer)
def check_offer_expiry(sender, instance, **kwargs):
    """Taklif muddatini tekshirish"""
    if instance.pk:  # Yangi yaratilayotgan emas
        now = timezone.now()
        if instance.expires_at < now and instance.status == 'kutilmoqda':
            instance.status = 'muddati_tugadi'


@receiver(pre_save, sender=Request)
def check_request_expiry(sender, instance, **kwargs):
    """So'rov muddatini tekshirish"""
    if instance.pk:  # Yangi yaratilayotgan emas
        now = timezone.now()
        if instance.expires_at < now and instance.status == 'ochiq':
            instance.status = 'muddati_tugadi'


def create_notification(notification_type, message, recipient_user=None, recipient_company=None, related_request=None, related_order=None):
    """Notification yaratish utility funksiyasi"""
    Notification.objects.create(
        type=notification_type,
        message=message,
        recipient_user=recipient_user,
        recipient_company=recipient_company,
        related_request=related_request,
        related_order=related_order
    )


@receiver(post_save, sender=Order)
def order_notification_handler(sender, instance, created, **kwargs):
    """Order status o'zgarishida notification yaratish"""
    if created:
        # Yangi order yaratilganda
        create_notification(
            notification_type=Notification.NotificationType.ORDER_CREATED,
            message=f"Yangi buyurtma yaratildi: {instance.id}",
            recipient_user=instance.supplier_company.members.first().user,
            recipient_company=instance.supplier_company,
            related_order=instance
        )
    else:
        # Order status o'zgarishida
        if instance.status == Order.OrderStatus.PAYMENT_CONFIRMED:
            create_notification(
                notification_type=Notification.NotificationType.ORDER_PAYMENT_CONFIRMED,
                message=f"Buyurtma uchun to'lov tasdiqlandi: {instance.id}",
                recipient_user=instance.supplier_company.members.first().user,
                recipient_company=instance.supplier_company,
                related_order=instance
            )
        elif instance.status == Order.OrderStatus.IN_PRODUCTION:
            create_notification(
                notification_type=Notification.NotificationType.ORDER_PRODUCTION_STARTED,
                message=f"Buyurtma ishlab chiqarishga qo'yildi: {instance.id}",
                recipient_user=instance.buyer_company.members.first().user,
                recipient_company=instance.buyer_company,
                related_order=instance
            )
        elif instance.status == Order.OrderStatus.SHIPPED:
            create_notification(
                notification_type=Notification.NotificationType.ORDER_SHIPPED,
                message=f"Buyurtma yuborildi: {instance.id}",
                recipient_user=instance.buyer_company.members.first().user,
                recipient_company=instance.buyer_company,
                related_order=instance
            )
        elif instance.status == Order.OrderStatus.COMPLETED:
            create_notification(
                notification_type=Notification.NotificationType.ORDER_COMPLETED,
                message=f"Buyurtma yakunlandi: {instance.id}",
                recipient_user=instance.buyer_company.members.first().user,
                recipient_company=instance.buyer_company,
                related_order=instance
            )
            # Rating so'rovi
            create_notification(
                notification_type=Notification.NotificationType.RATING_REQUEST,
                message=f"Buyurtma yakunlandi. Baho qoldiring: {instance.id}",
                recipient_user=instance.buyer_company.members.first().user,
                recipient_company=instance.buyer_company,
                related_order=instance
            )


@receiver(post_save, sender=Rating)
def rating_notification_handler(sender, instance, created, **kwargs):
    """Rating qoldirilganda notification yaratish"""
    if created:
        create_notification(
            notification_type=Notification.NotificationType.RATING_RECEIVED,
            message=f"Sizga {instance.overall_score}/5 baho qoldirildi: {instance.comment[:50] if instance.comment else 'Izohsiz'}",
            recipient_user=instance.rated_company.members.first().user,
            recipient_company=instance.rated_company,
            related_order=instance.order
        )
