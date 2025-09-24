"""
Catalog serializers - Katalog ma'lumotlari uchun serializers (Unit, Category, SubCategory, Factory)
"""

from rest_framework import serializers
from ..models import Unit, Category, SubCategory, Factory


class UnitSerializer(serializers.ModelSerializer):
    """
    O'lchov birliklari uchun serializer
    """
    class Meta:
        model = Unit
        fields = [
            'id', 'name', 'symbol', 'unit_type', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UnitListSerializer(serializers.ModelSerializer):
    """
    Birliklar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    class Meta:
        model = Unit
        fields = ['id', 'name', 'symbol', 'unit_type']


class CategorySerializer(serializers.ModelSerializer):
    """
    Kategoriyalar uchun serializer
    """
    default_unit_info = serializers.SerializerMethodField()
    available_units = serializers.SerializerMethodField()
    subcategories_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'unit_type', 'default_unit', 'default_unit_info',
            'available_units', 'subcategories_count', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_default_unit_info(self, obj):
        """Standart birlik ma'lumotlarini olish"""
        if obj.default_unit:
            return {
                'id': obj.default_unit.id,
                'name': obj.default_unit.name,
                'symbol': obj.default_unit.symbol,
                'unit_type': obj.default_unit.unit_type,
            }
        return None
    
    def get_available_units(self, obj):
        """Mavjud birliklarni olish"""
        units = obj.get_available_units()
        return [
            {
                'id': unit.id,
                'name': unit.name,
                'symbol': unit.symbol,
                'unit_type': unit.unit_type,
            }
            for unit in units
        ]
    
    def get_subcategories_count(self, obj):
        """Sub-kategoriyalar sonini olish"""
        return obj.subcategories.filter(is_active=True).count()


class CategoryListSerializer(serializers.ModelSerializer):
    """
    Kategoriyalar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    default_unit_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'unit_type', 'default_unit_info', 'is_active'
        ]
    
    def get_default_unit_info(self, obj):
        """Standart birlik ma'lumotlarini olish"""
        if obj.default_unit:
            return {
                'id': obj.default_unit.id,
                'name': obj.default_unit.name,
                'symbol': obj.default_unit.symbol,
            }
        return None


class CategoryWithSubcategoriesSerializer(serializers.ModelSerializer):
    """
    Sub-kategoriyalar bilan kategoriya serializer
    """
    subcategories = serializers.SerializerMethodField()
    default_unit_info = serializers.SerializerMethodField()
    available_units = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'unit_type', 'default_unit', 'default_unit_info',
            'available_units', 'subcategories', 'is_active', 'created_at', 'updated_at'
        ]
    
    def get_subcategories(self, obj):
        """Sub-kategoriyalarni olish"""
        subcategories = obj.subcategories.filter(is_active=True)
        return SubCategoryListSerializer(subcategories, many=True).data
    
    def get_default_unit_info(self, obj):
        """Standart birlik ma'lumotlarini olish"""
        if obj.default_unit:
            return {
                'id': obj.default_unit.id,
                'name': obj.default_unit.name,
                'symbol': obj.default_unit.symbol,
                'unit_type': obj.default_unit.unit_type,
            }
        return None
    
    def get_available_units(self, obj):
        """Mavjud birliklarni olish"""
        units = obj.get_available_units()
        return [
            {
                'id': unit.id,
                'name': unit.name,
                'symbol': unit.symbol,
                'unit_type': unit.unit_type,
            }
            for unit in units
        ]


class SubCategorySerializer(serializers.ModelSerializer):
    """
    Sub-kategoriyalar uchun serializer
    """
    category_info = serializers.SerializerMethodField()
    available_units = serializers.SerializerMethodField()
    default_unit_info = serializers.SerializerMethodField()
    
    class Meta:
        model = SubCategory
        fields = [
            'id', 'name', 'slug', 'category', 'category_info', 'available_units',
            'default_unit_info', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_category_info(self, obj):
        """Kategoriya ma'lumotlarini olish"""
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            'slug': obj.category.slug,
            'unit_type': obj.category.unit_type,
        }
    
    def get_available_units(self, obj):
        """Mavjud birliklarni olish"""
        units = obj.get_available_units()
        return [
            {
                'id': unit.id,
                'name': unit.name,
                'symbol': unit.symbol,
                'unit_type': unit.unit_type,
            }
            for unit in units
        ]
    
    def get_default_unit_info(self, obj):
        """Standart birlik ma'lumotlarini olish"""
        default_unit = obj.get_default_unit()
        if default_unit:
            return {
                'id': default_unit.id,
                'name': default_unit.name,
                'symbol': default_unit.symbol,
                'unit_type': default_unit.unit_type,
            }
        return None


class SubCategoryListSerializer(serializers.ModelSerializer):
    """
    Sub-kategoriyalar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    category_info = serializers.SerializerMethodField()
    
    class Meta:
        model = SubCategory
        fields = [
            'id', 'name', 'slug', 'category_info', 'is_active'
        ]
    
    def get_category_info(self, obj):
        """Kategoriya ma'lumotlarini olish"""
        return {
            'id': obj.category.id,
            'name': obj.category.name,
            'unit_type': obj.category.unit_type,
        }


class SubCategoryCreateSerializer(serializers.ModelSerializer):
    """
    Sub-kategoriya yaratish uchun serializer
    """
    class Meta:
        model = SubCategory
        fields = ['name', 'category']
        extra_kwargs = {
            'name': {'required': True},
            'category': {'required': True},
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        # Slug avtomatik yaratish
        from django.utils.text import slugify
        attrs['slug'] = slugify(attrs['name'])
        
        # Unique tekshirish
        if SubCategory.objects.filter(category=attrs['category'], slug=attrs['slug']).exists():
            raise serializers.ValidationError({
                'name': 'Bu nom bilan sub-kategoriya allaqachon mavjud'
            })
        
        return attrs


class FactorySerializer(serializers.ModelSerializer):
    """
    Zavodlar uchun serializer
    """
    dealers_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Factory
        fields = [
            'id', 'name', 'location', 'dealers_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_dealers_count(self, obj):
        """Dilerlar sonini olish"""
        return obj.dealers.count()


class FactoryListSerializer(serializers.ModelSerializer):
    """
    Zavodlar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    class Meta:
        model = Factory
        fields = ['id', 'name', 'location']


class FactoryCreateSerializer(serializers.ModelSerializer):
    """
    Zavod yaratish uchun serializer
    """
    class Meta:
        model = Factory
        fields = ['name', 'location']
        extra_kwargs = {
            'name': {'required': True},
        }


class CatalogMetaSerializer(serializers.Serializer):
    """
    Katalog meta ma'lumotlari uchun serializer
    """
    units_by_type = serializers.SerializerMethodField()
    categories_count = serializers.SerializerMethodField()
    subcategories_count = serializers.SerializerMethodField()
    factories_count = serializers.SerializerMethodField()
    
    def get_units_by_type(self, obj):
        """Birlik turlari bo'yicha guruhlash"""
        units = Unit.objects.filter(is_active=True)
        result = {}
        for unit_type, _ in Unit.UnitType.choices:
            result[unit_type] = [
                {
                    'id': unit.id,
                    'name': unit.name,
                    'symbol': unit.symbol,
                }
                for unit in units.filter(unit_type=unit_type)
            ]
        return result
    
    def get_categories_count(self, obj):
        """Kategoriyalar soni"""
        return Category.objects.filter(is_active=True).count()
    
    def get_subcategories_count(self, obj):
        """Sub-kategoriyalar soni"""
        return SubCategory.objects.filter(is_active=True).count()
    
    def get_factories_count(self, obj):
        """Zavodlar soni"""
        return Factory.objects.count()
