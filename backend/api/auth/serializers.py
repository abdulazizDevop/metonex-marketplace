from rest_framework import serializers
from django.contrib.auth import authenticate
from api.models import User, Company
from django.utils import timezone


class RegisterSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.UserType.choices)
    phone = serializers.CharField(max_length=20)
    name = serializers.CharField(max_length=100)
    password = serializers.CharField(write_only=True, min_length=6)
    verification_code = serializers.IntegerField()

    # optional company
    company_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    company_region = serializers.CharField(max_length=100, required=False, allow_blank=True)
    company_inn = serializers.CharField(max_length=20, required=False, allow_blank=True)

    def _normalize_phone(self, phone: str) -> str:
        # '+' , bo'sh joy va '-' belgilarini olib tashlash
        if not isinstance(phone, str):
            return phone
        return phone.replace('+', '').replace(' ', '').replace('-', '')

    def validate_phone(self, value):
        normalized = self._normalize_phone(value)
        if User.objects.filter(phone=normalized).exists():
            raise serializers.ValidationError("Telefon allaqachon ro'yxatdan o'tgan")
        return normalized

    def validate(self, attrs):
        from api.models import VerificationCode
        # Kelgan phone ni normalize qilamiz (frontend + bilan yuborsa ham)
        phone = self._normalize_phone(attrs.get("phone", ""))
        attrs["phone"] = phone
        code = str(attrs.get("verification_code"))
        # Faqat eng oxirgi yuborilgan kodni qabul qilamiz
        last_vc = (
            VerificationCode.objects
            .filter(phone=phone)
            .order_by("-created_at")
            .first()
        )
        if not last_vc or not last_vc.is_valid_now() or last_vc.code != code:
            raise serializers.ValidationError({"verification_code": "Kod noto'g'ri yoki eskirgan"})
        attrs["_verification_obj_id"] = str(last_vc.id)
        return attrs

    def create(self, validated_data):
        role = validated_data.pop("role")
        phone = validated_data.pop("phone")
        name = validated_data.pop("name")
        password = validated_data.pop("password")
        validated_data.pop("verification_code", None)

        company_name = validated_data.pop("company_name", "").strip()
        company_region = validated_data.pop("company_region", "").strip()
        company_inn = validated_data.pop("company_inn", "").strip()

        user = User(phone=phone, name=name, type=role, username=phone, verified=True)
        user.set_password(password)
        user.save()

        # mark matched code used
        from api.models import VerificationCode
        vc_id = self.validated_data.get("_verification_obj_id")
        if vc_id:
            VerificationCode.objects.filter(id=vc_id, used_at__isnull=True).update(used_at=timezone.now())

        company = None
        if company_name:
            company = Company.objects.create(
                name=company_name,
                type=Company.CompanyType.SUPPLIER if role == User.UserType.SELLER else Company.CompanyType.BUYER,
                region=company_region or None,
                inn=company_inn or None,
                verified=False,
            )

        return {"user": user, "company": company}


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        # Telefonni normalize qilamiz: '+', bo'sh joy va '-' belgilarini olib tashlaymiz
        raw_phone = attrs.get("phone") or ""
        phone = raw_phone.replace('+', '').replace(' ', '').replace('-', '')
        attrs["phone"] = phone
        password = attrs.get("password")
        user = authenticate(request=self.context.get("request"), username=phone, password=password)
        if not user:
            raise serializers.ValidationError("Login yoki parol noto'g'ri")
        attrs["user"] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "phone", "name", "type", "image", "verified", "created_at"]

