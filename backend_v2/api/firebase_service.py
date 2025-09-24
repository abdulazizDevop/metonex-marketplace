import firebase_admin
from firebase_admin import credentials, messaging
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
import logging

logger = logging.getLogger(__name__)


class FirebaseService:
    """
    Firebase Admin SDK orqali push notification xizmati
    """
    
    def __init__(self):
        self.app = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Firebase Admin SDK ni ishga tushirish"""
        try:
            # Firebase config tekshirish
            config = settings.FIREBASE_CONFIG
            required_fields = ['PROJECT_ID', 'PRIVATE_KEY', 'CLIENT_EMAIL']
            
            for field in required_fields:
                if not config.get(field):
                    raise ImproperlyConfigured(f"FIREBASE_{field} environment variable is required")
            
            # Credential yaratish
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": config['PROJECT_ID'],
                "private_key_id": config['PRIVATE_KEY_ID'],
                "private_key": config['PRIVATE_KEY'],
                "client_email": config['CLIENT_EMAIL'],
                "client_id": config['CLIENT_ID'],
                "auth_uri": config['AUTH_URI'],
                "token_uri": config['TOKEN_URI'],
            })
            
            # Firebase app ni ishga tushirish
            if not firebase_admin._apps:
                self.app = firebase_admin.initialize_app(cred)
            else:
                self.app = firebase_admin.get_app()
            
            logger.info("Firebase Admin SDK initialized successfully")
            
        except Exception as e:
            logger.error(f"Firebase initialization failed: {str(e)}")
            raise ImproperlyConfigured(f"Firebase configuration error: {str(e)}")
    
    def send_notification(self, device_token, title, body, data=None):
        """
        Bitta foydalanuvchiga push notification yuborish
        
        Args:
            device_token (str): Foydalanuvchi device token
            title (str): Notification sarlavhasi
            body (str): Notification matni
            data (dict): Qo'shimcha ma'lumotlar
        
        Returns:
            str: Message ID
        """
        try:
            # Android notification
            android_notification = messaging.AndroidNotification(
                title=title,
                body=body,
                sound='default'
            )
            
            # Android config
            android_config = messaging.AndroidConfig(
                notification=android_notification
            )
            
            # iOS notification
            apns_notification = messaging.APNSNotification(
                alert=messaging.ApsAlert(title=title, body=body),
                sound='default'
            )
            
            # iOS config
            apns_config = messaging.APNSConfig(
                notification=apns_notification
            )
            
            # Message yaratish
            message = messaging.Message(
                token=device_token,
                android=android_config,
                apns=apns_config,
                data=data or {}
            )
            
            # Yuborish
            response = messaging.send(message)
            logger.info(f"Push notification sent successfully: {response}")
            return response
            
        except Exception as e:
            logger.error(f"Push notification failed: {str(e)}")
            raise Exception(f"Push notification failed: {str(e)}")
    
    def send_multicast_notification(self, device_tokens, title, body, data=None):
        """
        Ko'p foydalanuvchilarga push notification yuborish
        
        Args:
            device_tokens (list): Foydalanuvchilar device tokenlari
            title (str): Notification sarlavhasi
            body (str): Notification matni
            data (dict): Qo'shimcha ma'lumotlar
        
        Returns:
            messaging.BatchResponse: Batch response
        """
        try:
            # Android notification
            android_notification = messaging.AndroidNotification(
                title=title,
                body=body,
                sound='default'
            )
            
            # Android config
            android_config = messaging.AndroidConfig(
                notification=android_notification
            )
            
            # iOS notification
            apns_notification = messaging.APNSNotification(
                alert=messaging.ApsAlert(title=title, body=body),
                sound='default'
            )
            
            # iOS config
            apns_config = messaging.APNSConfig(
                notification=apns_notification
            )
            
            # Message yaratish
            message = messaging.MulticastMessage(
                tokens=device_tokens,
                android=android_config,
                apns=apns_config,
                data=data or {}
            )
            
            # Yuborish
            response = messaging.send_multicast(message)
            logger.info(f"Multicast notification sent: {response.success_count}/{len(device_tokens)}")
            return response
            
        except Exception as e:
            logger.error(f"Multicast notification failed: {str(e)}")
            raise Exception(f"Multicast notification failed: {str(e)}")
    
    def send_topic_notification(self, topic, title, body, data=None):
        """
        Topic bo'yicha push notification yuborish
        
        Args:
            topic (str): Topic nomi (masalan: 'all_users', 'suppliers')
            title (str): Notification sarlavhasi
            body (str): Notification matni
            data (dict): Qo'shimcha ma'lumotlar
        
        Returns:
            str: Message ID
        """
        try:
            # Android notification
            android_notification = messaging.AndroidNotification(
                title=title,
                body=body,
                sound='default'
            )
            
            # Android config
            android_config = messaging.AndroidConfig(
                notification=android_notification
            )
            
            # iOS notification
            apns_notification = messaging.APNSNotification(
                alert=messaging.ApsAlert(title=title, body=body),
                sound='default'
            )
            
            # iOS config
            apns_config = messaging.APNSConfig(
                notification=apns_notification
            )
            
            # Message yaratish
            message = messaging.Message(
                topic=topic,
                android=android_config,
                apns=apns_config,
                data=data or {}
            )
            
            # Yuborish
            response = messaging.send(message)
            logger.info(f"Topic notification sent successfully: {response}")
            return response
            
        except Exception as e:
            logger.error(f"Topic notification failed: {str(e)}")
            raise Exception(f"Topic notification failed: {str(e)}")
    
    def subscribe_to_topic(self, device_tokens, topic):
        """
        Device tokenlarni topic ga subscribe qilish
        
        Args:
            device_tokens (list): Device tokenlar
            topic (str): Topic nomi
        
        Returns:
            messaging.TopicManagementResponse: Response
        """
        try:
            response = messaging.subscribe_to_topic(device_tokens, topic)
            logger.info(f"Subscribed to topic '{topic}': {response.success_count}/{len(device_tokens)}")
            return response
        except Exception as e:
            logger.error(f"Topic subscription failed: {str(e)}")
            raise Exception(f"Topic subscription failed: {str(e)}")
    
    def unsubscribe_from_topic(self, device_tokens, topic):
        """
        Device tokenlarni topic dan unsubscribe qilish
        
        Args:
            device_tokens (list): Device tokenlar
            topic (str): Topic nomi
        
        Returns:
            messaging.TopicManagementResponse: Response
        """
        try:
            response = messaging.unsubscribe_from_topic(device_tokens, topic)
            logger.info(f"Unsubscribed from topic '{topic}': {response.success_count}/{len(device_tokens)}")
            return response
        except Exception as e:
            logger.error(f"Topic unsubscription failed: {str(e)}")
            raise Exception(f"Topic unsubscription failed: {str(e)}")


# Global Firebase service instance
firebase_service = FirebaseService()
