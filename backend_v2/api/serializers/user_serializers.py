"""
User serializers - Foydalanuvchi ma'lumotlari uchun serializers
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from ..models import User, Company


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Foydalanuvchi ro'yxatdan o'tish uchun serializer
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=False)
    company = serializers.DictField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'phone', 'role', 'supplier_type', 'first_name', 'last_name',
            'password', 'password_confirm', 'company'
        ]
        extra_kwargs = {
            'phone': {'required': True},
            'role': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }
    
    def validate(self, attrs):
        """Parol tasdiqlash"""
        # Agar password_confirm berilgan bo'lsa, tekshirish
        if 'password_confirm' in attrs and attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Parollar mos kelmaydi'
            })
        
        # Supplier type tekshirish
        if attrs['role'] == User.UserRole.SUPPLIER and not attrs.get('supplier_type'):
            raise serializers.ValidationError({
                'supplier_type': 'Sotuvchi uchun supplier_type majburiy'
            })
        
        return attrs
    
    def create(self, validated_data):
        """Foydalanuvchi yaratish"""
        validated_data.pop('password_confirm', None)  # Xavfsiz remove qilish
        password = validated_data.pop('password')
        company_data = validated_data.pop('company', None)
        
        print("Validation data:", validated_data)  # Debug
        
        user = User.objects.create_user(
            username=validated_data['phone'],  # Username sifatida phone ishlatamiz
            password=password,
            **validated_data
        )
        
        # Company ma'lumotlarini yaratish (agar mavjud bo'lsa)
        if company_data:
            Company.objects.create(
                user=user,
                name=company_data.get('name', ''),
                legal_address=company_data.get('legal_address', ''),
                inn_stir=company_data.get('inn_stir', ''),
                bank_details=company_data.get('bank_details', {}),
                accountant_contact=company_data.get('accountant_contact', {}),
                telegram_owner=company_data.get('telegram_owner', '')
            )
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Foydalanuvchi profilini ko'rish va yangilash uchun serializer
    """
    company = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    last_login_ip = serializers.CharField(max_length=45, read_only=True, allow_null=True)
    last_login_at = serializers.DateTimeField(read_only=True, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'phone', 'phone_verified', 'role', 'supplier_type',
            'first_name', 'last_name', 'full_name', 'avatar', 'is_active',
            'last_login_ip', 'last_login_at', 'created_at', 'updated_at', 'company'
        ]
        read_only_fields = [
            'id', 'phone', 'phone_verified', 'role', 'supplier_type',
            'last_login_ip', 'last_login_at', 'created_at', 'updated_at'
        ]
    
    def get_company(self, obj):
        """Kompaniya ma'lumotlarini olish"""
        try:
            company = obj.company
            return {
                'id': company.id,
                'name': company.name,
                'is_verified': company.is_verified,
                'inn_stir': company.inn_stir,
            }
        except Company.DoesNotExist:
            return None
    
    def get_full_name(self, obj):
        """To'liq ismni olish"""
        return obj.get_full_name()


class UserListSerializer(serializers.ModelSerializer):
    """
    Foydalanuvchilar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    full_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'phone', 'role', 'supplier_type', 'full_name',
            'company_name', 'is_active', 'created_at'
        ]
    
    def get_full_name(self, obj):
        """To'liq ismni olish"""
        return obj.get_full_name()
    
    def get_company_name(self, obj):
        """Kompaniya nomini olish"""
        try:
            return obj.company.name
        except Company.DoesNotExist:
            return None


class UserSerializer(serializers.ModelSerializer):
    """
    To'liq foydalanuvchi ma'lumotlari uchun serializer
    """
    company = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    last_login_ip = serializers.CharField(max_length=45, read_only=True, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'phone', 'phone_verified', 'role', 'supplier_type',
            'first_name', 'last_name', 'full_name', 'avatar', 'device_token',
            'is_active', 'last_login_ip', 'created_at', 'updated_at', 'company'
        ]
        read_only_fields = [
            'id', 'phone_verified', 'last_login_ip', 'created_at', 'updated_at'
        ]
    
    def get_company(self, obj):
        """Kompaniya ma'lumotlarini olish"""
        try:
            company = obj.company
            return {
                'id': company.id,
                'name': company.name,
                'is_verified': company.is_verified,
                'inn_stir': company.inn_stir,
                'legal_address': company.legal_address,
                'telegram_owner': company.telegram_owner,
            }
        except Company.DoesNotExist:
            return None
    
    def get_full_name(self, obj):
        """To'liq ismni olish"""
        return obj.get_full_name()


class SendSMSSerializer(serializers.Serializer):
    """
    SMS yuborish uchun serializer
    """
    phone = serializers.CharField(max_length=20)
    
    def validate_phone(self, value):
        """Telefon raqami validatsiyasi"""
        import re
        
        if not re.match(r'^\+998\d{9}$', value):
            raise serializers.ValidationError(
                'Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'
            )
        return value


class UserPhoneVerificationSerializer(serializers.Serializer):
    """
    Telefon raqami tasdiqlash uchun serializer
    """
    phone = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)
    
    def validate_phone(self, value):
        """Telefon raqami validatsiyasi"""
        import re
        
        if not re.match(r'^\+998\d{9}$', value):
            raise serializers.ValidationError(
                'Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'
            )
        return value


class UserPasswordChangeSerializer(serializers.Serializer):
    """
    Parol o'zgartirish uchun serializer
    """
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        """Parol tasdiqlash"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Yangi parollar mos kelmaydi'
            })
        return attrs
    
    def validate_old_password(self, value):
        """Eski parolni tekshirish"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Eski parol noto\'g\'ri')
        return value
