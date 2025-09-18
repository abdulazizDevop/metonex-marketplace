from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from api.models import Company, CompanyMember
from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer
from api.models import VerificationCode
from api.sms_service import sms_service
import random
import logging

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        user = result["user"]
        company = result.get("company")

        if company is not None:
            CompanyMember.objects.create(company=company, user=user, role=CompanyMember.Role.OWNER)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": ProfileSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("=== LOGIN DEBUG ===")
        print("Request data:", request.data)
        print("Request headers:", dict(request.headers))
        
        serializer = LoginSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": ProfileSerializer(user).data,
        })


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "refresh token talab qilinadi"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({"detail": "refresh token noto'g'ri"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "logout ok"})


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(ProfileSerializer(request.user).data)

    def put(self, request):
        user = request.user
        data = request.data
        
        # Name validatsiyasi
        name = data.get("name")
        if name is not None:
            if not name or len(name.strip()) < 2:
                return Response({"detail": "Ism kamida 2 ta belgi bo'lishi kerak"}, status=status.HTTP_400_BAD_REQUEST)
            if len(name) > 100:
                return Response({"detail": "Ism juda uzun"}, status=status.HTTP_400_BAD_REQUEST)
            user.name = name
        
        # Image validatsiyasi
        image = data.get("image")
        if image is not None:
            if hasattr(image, 'content_type'):
                allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
                if image.content_type not in allowed_types:
                    return Response({"detail": "Rasm faqat JPG, JPEG, PNG formatida bo'lishi kerak"}, status=status.HTTP_400_BAD_REQUEST)
                if image.size > 5 * 1024 * 1024:  # 5MB
                    return Response({"detail": "Rasm hajmi 5MB dan kichik bo'lishi kerak"}, status=status.HTTP_400_BAD_REQUEST)
            user.image = image
        
        user.save()
        # Company ma'lumotlari ixtiyoriy tarzda yangilanadi
        return Response(ProfileSerializer(user).data)


class SendVerificationCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("=== SMS DEBUG ===")
        print("Request data:", request.data)
        print("Request headers:", dict(request.headers))
        
        phone = request.data.get("phone")
        if not phone:
            print("ERROR: phone talab qilinadi")
            return Response({"detail": "phone talab qilinadi"}, status=status.HTTP_400_BAD_REQUEST)

        # Phone number validatsiyasi
        print(f"Phone validation: {phone}, isdigit: {phone.isdigit()}, len: {len(phone)}, starts_with: {phone.startswith('+998')}")
        if not phone.isdigit() or len(phone) != 12 or not phone.startswith('+998'):
            print(f"ERROR: Telefon raqam validatsiyasida xatolik: {phone}")
            return Response({"detail": "Telefon raqami noto'g'ri formatda. +998XXXXXXXXX ko'rinishida bo'lishi kerak"}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()
        # Cooldown: 60s ichida qayta yuborilmaydi
        last = (
            VerificationCode.objects
            .filter(phone=phone)
            .order_by("-created_at")
            .first()
        )
        if last and last.used_at is None and last.expires_at > now:
            remaining = int((last.expires_at - now).total_seconds())
            return Response({
                "detail": "Hali amal qilayotgan kod mavjud",
                "cooldown_remaining": remaining,
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # Rate limit: 5/day
        start_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        count_today = VerificationCode.objects.filter(phone=phone, created_at__gte=start_day).count()
        if count_today >= 5:
            return Response({"detail": "Kunlik limit tugagan"}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        code = f"{random.randint(100000, 999999)}"
        expires_at = now + timedelta(minutes=1)
        VerificationCode.objects.create(phone=phone, code=code, expires_at=expires_at)

        # SMS yuborish
        sms_result = sms_service.send_verification_code(phone, code)
        
        if sms_result["success"]:
            logger.info(f"SMS kod muvaffaqiyatli yuborildi: {phone}")
            return Response({
                "detail": "SMS kod yuborildi",
                "phone": phone,
                "expires_in_seconds": 60
            })
        else:
            logger.error(f"SMS yuborishda xatolik: {sms_result.get('error', 'Nomalum xatolik')}")
            # SMS yuborishda xatolik bo'lsa ham, kodni bazaga saqlaymiz
            # (test rejimida ishlatish uchun)
            return Response({
                "detail": "SMS yuborishda xatolik yuz berdi",
                "error": sms_result.get("error", "Noma'lum xatolik"),
                "phone": phone,
                "code": code,  # Test uchun kodni qaytaramiz
                "expires_in_seconds": 60
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view that returns user info along with new tokens
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Token refresh muvaffaqiyatli bo'lsa, user ma'lumotlarini qo'shamiz
            try:
                refresh_token = request.data.get('refresh')
                if refresh_token:
                    token = RefreshToken(refresh_token)
                    user = token.payload.get('user_id')
                    if user:
                        from api.models import User
                        user_obj = User.objects.get(id=user)
                        response.data['user'] = ProfileSerializer(user_obj).data
            except Exception:
                pass  # User ma'lumotlari qo'shishda xato bo'lsa, asosiy response'ni qaytaramiz
        
        return response
