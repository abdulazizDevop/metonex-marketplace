"""
Offer serializers - Takliflar uchun serializers
"""

from rest_framework import serializers
from ..models import Offer, CounterOffer, User, RFQ, Product


class OfferSerializer(serializers.ModelSerializer):
    """
    To'liq taklif ma'lumotlari uchun serializer
    """
    supplier_info = serializers.SerializerMethodField()
    rfq_info = serializers.SerializerMethodField()
    product_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Offer
        fields = [
            'id', 'rfq', 'rfq_info', 'supplier', 'supplier_info', 'product', 'product_info',
            'price_per_unit', 'total_amount', 'delivery_terms', 'delivery_date',
            'status', 'rejection_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'supplier', 'created_at', 'updated_at'
        ]
    
    def get_supplier_info(self, obj):
        """Sotuvchi ma'lumotlarini olish"""
        return {
            'id': obj.supplier.id,
            'full_name': obj.supplier.get_full_name(),
            'phone': obj.supplier.phone,
            'supplier_type': obj.supplier.supplier_type,
        }
    
    def get_rfq_info(self, obj):
        """RFQ ma'lumotlarini olish"""
        return {
            'id': obj.rfq.id,
            'category_name': obj.rfq.category.name,
            'brand': obj.rfq.brand,
            'grade': obj.rfq.grade,
            'volume': obj.rfq.volume,
            'unit_symbol': obj.rfq.unit.symbol if obj.rfq.unit else None,
            'delivery_location': obj.rfq.delivery_location,
            'delivery_date': obj.rfq.delivery_date,
            'payment_method': obj.rfq.payment_method,
        }
    
    def get_product_info(self, obj):
        """Mahsulot ma'lumotlarini olish"""
        if obj.product:
            return {
                'id': obj.product.id,
                'brand': obj.product.brand,
                'grade': obj.product.grade,
                'category_name': obj.product.category.name,
                'unit_symbol': obj.product.unit.symbol,
            }
        return None


class OfferCreateSerializer(serializers.ModelSerializer):
    """
    Taklif yaratish uchun serializer
    """
    class Meta:
        model = Offer
        fields = [
            'id', 'rfq', 'product', 'price_per_unit', 'total_amount',
            'delivery_terms', 'delivery_date'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'rfq': {'required': True},
            'price_per_unit': {'required': True},
            'total_amount': {'required': True},
            'delivery_terms': {'required': True},
            'delivery_date': {'required': True},
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        user = self.context['request'].user
        
        # Sotuvchi tekshirish
        if user.role != User.UserRole.SUPPLIER:
            raise serializers.ValidationError({
                'supplier': 'Faqat sotuvchilar taklif yarata oladi'
            })
        
        # RFQ faol va muddati tugamagan bo'lishi kerak
        rfq = attrs['rfq']
        if not rfq.can_receive_offers():
            raise serializers.ValidationError({
                'rfq': 'Bu RFQ takliflar qabul qilmaydi (muddati tugagan yoki faol emas)'
            })
        
        # Yetkazib berish sanasi RFQ sanasidan keyin bo'lishi kerak
        if attrs['delivery_date'] <= rfq.delivery_date:
            raise serializers.ValidationError({
                'delivery_date': 'Yetkazib berish sanasi RFQ sanasidan keyin bo\'lishi kerak'
            })
        
        # Mahsulot sotuvchiga tegishli bo'lishi kerak
        if attrs.get('product') and attrs['product'].supplier != user:
            raise serializers.ValidationError({
                'product': 'Bu mahsulot sizga tegishli emas'
            })
        
        return attrs
    
    def create(self, validated_data):
        """Taklif yaratish"""
        validated_data['supplier'] = self.context['request'].user
        return Offer.objects.create(**validated_data)


class OfferListSerializer(serializers.ModelSerializer):
    """
    Takliflar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    supplier_info = serializers.SerializerMethodField()
    rfq_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Offer
        fields = [
            'id', 'supplier_info', 'rfq_info', 'price_per_unit', 'total_amount',
            'delivery_date', 'status', 'created_at'
        ]
    
    def get_supplier_info(self, obj):
        """Sotuvchi ma'lumotlarini olish"""
        return {
            'id': obj.supplier.id,
            'full_name': obj.supplier.get_full_name(),
            'supplier_type': obj.supplier.supplier_type,
        }
    
    def get_rfq_info(self, obj):
        """RFQ ma'lumotlarini olish"""
        return {
            'id': obj.rfq.id,
            'category_name': obj.rfq.category.name,
            'brand': obj.rfq.brand,
            'grade': obj.rfq.grade,
            'volume': obj.rfq.volume,
            'unit_symbol': obj.rfq.unit.symbol if obj.rfq.unit else None,
        }


class OfferUpdateSerializer(serializers.ModelSerializer):
    """
    Taklif yangilash uchun serializer
    """
    class Meta:
        model = Offer
        fields = [
            'product', 'price_per_unit', 'total_amount',
            'delivery_terms', 'delivery_date'
        ]
    
    def validate(self, attrs):
        """Validatsiya"""
        # Yetkazib berish sanasi RFQ sanasidan keyin bo'lishi kerak
        if attrs.get('delivery_date'):
            rfq = self.instance.rfq
            if attrs['delivery_date'] <= rfq.delivery_date:
                raise serializers.ValidationError({
                    'delivery_date': 'Yetkazib berish sanasi RFQ sanasidan keyin bo\'lishi kerak'
                })
        
        return attrs


class OfferAcceptSerializer(serializers.Serializer):
    """
    Taklifni qabul qilish uchun serializer
    """
    pass


class OfferRejectSerializer(serializers.Serializer):
    """
    Taklifni rad etish uchun serializer
    """
    rejection_reason = serializers.CharField(max_length=500, required=True)


class CounterOfferSerializer(serializers.ModelSerializer):
    """
    Qarshi taklif uchun serializer
    """
    sender_info = serializers.SerializerMethodField()
    original_offer_info = serializers.SerializerMethodField()
    
    class Meta:
        model = CounterOffer
        fields = [
            'id', 'original_offer', 'original_offer_info', 'sender', 'sender_info',
            'price_per_unit', 'volume', 'delivery_date', 'comment',
            'status', 'created_at'
        ]
        read_only_fields = [
            'id', 'sender', 'created_at'
        ]
    
    def get_sender_info(self, obj):
        """Yuboruvchi ma'lumotlarini olish"""
        return {
            'id': obj.sender.id,
            'full_name': obj.sender.get_full_name(),
            'phone': obj.sender.phone,
            'role': obj.sender.role,
        }
    
    def get_original_offer_info(self, obj):
        """Asl taklif ma'lumotlarini olish"""
        return {
            'id': obj.original_offer.id,
            'price_per_unit': obj.original_offer.price_per_unit,
            'total_amount': obj.original_offer.total_amount,
            'delivery_date': obj.original_offer.delivery_date,
            'status': obj.original_offer.status,
        }


class CounterOfferCreateSerializer(serializers.ModelSerializer):
    """
    Qarshi taklif yaratish uchun serializer
    """
    class Meta:
        model = CounterOffer
        fields = [
            'original_offer', 'price_per_unit', 'volume', 'delivery_date', 'comment'
        ]
        extra_kwargs = {
            'original_offer': {'required': True},
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        user = self.context['request'].user
        original_offer = attrs['original_offer']
        
        # Faqat RFQ egasi yoki taklif egasi qarshi taklif yarata oladi
        if user not in [original_offer.rfq.buyer, original_offer.supplier]:
            raise serializers.ValidationError({
                'original_offer': 'Siz bu taklifga qarshi taklif yarata olmaysiz'
            })
        
        # Taklif faol bo'lishi kerak
        if original_offer.status != Offer.OfferStatus.PENDING:
            raise serializers.ValidationError({
                'original_offer': 'Faqat kutilayotgan takliflarga qarshi taklif yarata olasiz'
            })
        
        # Kamida bitta field o'zgartirilishi kerak
        if not any([
            attrs.get('price_per_unit'),
            attrs.get('volume'),
            attrs.get('delivery_date')
        ]):
            raise serializers.ValidationError({
                'non_field_errors': 'Kamida bitta parametrni o\'zgartirish kerak'
            })
        
        return attrs
    
    def create(self, validated_data):
        """Qarshi taklif yaratish"""
        validated_data['sender'] = self.context['request'].user
        
        # Asl taklifni qarshi taklif holatiga o'tkazish
        original_offer = validated_data['original_offer']
        original_offer.status = Offer.OfferStatus.COUNTER_OFFERED
        original_offer.save()
        
        return CounterOffer.objects.create(**validated_data)


class CounterOfferListSerializer(serializers.ModelSerializer):
    """
    Qarshi takliflar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    sender_info = serializers.SerializerMethodField()
    
    class Meta:
        model = CounterOffer
        fields = [
            'id', 'sender_info', 'price_per_unit', 'volume', 'delivery_date',
            'status', 'created_at'
        ]
    
    def get_sender_info(self, obj):
        """Yuboruvchi ma'lumotlarini olish"""
        return {
            'id': obj.sender.id,
            'full_name': obj.sender.get_full_name(),
            'role': obj.sender.role,
        }


class CounterOfferAcceptSerializer(serializers.Serializer):
    """
    Qarshi taklifni qabul qilish uchun serializer
    """
    pass


class CounterOfferRejectSerializer(serializers.Serializer):
    """
    Qarshi taklifni rad etish uchun serializer
    """
    pass


class OfferSearchSerializer(serializers.Serializer):
    """
    Takliflar qidirish uchun serializer
    """
    rfq_id = serializers.IntegerField(required=False)
    supplier_id = serializers.IntegerField(required=False)
    status = serializers.ChoiceField(choices=Offer.OfferStatus.choices, required=False)
    min_price = serializers.DecimalField(max_digits=20, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=20, decimal_places=2, required=False)
    delivery_date_from = serializers.DateField(required=False)
    delivery_date_to = serializers.DateField(required=False)
    search = serializers.CharField(max_length=200, required=False)
    
    def validate(self, attrs):
        """Validatsiya"""
        if attrs.get('min_price') and attrs.get('max_price'):
            if attrs['min_price'] > attrs['max_price']:
                raise serializers.ValidationError({
                    'max_price': 'Maksimal narx minimal narxdan katta bo\'lishi kerak'
                })
        
        if attrs.get('delivery_date_from') and attrs.get('delivery_date_to'):
            if attrs['delivery_date_from'] > attrs['delivery_date_to']:
                raise serializers.ValidationError({
                    'delivery_date_to': 'Oxirgi sana boshlang\'ich sanadan keyin bo\'lishi kerak'
                })
        
        return attrs
