import requests
import json
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


class SMSService:
    """
    SMS xizmati (Eskiz.uz)
    """
    
    def __init__(self):
        self.email = settings.SMS_SERVICE.get('EMAIL')
        self.password = settings.SMS_SERVICE.get('PASSWORD')
        self.sender = settings.SMS_SERVICE.get('SENDER', '4546')
        
        if not self.email or not self.password:
            raise ImproperlyConfigured("ESKIZ_EMAIL and ESKIZ_PASSWORD environment variables are required")
        
        self.base_url = 'https://notify.eskiz.uz/api'
        self.token = None
    
    def _get_token(self):
        """Eskiz.uz dan token olish"""
        if self.token:
            return self.token
        
        url = f"{self.base_url}/auth/login"
        data = {
            'email': self.email,
            'password': self.password
        }
        
        try:
            response = requests.post(url, data=data, timeout=10)
            response.raise_for_status()
            result = response.json()
            
            if result.get('data', {}).get('token'):
                self.token = result['data']['token']
                return self.token
            else:
                raise Exception(f"SMS token error: {result.get('message', 'Unknown error')}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"SMS authentication failed: {str(e)}")
    
    def send_sms(self, phone, message):
        """
        SMS yuborish
        
        Args:
            phone (str): Telefon raqami (+998XXXXXXXXX formatida)
            message (str): SMS matni
        
        Returns:
            dict: SMS response
        """
        token = self._get_token()
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'mobile_phone': phone,
            'message': message,
            'from': self.sender
        }
        
        url = f"{self.base_url}/message/sms/send"
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"SMS sending failed: {str(e)}")
    
    def send_verification_code(self, phone, code):
        """
        Tasdiqlash kodi yuborish
        
        Args:
            phone (str): Telefon raqami
            code (str): Tasdiqlash kodi
        
        Returns:
            dict: SMS response
        """
        message = f"MetOneX tasdiqlash kodi: {code}. Bu kodni hech kimga bermang!"
        return self.send_sms(phone, message)
    
    def send_order_notification(self, phone, order_id, status):
        """
        Buyurtma holati haqida SMS yuborish
        
        Args:
            phone (str): Telefon raqami
            order_id (str): Buyurtma ID
            status (str): Buyurtma holati
        
        Returns:
            dict: SMS response
        """
        status_messages = {
            'pending': 'Buyurtmangiz qabul qilindi va ko\'rib chiqilmoqda.',
            'confirmed': 'Buyurtmangiz tasdiqlandi va tayyorlanmoqda.',
            'shipped': 'Buyurtmangiz yuborildi.',
            'delivered': 'Buyurtmangiz yetkazib berildi.',
            'cancelled': 'Buyurtmangiz bekor qilindi.'
        }
        
        message = f"Buyurtma #{order_id}: {status_messages.get(status, status)}"
        return self.send_sms(phone, message)


# Global SMS service instance
sms_service = SMSService()
