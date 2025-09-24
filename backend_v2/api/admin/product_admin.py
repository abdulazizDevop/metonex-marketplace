"""
Product Admin - Mahsulotlar uchun admin panel
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Mahsulotlar uchun admin panel
    """
    list_display = (
        'brand', 'grade', 'supplier_link', 'category', 'base_price', 
        'currency', 'is_active', 'is_featured', 'created_at'
    )
    list_filter = (
        'category', 'supplier__supplier_type', 'currency', 'is_active', 
        'is_featured', 'created_at'
    )
    search_fields = (
        'brand', 'grade', 'material', 'origin_country', 
        'supplier__phone', 'supplier__first_name', 'supplier__last_name'
    )
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('supplier', 'category', 'factory', 'brand', 'grade', 'unit')
        }),
        ('Narx va miqdor', {
            'fields': ('base_price', 'currency', 'min_order_quantity')
        }),
        ('Texnik ma\'lumotlar', {
            'fields': ('specifications', 'material', 'origin_country', 'warranty_period'),
            'classes': ('collapse',)
        }),
        ('Statistika', {
            'fields': ('view_count', 'rating', 'review_count'),
            'classes': ('collapse',)
        }),
        ('Holat', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Sana', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'supplier_link', 'view_count', 'rating', 'review_count')
    
    def supplier_link(self, obj):
        """Sotuvchi havolasi"""
        if obj.supplier:
            url = reverse('admin:api_user_change', args=[obj.supplier.id])
            return format_html('<a href="{}">{}</a>', url, obj.supplier.phone)
        return '-'
    supplier_link.short_description = 'Sotuvchi'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related(
            'supplier', 'category', 'unit', 'factory'
        ).prefetch_related('supplier__company')
    
    def save_model(self, request, obj, form, change):
        """Model saqlash"""
        super().save_model(request, obj, form, change)
        
        # Agar mahsulot faol bo'lsa, sotuvchini ham faollashtirish
        if obj.is_active and obj.supplier:
            obj.supplier.is_active = True
            obj.supplier.save()
