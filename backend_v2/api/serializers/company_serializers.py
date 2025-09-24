"""
Company serializers - Kompaniya ma'lumotlari uchun serializers
"""

from rest_framework import serializers
from ..models import Company, User, SupplierCategory, DealerFactory


class CompanyProfileSerializer(serializers.ModelSerializer):
    """
    Kompaniya profilini ko'rish va yangilash uchun serializer
    """
    user_info = serializers.SerializerMethodField()
    supplier_categories = serializers.SerializerMethodField()
    dealer_factories = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'legal_address', 'inn_stir', 'bank_details',
            'accountant_contact', 'telegram_owner', 'is_verified',
            'verification_documents', 'created_at', 'updated_at',
            'user_info', 'supplier_categories', 'dealer_factories'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at']
    
    def get_user_info(self, obj):
        """Foydalanuvchi ma'lumotlarini olish"""
        user = obj.user
        return {
            'id': user.id,
            'phone': user.phone,
            'role': user.role,
            'supplier_type': user.supplier_type,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': user.get_full_name(),
        }
    
    def get_supplier_categories(self, obj):
        """Sotuvchi kategoriyalarini olish"""
        if obj.user.role == User.UserRole.SUPPLIER:
            categories = SupplierCategory.objects.filter(user=obj.user).select_related('category')
            return [
                {
                    'id': sc.category.id,
                    'name': sc.category.name,
                    'slug': sc.category.slug,
                    'unit_type': sc.category.unit_type,
                }
                for sc in categories
            ]
        return []
    
    def get_dealer_factories(self, obj):
        """Diler zavodlarini olish"""
        if obj.user.supplier_type == User.SupplierType.DEALER:
            factories = DealerFactory.objects.filter(dealer=obj.user).select_related('factory')
            return [
                {
                    'id': df.factory.id,
                    'name': df.factory.name,
                    'location': df.factory.location,
                }
                for df in factories
            ]
        return []


class CompanySerializer(serializers.ModelSerializer):
    """
    To'liq kompaniya ma'lumotlari uchun serializer
    """
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'legal_address', 'inn_stir', 'bank_details',
            'accountant_contact', 'telegram_owner', 'is_verified',
            'verification_documents', 'created_at', 'updated_at', 'user_info'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_info(self, obj):
        """Foydalanuvchi ma'lumotlarini olish"""
        user = obj.user
        return {
            'id': user.id,
            'phone': user.phone,
            'role': user.role,
            'supplier_type': user.supplier_type,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': user.get_full_name(),
            'is_active': user.is_active,
        }


class CompanyListSerializer(serializers.ModelSerializer):
    """
    Kompaniyalar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'inn_stir', 'is_verified', 'created_at', 'user_info'
        ]
    
    def get_user_info(self, obj):
        """Foydalanuvchi ma'lumotlarini olish"""
        user = obj.user
        return {
            'id': user.id,
            'phone': user.phone,
            'role': user.role,
            'supplier_type': user.supplier_type,
            'full_name': user.get_full_name(),
        }


class CompanyCreateSerializer(serializers.ModelSerializer):
    """
    Kompaniya yaratish uchun serializer
    """
    categories = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text='Sotuvchi kategoriyalari ID ro\'yxati'
    )
    factories = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text='Diler zavodlari ID ro\'yxati'
    )
    
    class Meta:
        model = Company
        fields = [
            'name', 'legal_address', 'inn_stir', 'bank_details',
            'accountant_contact', 'telegram_owner', 'categories', 'factories'
        ]
        extra_kwargs = {
            'name': {'required': True},
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        user = self.context['request'].user
        
        # Sotuvchi kategoriyalari tekshirish
        if user.role == User.UserRole.SUPPLIER and not attrs.get('categories'):
            raise serializers.ValidationError({
                'categories': 'Sotuvchi uchun kamida bitta kategoriya tanlash kerak'
            })
        
        # Diler zavodlari tekshirish
        if user.supplier_type == User.SupplierType.DEALER and not attrs.get('factories'):
            raise serializers.ValidationError({
                'factories': 'Diler uchun kamida bitta zavod tanlash kerak'
            })
        
        return attrs
    
    def create(self, validated_data):
        """Kompaniya yaratish"""
        categories = validated_data.pop('categories', [])
        factories = validated_data.pop('factories', [])
        
        # Kompaniya yaratish
        company = Company.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
        # Sotuvchi kategoriyalarini qo'shish
        if categories:
            from ..models import Category
            supplier_categories = [
                SupplierCategory(user=company.user, category_id=cat_id)
                for cat_id in categories
                if Category.objects.filter(id=cat_id).exists()
            ]
            SupplierCategory.objects.bulk_create(supplier_categories)
        
        # Diler zavodlarini qo'shish
        if factories:
            from ..models import Factory
            dealer_factories = [
                DealerFactory(dealer=company.user, factory_id=factory_id)
                for factory_id in factories
                if Factory.objects.filter(id=factory_id).exists()
            ]
            DealerFactory.objects.bulk_create(dealer_factories)
        
        return company


class CompanyUpdateSerializer(serializers.ModelSerializer):
    """
    Kompaniya yangilash uchun serializer
    """
    categories = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text='Sotuvchi kategoriyalari ID ro\'yxati'
    )
    factories = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text='Diler zavodlari ID ro\'yxati'
    )
    
    class Meta:
        model = Company
        fields = [
            'name', 'legal_address', 'inn_stir', 'bank_details',
            'accountant_contact', 'telegram_owner', 'categories', 'factories'
        ]
    
    def update(self, instance, validated_data):
        """Kompaniya yangilash"""
        categories = validated_data.pop('categories', None)
        factories = validated_data.pop('factories', None)
        
        # Asosiy ma'lumotlarni yangilash
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Sotuvchi kategoriyalarini yangilash
        if categories is not None:
            SupplierCategory.objects.filter(user=instance.user).delete()
            if categories:
                from ..models import Category
                supplier_categories = [
                    SupplierCategory(user=instance.user, category_id=cat_id)
                    for cat_id in categories
                    if Category.objects.filter(id=cat_id).exists()
                ]
                SupplierCategory.objects.bulk_create(supplier_categories)
        
        # Diler zavodlarini yangilash
        if factories is not None:
            DealerFactory.objects.filter(dealer=instance.user).delete()
            if factories:
                from ..models import Factory
                dealer_factories = [
                    DealerFactory(dealer=instance.user, factory_id=factory_id)
                    for factory_id in factories
                    if Factory.objects.filter(id=factory_id).exists()
                ]
                DealerFactory.objects.bulk_create(dealer_factories)
        
        return instance
