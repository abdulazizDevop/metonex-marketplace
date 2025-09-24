"""
RFQ serializers - Request for Quote uchun serializers
"""

from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from ..models import RFQ, User, Category, SubCategory, Unit


class RFQSerializer(serializers.ModelSerializer):
    """
    To'liq RFQ ma'lumotlari uchun serializer
    """
    buyer_info = serializers.SerializerMethodField()
    category_info = serializers.SerializerMethodField()
    subcategory_info = serializers.SerializerMethodField()
    unit_info = serializers.SerializerMethodField()
    offers_count = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    can_receive_offers = serializers.SerializerMethodField()
    
    class Meta:
        model = RFQ
        fields = [
            'id', 'buyer', 'buyer_info', 'category', 'category_info',
            'subcategory', 'subcategory_info', 'brand', 'grade', 'sizes',
            'volume', 'unit', 'unit_info', 'delivery_location', 'delivery_date',
            'payment_method', 'status', 'expires_at', 'offers_count',
            'is_expired', 'can_receive_offers', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'buyer', 'offers_count', 'is_expired', 'can_receive_offers',
            'created_at', 'updated_at'
        ]
    
    def get_buyer_info(self, obj):
        """Sotib oluvchi ma'lumotlarini olish"""
        return {
            'id': obj.buyer.id,
            'full_name': obj.buyer.get_full_name(),
            'phone': obj.buyer.phone,
        }
    
    def get_category_info(self, obj):
        """Kategoriya ma'lumotlarini olish"""
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            'slug': obj.category.slug,
            'unit_type': obj.category.unit_type,
        }
    
    def get_subcategory_info(self, obj):
        """Sub-kategoriya ma'lumotlarini olish"""
        if obj.subcategory:
            return {
                'id': obj.subcategory.id,
                'name': obj.subcategory.name,
                'slug': obj.subcategory.slug,
            }
        return None
    
    def get_unit_info(self, obj):
        """Birlik ma'lumotlarini olish"""
        if obj.unit:
            return {
                'id': obj.unit.id,
                'name': obj.unit.name,
                'symbol': obj.unit.symbol,
                'unit_type': obj.unit.unit_type,
            }
        return None
    
    def get_offers_count(self, obj):
        """Takliflar sonini olish"""
        return obj.offers.count()
    
    def get_is_expired(self, obj):
        """Muddati tugaganmi tekshirish"""
        return obj.is_expired()
    
    def get_can_receive_offers(self, obj):
        """Takliflar qabul qila oladimi"""
        return obj.can_receive_offers()


class RFQCreateSerializer(serializers.ModelSerializer):
    """
    RFQ yaratish uchun serializer
    """
    class Meta:
        model = RFQ
        fields = [
            'id', 'category', 'subcategory', 'brand', 'grade', 'sizes',
            'volume', 'unit', 'delivery_location', 'delivery_date', 'payment_method'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'category': {'required': True},
            'volume': {'required': True},
            'unit': {'required': True},
            'delivery_location': {'required': True},
            'delivery_date': {'required': True},
            'payment_method': {'required': True},
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        user = self.context['request'].user
        
        # Sotib oluvchi tekshirish
        if user.role != User.UserRole.BUYER:
            raise serializers.ValidationError({
                'buyer': 'Faqat sotib oluvchilar RFQ yarata oladi'
            })
        
        # Yetkazib berish sanasi bugundan keyin bo'lishi kerak
        if attrs['delivery_date'] <= timezone.now().date():
            raise serializers.ValidationError({
                'delivery_date': 'Yetkazib berish sanasi bugundan keyin bo\'lishi kerak'
            })
        
        # Unit kategoriya bilan mos kelishi kerak
        if attrs.get('unit') and attrs.get('category'):
            if attrs['unit'].unit_type != attrs['category'].unit_type:
                raise serializers.ValidationError({
                    'unit': f'Birlik kategoriya turiga mos kelmaydi. Kategoriya: {attrs["category"].unit_type}, Birlik: {attrs["unit"].unit_type}'
                })
        
        # Sub-kategoriya kategoriya bilan mos kelishi kerak
        if attrs.get('subcategory') and attrs.get('category'):
            if attrs['subcategory'].category != attrs['category']:
                raise serializers.ValidationError({
                    'subcategory': 'Sub-kategoriya kategoriya bilan mos kelmaydi'
                })
        
        return attrs
    
    def create(self, validated_data):
        """RFQ yaratish"""
        # Muddati avtomatik belgilash (7 kun)
        validated_data['expires_at'] = timezone.now() + timedelta(days=7)
        validated_data['buyer'] = self.context['request'].user
        
        return RFQ.objects.create(**validated_data)


class RFQListSerializer(serializers.ModelSerializer):
    """
    RFQ ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    buyer_info = serializers.SerializerMethodField()
    category_info = serializers.SerializerMethodField()
    unit_info = serializers.SerializerMethodField()
    offers_count = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = RFQ
        fields = [
            'id', 'buyer_info', 'category_info', 'brand', 'grade',
            'volume', 'unit_info', 'delivery_location', 'delivery_date',
            'payment_method', 'status', 'offers_count', 'is_expired',
            'expires_at', 'created_at'
        ]
    
    def get_buyer_info(self, obj):
        """Sotib oluvchi ma'lumotlarini olish"""
        return {
            'id': obj.buyer.id,
            'full_name': obj.buyer.get_full_name(),
        }
    
    def get_category_info(self, obj):
        """Kategoriya ma'lumotlarini olish"""
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            'unit_type': obj.category.unit_type,
        }
    
    def get_unit_info(self, obj):
        """Birlik ma'lumotlarini olish"""
        if obj.unit:
            return {
                'id': obj.unit.id,
                'name': obj.unit.name,
                'symbol': obj.unit.symbol,
            }
        return None
    
    def get_offers_count(self, obj):
        """Takliflar sonini olish"""
        return obj.offers.count()
    
    def get_is_expired(self, obj):
        """Muddati tugaganmi tekshirish"""
        return obj.is_expired()


class RFQDetailSerializer(serializers.ModelSerializer):
    """
    RFQ batafsil ma'lumotlari uchun serializer
    """
    buyer_info = serializers.SerializerMethodField()
    category_info = serializers.SerializerMethodField()
    subcategory_info = serializers.SerializerMethodField()
    unit_info = serializers.SerializerMethodField()
    offers = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    can_receive_offers = serializers.SerializerMethodField()
    
    class Meta:
        model = RFQ
        fields = [
            'id', 'buyer', 'buyer_info', 'category', 'category_info',
            'subcategory', 'subcategory_info', 'brand', 'grade', 'sizes',
            'volume', 'unit', 'unit_info', 'delivery_location', 'delivery_date',
            'payment_method', 'status', 'expires_at', 'offers', 'is_expired',
            'can_receive_offers', 'created_at', 'updated_at'
        ]
    
    def get_buyer_info(self, obj):
        """Sotib oluvchi ma'lumotlarini olish"""
        return {
            'id': obj.buyer.id,
            'full_name': obj.buyer.get_full_name(),
            'phone': obj.buyer.phone,
        }
    
    def get_category_info(self, obj):
        """Kategoriya ma'lumotlarini olish"""
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            'slug': obj.category.slug,
            'unit_type': obj.category.unit_type,
        }
    
    def get_subcategory_info(self, obj):
        """Sub-kategoriya ma'lumotlarini olish"""
        if obj.subcategory:
            return {
                'id': obj.subcategory.id,
                'name': obj.subcategory.name,
                'slug': obj.subcategory.slug,
            }
        return None
    
    def get_unit_info(self, obj):
        """Birlik ma'lumotlarini olish"""
        if obj.unit:
            return {
                'id': obj.unit.id,
                'name': obj.unit.name,
                'symbol': obj.unit.symbol,
                'unit_type': obj.unit.unit_type,
            }
        return None
    
    def get_offers(self, obj):
        """Takliflar ro'yxatini olish"""
        from .offer_serializers import OfferListSerializer
        offers = obj.offers.all().order_by('-created_at')
        return OfferListSerializer(offers, many=True).data
    
    def get_is_expired(self, obj):
        """Muddati tugaganmi tekshirish"""
        return obj.is_expired()
    
    def get_can_receive_offers(self, obj):
        """Takliflar qabul qila oladimi"""
        return obj.can_receive_offers()


class RFQUpdateSerializer(serializers.ModelSerializer):
    """
    RFQ yangilash uchun serializer
    """
    class Meta:
        model = RFQ
        fields = [
            'category', 'subcategory', 'brand', 'grade', 'sizes',
            'volume', 'unit', 'delivery_location', 'delivery_date', 'payment_method'
        ]
    
    def validate(self, attrs):
        """Validatsiya"""
        # Yetkazib berish sanasi bugundan keyin bo'lishi kerak
        if attrs.get('delivery_date') and attrs['delivery_date'] <= timezone.now().date():
            raise serializers.ValidationError({
                'delivery_date': 'Yetkazib berish sanasi bugundan keyin bo\'lishi kerak'
            })
        
        # Unit kategoriya bilan mos kelishi kerak
        if attrs.get('unit') and attrs.get('category'):
            if attrs['unit'].unit_type != attrs['category'].unit_type:
                raise serializers.ValidationError({
                    'unit': f'Birlik kategoriya turiga mos kelmaydi. Kategoriya: {attrs["category"].unit_type}, Birlik: {attrs["unit"].unit_type}'
                })
        
        # Sub-kategoriya kategoriya bilan mos kelishi kerak
        if attrs.get('subcategory') and attrs.get('category'):
            if attrs['subcategory'].category != attrs['category']:
                raise serializers.ValidationError({
                    'subcategory': 'Sub-kategoriya kategoriya bilan mos kelmaydi'
                })
        
        return attrs


class RFQSearchSerializer(serializers.Serializer):
    """
    RFQ qidirish uchun serializer
    """
    category_id = serializers.IntegerField(required=False)
    subcategory_id = serializers.IntegerField(required=False)
    brand = serializers.CharField(max_length=100, required=False)
    grade = serializers.CharField(max_length=100, required=False)
    min_volume = serializers.DecimalField(max_digits=20, decimal_places=2, required=False)
    max_volume = serializers.DecimalField(max_digits=20, decimal_places=2, required=False)
    delivery_location = serializers.CharField(max_length=255, required=False)
    payment_method = serializers.ChoiceField(choices=RFQ.PaymentMethod.choices, required=False)
    status = serializers.ChoiceField(choices=RFQ.RFQStatus.choices, required=False)
    is_expired = serializers.BooleanField(required=False)
    search = serializers.CharField(max_length=200, required=False)
    
    def validate(self, attrs):
        """Validatsiya"""
        if attrs.get('min_volume') and attrs.get('max_volume'):
            if attrs['min_volume'] > attrs['max_volume']:
                raise serializers.ValidationError({
                    'max_volume': 'Maksimal hajm minimal hajmdan katta bo\'lishi kerak'
                })
        
        return attrs
