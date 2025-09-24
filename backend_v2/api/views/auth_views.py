"""
Authentication views - Autentifikatsiya uchun views
"""

import random
import string
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.cache import cache
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from ..models import User, VerificationCode
from ..serializers import (
    UserRegistrationSerializer,
    UserPhoneVerificationSerializer,
    UserPasswordChangeSerializer,
    UserProfileSerializer
)
from ..sms_service import sms_service


class SendSMSView(APIView):
    """
    SMS kod yuborish
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserPhoneVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        phone = serializer.validated_data['phone']
        
        # Rate limiting tekshirish
        cache_key = f"sms_rate_limit_{phone}"
        if cache.get(cache_key):
            return Response({
                'error': 'SMS kod yuborish uchun 60 soniya kutish kerak'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        # SMS kod yaratish
        code = ''.join(random.choices(string.digits, k=6))
        
        # VerificationCode yaratish
        VerificationCode.objects.create(
            phone=phone,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=5)
        )
        
        # SMS yuborish
        try:
            result = sms_service.send_verification_code(phone, code)
            if not result.get('success', False):
                error_msg = result.get('error', 'Nomalum xatolik')
                return Response({
                    'error': f"SMS yuborishda xatolik: {error_msg}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'error': f'SMS yuborishda xatolik yuz berdi: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Rate limiting qo'yish
        cache.set(cache_key, True, 60)
        
        return Response({
            'message': 'SMS kod yuborildi',
            'phone': phone
        }, status=status.HTTP_200_OK)


class VerifySMSView(APIView):
    """
    SMS kodni tasdiqlash
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserPhoneVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        phone = serializer.validated_data['phone']
        code = serializer.validated_data['code']
        
        # Kodni tekshirish
        try:
            verification_code = VerificationCode.objects.filter(
                phone=phone,
                code=code,
                used_at__isnull=True
            ).latest('created_at')
            
            if not verification_code.is_valid():
                verification_code.increment_attempts()
                return Response({
                    'error': 'Kod noto\'g\'ri yoki muddati tugagan'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Kodni ishlatilgan deb belgilash
            verification_code.mark_as_used()
            
            return Response({
                'message': 'Kod tasdiqlandi',
                'phone': phone,
                'verified': True
            }, status=status.HTTP_200_OK)
            
        except VerificationCode.DoesNotExist:
            return Response({
                'error': 'Kod noto\'g\'ri'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationView(APIView):
    """
    Foydalanuvchi ro'yxatdan o'tish
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Telefon raqami tasdiqlanganligini tekshirish
        phone = serializer.validated_data['phone']
        if not VerificationCode.objects.filter(
            phone=phone,
            used_at__isnull=False
        ).exists():
            return Response({
                'error': 'Telefon raqami tasdiqlanmagan'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Foydalanuvchi yaratish
        user = serializer.save()
        user.phone_verified = True
        user.save()
        
        # JWT token yaratish
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Foydalanuvchi muvaffaqiyatli yaratildi',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserLoginView(TokenObtainPairView):
    """
    Foydalanuvchi kirish
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Foydalanuvchi ma'lumotlarini qo'shish
            user = User.objects.get(phone=request.data.get('phone'))
            response.data['user'] = UserProfileSerializer(user).data
        
        return response


class UserLogoutView(APIView):
    """
    Foydalanuvchi chiqish
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Muvaffaqiyatli chiqildi'
            }, status=status.HTTP_200_OK)
        except TokenError:
            return Response({
                'error': 'Token noto\'g\'ri'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """
    Foydalanuvchi profili
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Profil ma'lumotlarini olish"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        """Profil ma'lumotlarini yangilash"""
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPasswordChangeView(APIView):
    """
    Parol o'zgartirish
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = UserPasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Parol muvaffaqiyatli o\'zgartirildi'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendPasswordChangeCodeView(APIView):
    """
    Parol o'zgartirish uchun SMS kod yuborish
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        phone = user.phone
        
        if not phone:
            return Response({
                'error': 'Telefon raqami kiritilmagan'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Rate limiting tekshirish
        cache_key = f"password_change_rate_limit_{phone}"
        if cache.get(cache_key):
            return Response({
                'error': 'SMS kod yuborish uchun 60 soniya kutish kerak'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        # SMS kod yaratish
        code = ''.join(random.choices(string.digits, k=6))
        
        # VerificationCode yaratish
        VerificationCode.objects.create(
            phone=phone,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=5)
        )
        
        # SMS yuborish
        try:
            result = sms_service.send_password_change_code(phone, code)
            if not result.get('success', False):
                error_msg = result.get('error', 'Nomalum xatolik')
                return Response({
                    'error': f"SMS yuborishda xatolik: {error_msg}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'error': f'SMS yuborishda xatolik yuz berdi: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Rate limiting qo'yish
        cache.set(cache_key, True, 60)
        
        return Response({
            'message': 'Parol o\'zgartirish kodi yuborildi',
            'phone': phone
        }, status=status.HTTP_200_OK)


class UserPhoneVerificationView(APIView):
    """
    Telefon raqami tasdiqlash
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = UserPhoneVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        phone = serializer.validated_data['phone']
        code = serializer.validated_data['code']
        
        # Kodni tekshirish
        try:
            verification_code = VerificationCode.objects.filter(
                phone=phone,
                code=code,
                used_at__isnull=True
            ).latest('created_at')
            
            if not verification_code.is_valid():
                verification_code.increment_attempts()
                return Response({
                    'error': 'Kod noto\'g\'ri yoki muddati tugagan'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Kodni ishlatilgan deb belgilash
            verification_code.mark_as_used()
            
            # Foydalanuvchi telefonini yangilash
            user = request.user
            user.phone = phone
            user.phone_verified = True
            user.save()
            
            return Response({
                'message': 'Telefon raqami tasdiqlandi',
                'phone': phone
            }, status=status.HTTP_200_OK)
            
        except VerificationCode.DoesNotExist:
            return Response({
                'error': 'Kod noto\'g\'ri'
            }, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(TokenRefreshView):
    """
    Token yangilash
    """
    permission_classes = [permissions.AllowAny]


class TokenBlacklistView(TokenBlacklistView):
    """
    Token blacklist
    """
    permission_classes = [permissions.IsAuthenticated]
