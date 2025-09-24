"""
Catalog Admin - Katalog ma'lumotlari uchun admin panel (Unit, Category, SubCategory, Factory)
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import Unit, Category, SubCategory, Factory


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    """
    O'lchov birliklari uchun admin panel
    """
    list_display = ('name', 'symbol', 'unit_type', 'is_active', 'created_at')
    list_filter = ('unit_type', 'is_active', 'created_at')
    search_fields = ('name', 'symbol')
    ordering = ('unit_type', 'name')
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('name', 'symbol', 'unit_type', 'is_active')
        }),
        ('Sana', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ('created_at',)
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Kategoriyalar uchun admin panel
    """
    list_display = ('name', 'slug', 'unit_type', 'default_unit', 'is_active', 'created_at', 'subcategories_count')
    list_filter = ('unit_type', 'is_active', 'created_at')
    search_fields = ('name', 'slug')
    ordering = ('name',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('name', 'slug', 'unit_type', 'default_unit', 'is_active')
        }),
        ('Sana', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'subcategories_count')
    
    def subcategories_count(self, obj):
        """Sub-kategoriyalar soni"""
        count = obj.subcategories.count()
        if count > 0:
            url = reverse('admin:api_subcategory_changelist') + f'?category__id__exact={obj.id}'
            return format_html('<a href="{}">{} ta</a>', url, count)
        return '0 ta'
    subcategories_count.short_description = 'Sub-kategoriyalar'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('default_unit').prefetch_related('subcategories')


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    """
    Sub-kategoriyalar uchun admin panel
    """
    list_display = ('name', 'slug', 'category', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'slug', 'category__name')
    ordering = ('category', 'name')
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('name', 'slug', 'category', 'is_active')
        }),
        ('Sana', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ('created_at',)
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('category')


@admin.register(Factory)
class FactoryAdmin(admin.ModelAdmin):
    """
    Zavodlar uchun admin panel
    """
    list_display = ('name', 'location', 'created_at', 'dealers_count')
    list_filter = ('created_at',)
    search_fields = ('name', 'location')
    ordering = ('name',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('name', 'location')
        }),
        ('Sana', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ('created_at', 'dealers_count')
    
    def dealers_count(self, obj):
        """Dilerlar soni"""
        count = obj.dealers.count()
        if count > 0:
            url = reverse('admin:api_user_changelist') + f'?dealer_factories__factory__id__exact={obj.id}'
            return format_html('<a href="{}">{} ta</a>', url, count)
        return '0 ta'
    dealers_count.short_description = 'Dilerlar'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).prefetch_related('dealers')
