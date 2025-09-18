import logging
from django.conf import settings
from typing import Optional, Dict, Any
from eskiz_sms import EskizSMS

logger = logging.getLogger(__name__)


class EskizSMSService:
    """
    Eskiz.uz SMS xizmati bilan integratsiya
    """
    
    def __init__(self):
        self.email = getattr(settings, 'ESKIZ_EMAIL', None)
        self.password = getattr(settings, 'ESKIZ_PASSWORD', None)
        self.sender = getattr(settings, 'ESKIZ_SENDER', '4546')
        self.eskiz = None
        
        if self.email and self.password:
            try:
                self.eskiz = EskizSMS(
                    email=self.email, 
                    password=self.password,
                    save_token=True,
                    env_file_path='.env'
                )
                logger.info("Eskiz SMS xizmati muvaffaqiyatli ishga tushirildi")
            except Exception as e:
                logger.error(f"Eskiz SMS xizmatini ishga tushirishda xatolik: {e}")
                self.eskiz = None
        else:
            logger.warning("Eskiz email yoki parol sozlanmagan")
    
    def send_sms(self, phone: str, message: str) -> Dict[str, Any]:
        """
        SMS xabar yuborish
        
        Args:
            phone: Telefon raqami (998XXXXXXXXX formatida)
            message: Xabar matni
            
        Returns:
            Dict: API javobi
        """
        if not self.eskiz:
            logger.error("Eskiz SMS xizmati sozlanmagan")
            return {
                "success": False,
                "error": "SMS xizmati sozlanmagan"
            }
        
        # Telefon raqamini tozalash
        clean_phone = phone.replace('+', '').replace(' ', '').replace('-', '')
        
        # Telefon raqamini tekshirish
        if not clean_phone.startswith('998') or len(clean_phone) != 12:
            logger.error(f"Noto'g'ri telefon raqam formati: {phone}")
            return {
                "success": False,
                "error": "Noto'g'ri telefon raqam formati"
            }
        
        try:
            response = self.eskiz.send_sms(
                clean_phone,
                message,
                from_whom=self.sender
            )
            
            logger.info(f"SMS muvaffaqiyatli yuborildi: {phone}")
            return {
                "success": True,
                "data": response
            }
            
        except Exception as e:
            logger.error(f"SMS yuborishda xatolik: {e}")
            return {
                "success": False,
                "error": f"SMS yuborishda xatolik: {str(e)}"
            }
    
    def send_verification_code(self, phone: str, code: str) -> Dict[str, Any]:
        """
        Tasdiqlash kodi yuborish (ro'yxatdan o'tish)
        
        Args:
            phone: Telefon raqami
            code: 6 xonali kod
            
        Returns:
            Dict: API javobi
        """
        message = f"metonex.uz saytida ro'yxatdan o'tish uchun tasdiqlash kodi: {code}"
        return self.send_sms(phone, message)
    
    def send_password_change_code(self, phone: str, code: str) -> Dict[str, Any]:
        """
        Parol o'zgartirish kodi yuborish
        
        Args:
            phone: Telefon raqami
            code: 6 xonali kod
            
        Returns:
            Dict: API javobi
        """
        message = f"MetOneX Marketplaceda parolingizni o'zgartirish uchun kodi: {code}"
        return self.send_sms(phone, message)


# Global instance
sms_service = EskizSMSService()
