from rest_framework import serializers
from api.models import Offer, Request, Order
import uuid


class OfferSerializer(serializers.ModelSerializer):
    # Supplier company ma'lumotlari
    supplier_company_name = serializers.CharField(source='supplier_company.name', read_only=True)
    supplier_company_type = serializers.CharField(source='supplier_company.type', read_only=True)
    supplier_company_region = serializers.CharField(source='supplier_company.region', read_only=True)
    supplier_company_verified = serializers.BooleanField(source='supplier_company.verified', read_only=True)
    supplier_company_inn = serializers.CharField(source='supplier_company.inn', read_only=True)
    
    # Request ma'lumotlari
    request_category_name = serializers.CharField(source='request.category.name', read_only=True)
    request_description = serializers.CharField(source='request.description', read_only=True)
    request_quantity = serializers.IntegerField(source='request.quantity', read_only=True)
    request_unit = serializers.CharField(source='request.unit', read_only=True)
    request_budget_from = serializers.IntegerField(source='request.budget_from', read_only=True)
    request_budget_to = serializers.IntegerField(source='request.budget_to', read_only=True)
    request_deadline_date = serializers.DateField(source='request.deadline_date', read_only=True)
    request_payment_type = serializers.CharField(source='request.payment_type', read_only=True)
    request_delivery_address = serializers.CharField(source='request.delivery_address', read_only=True)
    
    class Meta:
        model = Offer
        fields = [
            'id', 'request', 'supplier_company', 'price', 'eta_days', 
            'delivery_included', 'comment',
            'warranty_period', 'special_conditions',
            'status', 'rejection_reason', 'created_at', 'updated_at',
            'supplier_company_name', 'supplier_company_type', 'supplier_company_region',
            'supplier_company_verified', 'supplier_company_inn',
            'request_category_name', 'request_description', 'request_quantity',
            'request_unit', 'request_budget_from', 'request_budget_to',
            'request_deadline_date', 'request_payment_type', 'request_delivery_address'
        ]

    def validate_request(self, value):
        if value.status != 'ochiq':
            raise serializers.ValidationError("So'rov ochiq emas")
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Narx 0 dan katta bo'lishi kerak")
        return value

    def validate_eta_days(self, value):
        if value <= 0:
            raise serializers.ValidationError("Yetkazib berish muddati 0 dan katta bo'lishi kerak")
        return value

    def validate(self, data):
        request = data.get('request')
        supplier_company = data.get('supplier_company')
        
        # Agar supplier'ning oldingi offer'i mavjud bo'lsa, uni tekshiramiz
        if request and supplier_company:
            existing_offer = Offer.objects.filter(
                request=request,
                supplier_company=supplier_company
            ).first()
            
            if existing_offer and existing_offer.status not in ['rad_etildi', 'bekor_qilindi']:
                raise serializers.ValidationError("Bu so'rov uchun allaqachon taklif yuborilgan")
        
        return data


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'request', 'offer', 'buyer_company', 'supplier_company',
            'status', 'total_amount', 'started_at', 'completed_at', 'cancelled_at',
            'cancellation_reason', 'created_at', 'updated_at'
        ]