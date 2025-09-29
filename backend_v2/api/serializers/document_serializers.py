"""
Document serializers - Hujjatlar uchun serializers
"""

from rest_framework import serializers
from django.core.files.uploadedfile import UploadedFile
from ..models import Document, DocumentShare, User


class DocumentSerializer(serializers.ModelSerializer):
    """
    To'liq hujjat ma'lumotlari uchun serializer
    """
    user_info = serializers.SerializerMethodField()
    order_info = serializers.SerializerMethodField()
    company_info = serializers.SerializerMethodField()
    verified_by_info = serializers.SerializerMethodField()
    
    # File-related computed fields
    file_url = serializers.SerializerMethodField()
    file_extension = serializers.ReadOnlyField()
    is_image = serializers.ReadOnlyField()
    is_pdf = serializers.ReadOnlyField()
    human_readable_size = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    
    # Permissions
    can_delete = serializers.SerializerMethodField()
    can_view = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'user', 'user_info', 'order', 'order_info', 'company', 'company_info',
            'document_type', 'title', 'description', 'file', 'file_url', 'file_name', 
            'file_size', 'content_type', 'status', 'source', 'didox_document_id', 
            'didox_metadata', 'verified_by', 'verified_by_info', 'verified_at', 
            'rejection_reason', 'expires_at', 'metadata', 'file_extension', 
            'is_image', 'is_pdf', 'human_readable_size', 'is_expired',
            'can_delete', 'can_view', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'file_name', 'file_size', 'content_type', 'verified_by', 
            'verified_at', 'created_at', 'updated_at'
        ]

    def get_user_info(self, obj):
        """Foydalanuvchi ma'lumotlarini olish"""
        return {
            'id': obj.user.id,
            'full_name': obj.user.get_full_name(),
            'phone': obj.user.phone,
            'role': obj.user.role,
        }

    def get_order_info(self, obj):
        """Buyurtma ma'lumotlarini olish"""
        if obj.order:
            return {
                'id': obj.order.id,
                'status': obj.order.status,
                'total_amount': obj.order.total_amount,
                'created_at': obj.order.created_at,
            }
        return None

    def get_company_info(self, obj):
        """Kompaniya ma'lumotlarini olish"""
        if obj.company:
            return {
                'id': obj.company.id,
                'name': obj.company.name,
                'is_verified': obj.company.is_verified,
            }
        return None

    def get_verified_by_info(self, obj):
        """Tasdiqlagan shaxs ma'lumotlarini olish"""
        if obj.verified_by:
            return {
                'id': obj.verified_by.id,
                'full_name': obj.verified_by.get_full_name(),
                'role': obj.verified_by.role,
            }
        return None

    def get_file_url(self, obj):
        """Fayl URL ni olish"""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_can_delete(self, obj):
        """Foydalanuvchi hujjatni o'chira oladimi"""
        request = self.context.get('request')
        if request and request.user:
            return obj.can_be_deleted_by(request.user)
        return False

    def get_can_view(self, obj):
        """Foydalanuvchi hujjatni ko'ra oladimi"""
        request = self.context.get('request')
        if request and request.user:
            return obj.can_be_viewed_by(request.user)
        return False


class DocumentListSerializer(serializers.ModelSerializer):
    """
    Hujjatlar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    user_info = serializers.SerializerMethodField()
    file_extension = serializers.ReadOnlyField()
    is_image = serializers.ReadOnlyField()
    is_pdf = serializers.ReadOnlyField()
    human_readable_size = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()

    class Meta:
        model = Document
        fields = [
            'id', 'user_info', 'document_type', 'title', 'file_name', 
            'file_size', 'human_readable_size', 'status', 'source',
            'file_extension', 'is_image', 'is_pdf', 'is_expired',
            'verified_at', 'created_at'
        ]

    def get_user_info(self, obj):
        """Foydalanuvchi ma'lumotlarini olish"""
        return {
            'id': obj.user.id,
            'full_name': obj.user.get_full_name(),
        }


class DocumentCreateSerializer(serializers.ModelSerializer):
    """
    Hujjat yaratish uchun serializer
    """
    file = serializers.FileField(required=True)

    class Meta:
        model = Document
        fields = [
            'document_type', 'title', 'description', 'file', 'order', 
            'company', 'expires_at', 'metadata'
        ]

    def validate_file(self, value):
        """Fayl validatsiyasi"""
        if not isinstance(value, UploadedFile):
            raise serializers.ValidationError("Fayl yuklanishi kerak")

        # Fayl hajmi tekshiruvi (10MB limit)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError(
                f"Fayl hajmi {max_size / (1024*1024):.0f}MB dan oshmasligi kerak"
            )

        # Fayl turi tekshiruvi
        allowed_extensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']
        file_extension = value.name.split('.')[-1].lower()
        
        if file_extension not in allowed_extensions:
            raise serializers.ValidationError(
                f"Fayl turi qo'llab-quvvatlanmaydi. Ruxsat etilgan: {', '.join(allowed_extensions)}"
            )

        return value

    def validate(self, attrs):
        """Umumiy validatsiya"""
        user = self.context['request'].user
        
        # Order yoki company bog'lanishi tekshiruvi
        order = attrs.get('order')
        company = attrs.get('company')
        
        if order:
            # Order bilan bog'liq hujjat uchun ruxsat tekshiruvi
            if not (order.buyer == user or order.supplier == user or user.is_staff):
                raise serializers.ValidationError({
                    'order': 'Siz bu buyurtma uchun hujjat yuklay olmaysiz'
                })
        
        if company:
            # Company bilan bog'liq hujjat uchun ruxsat tekshiruvi
            if not (company.user == user or user.is_staff):
                raise serializers.ValidationError({
                    'company': 'Siz bu kompaniya uchun hujjat yuklay olmaysiz'
                })

        return attrs

    def create(self, validated_data):
        """Hujjat yaratish"""
        validated_data['user'] = self.context['request'].user
        
        # File ma'lumotlarini avtomatik to'ldirish
        file = validated_data['file']
        validated_data['file_name'] = file.name
        validated_data['file_size'] = file.size
        validated_data['content_type'] = file.content_type

        return Document.objects.create(**validated_data)


class DocumentUpdateSerializer(serializers.ModelSerializer):
    """
    Hujjat yangilash uchun serializer
    """
    class Meta:
        model = Document
        fields = [
            'title', 'description', 'expires_at', 'metadata'
        ]

    def validate(self, attrs):
        """Yangilash ruxsati tekshiruvi"""
        user = self.context['request'].user
        document = self.instance
        
        if not document.can_be_deleted_by(user):
            raise serializers.ValidationError(
                "Siz bu hujjatni yangilay olmaysiz"
            )
        
        return attrs


class DocumentVerificationSerializer(serializers.Serializer):
    """
    Hujjat tasdiqlash/rad etish uchun serializer
    """
    action = serializers.ChoiceField(choices=['verify', 'reject'])
    reason = serializers.CharField(max_length=500, required=False)

    def validate(self, attrs):
        """Validatsiya"""
        action = attrs['action']
        reason = attrs.get('reason', '')

        if action == 'reject' and not reason:
            raise serializers.ValidationError({
                'reason': 'Rad etish sababi ko\'rsatilishi kerak'
            })

        return attrs


class DocumentShareSerializer(serializers.ModelSerializer):
    """
    Hujjat ulashish uchun serializer
    """
    document_info = serializers.SerializerMethodField()
    shared_with_info = serializers.SerializerMethodField()
    shared_by_info = serializers.SerializerMethodField()
    is_expired = serializers.ReadOnlyField()

    class Meta:
        model = DocumentShare
        fields = [
            'id', 'document', 'document_info', 'shared_with', 'shared_with_info',
            'shared_by', 'shared_by_info', 'share_type', 'expires_at', 
            'is_active', 'accessed_at', 'access_count', 'is_expired', 'created_at'
        ]
        read_only_fields = ['id', 'shared_by', 'accessed_at', 'access_count', 'created_at']

    def get_document_info(self, obj):
        """Hujjat ma'lumotlarini olish"""
        return {
            'id': obj.document.id,
            'title': obj.document.title,
            'document_type': obj.document.document_type,
            'file_name': obj.document.file_name,
        }

    def get_shared_with_info(self, obj):
        """Ulashilgan foydalanuvchi ma'lumotlari"""
        return {
            'id': obj.shared_with.id,
            'full_name': obj.shared_with.get_full_name(),
            'phone': obj.shared_with.phone,
        }

    def get_shared_by_info(self, obj):
        """Ulashgan foydalanuvchi ma'lumotlari"""
        return {
            'id': obj.shared_by.id,
            'full_name': obj.shared_by.get_full_name(),
        }

    def validate(self, attrs):
        """Validatsiya"""
        user = self.context['request'].user
        document = attrs['document']
        shared_with = attrs['shared_with']

        # Hujjat egasi ekanligini tekshirish
        if not document.can_be_viewed_by(user):
            raise serializers.ValidationError({
                'document': 'Siz bu hujjatni ulasha olmaysiz'
            })

        # O'ziga ulasha olmaslik
        if shared_with == user:
            raise serializers.ValidationError({
                'shared_with': 'Hujjatni o\'zingizga ulasha olmaysiz'
            })

        return attrs

    def create(self, validated_data):
        """Ulashish yaratish"""
        validated_data['shared_by'] = self.context['request'].user
        return DocumentShare.objects.create(**validated_data)


class DocumentSearchSerializer(serializers.Serializer):
    """
    Hujjatlar qidirish uchun serializer
    """
    document_type = serializers.CharField(max_length=50, required=False)
    status = serializers.ChoiceField(choices=Document.DocumentStatus.choices, required=False)
    source = serializers.ChoiceField(choices=Document.DocumentSource.choices, required=False)
    user_id = serializers.IntegerField(required=False)
    order_id = serializers.IntegerField(required=False)
    company_id = serializers.IntegerField(required=False)
    is_expired = serializers.BooleanField(required=False)
    created_from = serializers.DateTimeField(required=False)
    created_to = serializers.DateTimeField(required=False)
    search = serializers.CharField(max_length=200, required=False)

    def validate(self, attrs):
        """Validatsiya"""
        created_from = attrs.get('created_from')
        created_to = attrs.get('created_to')

        if created_from and created_to:
            if created_from > created_to:
                raise serializers.ValidationError({
                    'created_to': 'Oxirgi sana boshlang\'ich sanadan keyin bo\'lishi kerak'
                })

        return attrs
