from django.utils import timezone
from django.conf import settings
from .models import Notification, User
from .firebase_service import firebase_service
from .sms_service import sms_service
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Notification xizmati - barcha notification turlarini boshqaradi
    """
    
    @staticmethod
    def create_notification(
        notification_type,
        title,
        message,
        recipient_user=None,
        delivery_method=Notification.DeliveryMethod.DATABASE_ONLY,
        related_rfq=None,
        related_offer=None,
        related_order=None
    ):
        """
        Notification yaratish va yuborish
        
        Args:
            notification_type: Notification turi
            title: Sarlavha
            message: Xabar matni
            recipient_user: Qabul qiluvchi foydalanuvchi
            delivery_method: Yuborish usuli
            related_*: Bog'liq obyektlar
        
        Returns:
            Notification: Yaratilgan notification
        """
        try:
            # Database da notification yaratish
            notification = Notification.objects.create(
                type=notification_type,
                title=title,
                message=message,
                recipient_user=recipient_user,
                delivery_method=delivery_method,
                related_rfq=related_rfq,
                related_offer=related_offer,
                related_order=related_order
            )
            
            # Delivery method bo'yicha yuborish
            NotificationService._deliver_notification(notification)
            
            return notification
            
        except Exception as e:
            logger.error(f"Notification yaratishda xatolik: {str(e)}")
            raise
    
    @staticmethod
    def _deliver_notification(notification):
        """
        Notificationni yuborish (private method)
        """
        try:
            if notification.delivery_method in [
                Notification.DeliveryMethod.PUSH_ONLY,
                Notification.DeliveryMethod.PUSH_SMS,
                Notification.DeliveryMethod.ALL
            ]:
                NotificationService._send_push_notification(notification)
            
            if notification.delivery_method in [
                Notification.DeliveryMethod.SMS_ONLY,
                Notification.DeliveryMethod.PUSH_SMS,
                Notification.DeliveryMethod.ALL
            ]:
                NotificationService._send_sms_notification(notification)
            
            # Yuborilgan deb belgilash
            notification.mark_as_sent()
            
        except Exception as e:
            logger.error(f"Notification yuborishda xatolik: {str(e)}")
            notification.mark_as_failed(str(e))
    
    @staticmethod
    def _send_push_notification(notification):
        """
        Push notification yuborish
        """
        if not notification.recipient_user:
            return
        
        # Foydalanuvchining device tokenini olish
        # Bu keyingi qadamda qo'shamiz
        device_token = NotificationService._get_user_device_token(notification.recipient_user)
        
        if device_token:
            try:
                firebase_service.send_notification(
                    device_token=device_token,
                    title=notification.title,
                    body=notification.message,
                    data={
                        'notification_id': str(notification.id),
                        'type': notification.type,
                        'related_rfq': str(notification.related_rfq.id) if notification.related_rfq else None,
                        'related_offer': str(notification.related_offer.id) if notification.related_offer else None,
                        'related_order': str(notification.related_order.id) if notification.related_order else None,
                    }
                )
                logger.info(f"Push notification yuborildi: {notification.id}")
            except Exception as e:
                logger.error(f"Push notification yuborishda xatolik: {str(e)}")
                raise
        else:
            logger.warning(f"Foydalanuvchi uchun device token topilmadi: {notification.recipient_user.phone}")
    
    @staticmethod
    def _send_sms_notification(notification):
        """
        SMS notification yuborish
        """
        if not notification.recipient_user:
            return
        
        try:
            sms_service.send_sms(
                phone=notification.recipient_user.phone,
                message=f"{notification.title}\n{notification.message}"
            )
            logger.info(f"SMS notification yuborildi: {notification.id}")
        except Exception as e:
            logger.error(f"SMS notification yuborishda xatolik: {str(e)}")
            raise
    
    @staticmethod
    def _get_user_device_token(user):
        """
        Foydalanuvchining device tokenini olish
        Bu keyingi qadamda User modeliga qo'shamiz
        """
        # Hozircha None qaytaramiz
        # Keyingi qadamda User modeliga device_token field qo'shamiz
        return getattr(user, 'device_token', None)
    
    @staticmethod
    def send_bulk_notification(
        notification_type,
        title,
        message,
        recipient_users,
        delivery_method=Notification.DeliveryMethod.DATABASE_ONLY
    ):
        """
        Ko'p foydalanuvchilarga notification yuborish
        
        Args:
            notification_type: Notification turi
            title: Sarlavha
            message: Xabar matni
            recipient_users: Qabul qiluvchi foydalanuvchilar
            delivery_method: Yuborish usuli
        
        Returns:
            list: Yaratilgan notificationlar
        """
        notifications = []
        
        for user in recipient_users:
            try:
                notification = NotificationService.create_notification(
                    notification_type=notification_type,
                    title=title,
                    message=message,
                    recipient_user=user,
                    delivery_method=delivery_method
                )
                notifications.append(notification)
            except Exception as e:
                logger.error(f"Bulk notification yuborishda xatolik (user: {user.phone}): {str(e)}")
        
        return notifications
    
    @staticmethod
    def send_topic_notification(
        notification_type,
        title,
        message,
        topic,
        delivery_method=Notification.DeliveryMethod.PUSH_ONLY
    ):
        """
        Topic bo'yicha notification yuborish
        
        Args:
            notification_type: Notification turi
            title: Sarlavha
            message: Xabar matni
            topic: Topic nomi (masalan: 'all_suppliers', 'all_buyers')
            delivery_method: Yuborish usuli
        
        Returns:
            Notification: Yaratilgan notification
        """
        try:
            # Database da notification yaratish (recipient_user=None)
            notification = Notification.objects.create(
                type=notification_type,
                title=title,
                message=message,
                recipient_user=None,  # Topic notification uchun
                delivery_method=delivery_method
            )
            
            # FCM topic notification yuborish
            if delivery_method in [
                Notification.DeliveryMethod.PUSH_ONLY,
                Notification.DeliveryMethod.PUSH_SMS,
                Notification.DeliveryMethod.ALL
            ]:
                firebase_service.send_topic_notification(
                    topic=topic,
                    title=title,
                    body=message,
                    data={
                        'notification_id': str(notification.id),
                        'type': notification_type,
                        'topic': topic,
                    }
                )
            
            notification.mark_as_sent()
            return notification
            
        except Exception as e:
            logger.error(f"Topic notification yuborishda xatolik: {str(e)}")
            raise


# Global notification service instance
notification_service = NotificationService()
