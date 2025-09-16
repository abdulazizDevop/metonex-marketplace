from rest_framework import serializers
from api.models import Request


class RequestSerializer(serializers.ModelSerializer):
    buyer_company_name = serializers.CharField(source='buyer_company.name', read_only=True)
    buyer_company_region = serializers.CharField(source='buyer_company.region', read_only=True)
    buyer_company_type = serializers.CharField(source='buyer_company.type', read_only=True)
    buyer_company_verified = serializers.BooleanField(source='buyer_company.verified', read_only=True)
    buyer_company_inn = serializers.CharField(source='buyer_company.inn', read_only=True)
    buyer_company_phone = serializers.SerializerMethodField(read_only=True)
    buyer_company_email = serializers.SerializerMethodField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Request
        fields = [
            "id",
            "buyer_company",
            "buyer_company_name",
            "buyer_company_region",
            "buyer_company_type",
            "buyer_company_verified",
            "buyer_company_inn",
            "buyer_company_phone",
            "buyer_company_email",
            "category",
            "category_name",
            "description",
            "quantity",
            "unit",
            "payment_type",
            "budget_from",
            "budget_to",
            "region",
            "delivery_address",
            "deadline_date",
            "status",
            "created_at",
            "expires_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "expires_at", "updated_at"]

    def get_buyer_company_phone(self, obj):
        if obj.buyer_company:
            owner = obj.buyer_company.members.filter(role='owner').first()
            return owner.user.phone if owner else None
        return None

    def get_buyer_company_email(self, obj):
        if obj.buyer_company:
            owner = obj.buyer_company.members.filter(role='owner').first()
            return owner.user.email if owner and owner.user.email else None
        return None

