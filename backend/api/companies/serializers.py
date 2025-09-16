from rest_framework import serializers
from api.models import Company, CompanyMember, CompanyCertificate


class CompanySerializer(serializers.ModelSerializer):
    documents = serializers.SerializerMethodField(read_only=True)
    sertificate = serializers.ImageField(required=False, allow_null=True)
    logo = serializers.SerializerMethodField(read_only=True)
    # type backendda user.type asosida belgilanadi → read_only
    type = serializers.CharField(read_only=True)
    certificates = serializers.SerializerMethodField(read_only=True)
    phone = serializers.SerializerMethodField(read_only=True)
    bank_details = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "type",
            "inn",
            "region",
            "verified",
            "documents",
            "sertificate",
            "logo",
            "certificates",
            "phone",
            "bank_details",
            "description",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            # name majburiy, qolganlari ixtiyoriy
            "name": {"required": True},
            "inn": {"required": True},
            "region": {"required": False},
            "verified": {"required": False},
            "documents": {"required": False},
            "sertificate": {"required": False},
            "description": {"required": False},
        }

    def get_documents(self, obj):
        if not obj.documents:
            return None
        request = self.context.get('request') if hasattr(self, 'context') else None
        url = obj.documents.url
        if request:
            try:
                url = request.build_absolute_uri(url)
            except Exception:
                pass
        return url

    def get_logo(self, obj):
        if not obj.logo:
            return None
        request = self.context.get('request') if hasattr(self, 'context') else None
        url = obj.logo.url
        if request:
            try:
                url = request.build_absolute_uri(url)
            except Exception:
                pass
        return url

    def get_certificates(self, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None
        certs = []
        for c in obj.certificates.all():
            if c.image:
                url = c.image.url
                if request:
                    try:
                        url = request.build_absolute_uri(url)
                    except Exception:
                        pass
                certs.append(url)
        return certs

    def get_phone(self, obj):
        # Kompaniya egasining telefon raqamini olish
        owner = obj.members.filter(role=CompanyMember.Role.OWNER).first()
        return owner.user.phone if owner else None

    def get_bank_details(self, obj):
        # Hozircha oddiy bank ma'lumotlari
        # Keyinchalik alohida BankDetails model yaratish mumkin
        return {
            'bank_name': 'Xalq Bank',
            'account_number': '20208000000000000001',
            'mfo': '00014',
            'inn': obj.inn
        }


class CompanyMemberSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)
    user_phone = serializers.CharField(source="user.phone", read_only=True)
    user_image = serializers.ImageField(source="user.image", read_only=True)
    user_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CompanyMember
        fields = ["id", "company", "user", "user_username", "user_name", "user_phone", "user_image", "user_image_url", "role", "created_at"]

    def get_user_image_url(self, obj):
        img = obj.user.image
        if not img:
            return None
        request = self.context.get('request') if hasattr(self, 'context') else None
        url = img.url
        if request:
            try:
                return request.build_absolute_uri(url)
            except Exception:
                return url
        return url

