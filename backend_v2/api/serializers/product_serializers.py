"""
Product serializers - Mahsulotlar uchun serializers
"""

from rest_framework import serializers
from ..models import Product, Category, SubCategory, Unit, Factory, User


class ProductSerializer(serializers.ModelSerializer):
    """
    To'liq mahsulot ma'lumotlari uchun serializer
    """
    supplier_info = serializers.SerializerMethodField()
    category_info = serializers.SerializerMethodField()
    unit_info = serializers.SerializerMethodField()
    factory_info = serializers.SerializerMethodField()
    main_photo = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'supplier', 'supplier_info', 'category', 'category_info',
            'factory', 'factory_info', 'brand', 'grade', 'unit', 'unit_info',
            'base_price', 'currency', 'min_order_quantity', 'delivery_locations',
            'photos', 'certificates', 'specifications', 'material', 'origin_country',
            'warranty_period', 'view_count', 'rating', 'review_count',
            'is_active', 'is_featured', 'main_photo', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'supplier', 'view_count', 'rating', 'review_count',
            'created_at', 'updated_at'
        ]
    
    def get_supplier_info(self, obj):
        """Sotuvchi ma'lumotlarini olish"""
        return {
            'id': obj.supplier.id,
            'full_name': obj.supplier.get_full_name(),
            'phone': obj.supplier.phone,
            'supplier_type': obj.supplier.supplier_type,
        }
    
    def get_category_info(self, obj):
        """Kategoriya ma'lumotlarini olish"""
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            'slug': obj.category.slug,
            'unit_type': obj.category.unit_type,
        }
    
    def get_unit_info(self, obj):
        """Birlik ma'lumotlarini olish"""
        return {
            'id': obj.unit.id,
            'name': obj.unit.name,
            'symbol': obj.unit.symbol,
            'unit_type': obj.unit.unit_type,
        }
    
    def get_factory_info(self, obj):
        """Zavod ma'lumotlarini olish"""
        if obj.factory:
            return {
                'id': obj.factory.id,
                'name': obj.factory.name,
                'location': obj.factory.location,
            }
        return None
    
    def get_main_photo(self, obj):
        """Asosiy rasmni olish"""
        return obj.get_main_photo()


class ProductListSerializer(serializers.ModelSerializer):
    """
    Mahsulotlar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    supplier_info = serializers.SerializerMethodField()
    category_info = serializers.SerializerMethodField()
    unit_info = serializers.SerializerMethodField()
    main_photo = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'supplier_info', 'category_info', 'brand', 'grade',
            'unit_info', 'base_price', 'currency', 'min_order_quantity',
            'main_photo', 'rating', 'review_count', 'is_active', 'is_featured',
            'created_at'
        ]
    
    def get_supplier_info(self, obj):
        """Sotuvchi ma'lumotlarini olish"""
        return {
            'id': obj.supplier.id,
            'full_name': obj.supplier.get_full_name(),
            'supplier_type': obj.supplier.supplier_type,
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
        return {
            'id': obj.unit.id,
            'name': obj.unit.name,
            'symbol': obj.unit.symbol,
        }
    
    def get_main_photo(self, obj):
        """Asosiy rasmni olish"""
        return obj.get_main_photo()


class ProductCreateSerializer(serializers.ModelSerializer):
    """
    Mahsulot yaratish uchun serializer
    """
    class Meta:
        model = Product
        fields = [
            'category', 'factory', 'brand', 'grade', 'unit', 'base_price',
            'currency', 'min_order_quantity', 'delivery_locations', 'photos',
            'certificates', 'specifications', 'material', 'origin_country',
            'warranty_period', 'is_active', 'is_featured'
        ]
        extra_kwargs = {
            'category': {'required': True},
            'brand': {'required': True},
            'grade': {'required': True},
            'base_price': {'required': True},
            'min_order_quantity': {'required': True},
            'factory': {'required': True},
            'unit': {'required': False},  # Unit auto-select bo'ladi kategoriya asosida
            'specifications': {'required': False},  # Ixtiyoriy
            'material': {'required': False},  # Kerak emas
            'origin_country': {'required': False},  # Ixtiyoriy
            'warranty_period': {'required': False},  # Ixtiyoriy
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        user = self.context['request'].user
        
        # Sotuvchi tekshirish
        if user.role != User.UserRole.SUPPLIER:
            raise serializers.ValidationError({
                'supplier': 'Faqat sotuvchilar mahsulot yarata oladi'
            })
        
        # Diler uchun zavod majburiy
        if user.supplier_type == User.SupplierType.DEALER and not attrs.get('factory'):
            raise serializers.ValidationError({
                'factory': 'Diler uchun zavod tanlash majburiy'
            })
        
        # Unit auto-select: Agar unit berilmagan bo'lsa, kategoriyaning default unitini tanlash
        if attrs.get('category') and not attrs.get('unit'):
            from ..models import Unit
            try:
                default_unit = Unit.objects.filter(unit_type=attrs['category'].unit_type).first()
                if default_unit:
                    attrs['unit'] = default_unit
                else:
                    raise serializers.ValidationError({
                        'unit': f'{attrs["category"].name} kategoriyasi uchun mos birlik topilmadi'
                    })
            except Unit.DoesNotExist:
                raise serializers.ValidationError({
                    'unit': f'{attrs["category"].name} kategoriyasi uchun mos birlik topilmadi'
                })
        
        # Unit kategoriya bilan mos kelishi kerak
        if attrs.get('unit') and attrs.get('category'):
            if attrs['unit'].unit_type != attrs['category'].unit_type:
                raise serializers.ValidationError({
                    'unit': f'Birlik kategoriya turiga mos kelmaydi. Kategoriya: {attrs["category"].unit_type}, Birlik: {attrs["unit"].unit_type}'
                })
        
        return attrs
    
    def create(self, validated_data):
        """Mahsulot yaratish"""
        validated_data['supplier'] = self.context['request'].user
        return Product.objects.create(**validated_data)


class ProductUpdateSerializer(serializers.ModelSerializer):
    """
    Mahsulot yangilash uchun serializer
    """
    class Meta:
        model = Product
        fields = [
            'category', 'factory', 'brand', 'grade', 'unit', 'base_price',
            'currency', 'min_order_quantity', 'delivery_locations', 'photos',
            'certificates', 'specifications', 'material', 'origin_country',
            'warranty_period', 'is_active', 'is_featured'
        ]
    
    def validate(self, attrs):
        """Validatsiya"""
        # Unit kategoriya bilan mos kelishi kerak
        if attrs.get('unit') and attrs.get('category'):
            if attrs['unit'].unit_type != attrs['category'].unit_type:
                raise serializers.ValidationError({
                    'unit': f'Birlik kategoriya turiga mos kelmaydi. Kategoriya: {attrs["category"].unit_type}, Birlik: {attrs["unit"].unit_type}'
                })
        
        return attrs


class ProductSearchSerializer(serializers.Serializer):
    """
    Mahsulot qidirish uchun serializer
    """
    category_id = serializers.IntegerField(required=False)
    subcategory_id = serializers.IntegerField(required=False)
    brand = serializers.CharField(max_length=100, required=False)
    grade = serializers.CharField(max_length=100, required=False)
    min_price = serializers.DecimalField(max_digits=20, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=20, decimal_places=2, required=False)
    supplier_type = serializers.ChoiceField(choices=User.SupplierType.choices, required=False)
    is_featured = serializers.BooleanField(required=False)
    search = serializers.CharField(max_length=200, required=False)
    
    def validate(self, attrs):
        """Validatsiya"""
        if attrs.get('min_price') and attrs.get('max_price'):
            if attrs['min_price'] > attrs['max_price']:
                raise serializers.ValidationError({
                    'max_price': 'Maksimal narx minimal narxdan katta bo\'lishi kerak'
                })
        
        return attrs


class ProductAnalyticsSerializer(serializers.ModelSerializer):
    """
    Mahsulot analytics uchun serializer
    """
    supplier_info = serializers.SerializerMethodField()
    category_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'supplier_info', 'category_info', 'brand', 'grade',
            'view_count', 'rating', 'review_count', 'is_active', 'is_featured',
            'created_at', 'updated_at'
        ]
    
    def get_supplier_info(self, obj):
        """Sotuvchi ma'lumotlarini olish"""
        return {
            'id': obj.supplier.id,
            'full_name': obj.supplier.get_full_name(),
            'supplier_type': obj.supplier.supplier_type,
        }
    
    def get_category_info(self, obj):
        """Kategoriya ma'lumotlarini olish"""
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            'unit_type': obj.category.unit_type,
        }
