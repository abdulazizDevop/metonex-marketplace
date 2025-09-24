"""
Offer Admin - Takliflar uchun admin panel
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import Offer, CounterOffer


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    """
    Takliflar uchun admin panel
    """
    list_display = (
        'id', 'rfq_link', 'supplier_link', 'product_link', 'price_per_unit', 
        'total_amount', 'status', 'created_at'
    )
    list_filter = ('status', 'created_at')
    search_fields = (
        'delivery_terms', 'supplier__phone', 'supplier__first_name', 
        'supplier__last_name', 'rfq__brand', 'rfq__grade'
    )
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('rfq', 'supplier', 'product', 'price_per_unit', 'total_amount')
        }),
        ('Yetkazish', {
            'fields': ('delivery_terms', 'delivery_date')
        }),
        ('Holat', {
            'fields': ('status', 'rejection_reason')
        }),
        ('Sana', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'rfq_link', 'supplier_link', 'product_link', 'counter_offers_count')
    
    def rfq_link(self, obj):
        """RFQ havolasi"""
        if obj.rfq:
            url = reverse('admin:api_rfq_change', args=[obj.rfq.id])
            return format_html('<a href="{}">RFQ #{}</a>', url, obj.rfq.id)
        return '-'
    rfq_link.short_description = 'RFQ'
    
    def supplier_link(self, obj):
        """Sotuvchi havolasi"""
        if obj.supplier:
            url = reverse('admin:api_user_change', args=[obj.supplier.id])
            return format_html('<a href="{}">{}</a>', url, obj.supplier.phone)
        return '-'
    supplier_link.short_description = 'Sotuvchi'
    
    def product_link(self, obj):
        """Mahsulot havolasi"""
        if obj.product:
            url = reverse('admin:api_product_change', args=[obj.product.id])
            return format_html('<a href="{}">{}</a>', url, obj.product.brand)
        return '-'
    product_link.short_description = 'Mahsulot'
    
    def counter_offers_count(self, obj):
        """Counter-offer lar soni"""
        count = obj.counter_offers.count()
        if count > 0:
            url = reverse('admin:api_counteroffer_changelist') + f'?original_offer__id__exact={obj.id}'
            return format_html('<a href="{}">{} ta</a>', url, count)
        return '0 ta'
    counter_offers_count.short_description = 'Counter-offer lar'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related(
            'rfq', 'supplier', 'product'
        ).prefetch_related('supplier__company', 'counter_offers')


@admin.register(CounterOffer)
class CounterOfferAdmin(admin.ModelAdmin):
    """
    Counter-offer lar uchun admin panel
    """
    list_display = (
        'id', 'original_offer_link', 'sender_link', 'price_per_unit', 
        'volume', 'status', 'created_at'
    )
    list_filter = ('status', 'created_at')
    search_fields = (
        'comment', 'sender__phone', 'sender__first_name', 
        'sender__last_name', 'original_offer__rfq__brand'
    )
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('original_offer', 'sender', 'price_per_unit', 'volume')
        }),
        ('Yetkazish', {
            'fields': ('delivery_date',)
        }),
        ('Izoh', {
            'fields': ('comment',)
        }),
        ('Holat', {
            'fields': ('status',)
        }),
        ('Sana', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ('created_at', 'original_offer_link', 'sender_link')
    
    def original_offer_link(self, obj):
        """Original taklif havolasi"""
        if obj.original_offer:
            url = reverse('admin:api_offer_change', args=[obj.original_offer.id])
            return format_html('<a href="{}">Taklif #{}</a>', url, obj.original_offer.id)
        return '-'
    original_offer_link.short_description = 'Original taklif'
    
    def sender_link(self, obj):
        """Yuboruvchi havolasi"""
        if obj.sender:
            url = reverse('admin:api_user_change', args=[obj.sender.id])
            return format_html('<a href="{}">{}</a>', url, obj.sender.phone)
        return '-'
    sender_link.short_description = 'Yuboruvchi'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related(
            'original_offer', 'sender'
        ).prefetch_related('sender__company')
