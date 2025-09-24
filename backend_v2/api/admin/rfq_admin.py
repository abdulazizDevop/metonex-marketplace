"""
RFQ Admin - Request for Quote uchun admin panel
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import RFQ


@admin.register(RFQ)
class RFQAdmin(admin.ModelAdmin):
    """
    RFQ lar uchun admin panel
    """
    list_display = (
        'id', 'buyer_link', 'category', 'brand', 'grade', 'volume', 
        'unit', 'status', 'created_at'
    )
    list_filter = ('status', 'category', 'payment_method', 'created_at')
    search_fields = (
        'brand', 'grade', 'delivery_location', 
        'buyer__phone', 'buyer__first_name', 'buyer__last_name'
    )
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('buyer', 'category', 'brand', 'grade', 'volume', 'unit')
        }),
        ('Yetkazish', {
            'fields': ('delivery_location', 'delivery_date')
        }),
        ('To\'lov', {
            'fields': ('payment_method',)
        }),
        ('Holat', {
            'fields': ('status',)
        }),
        ('Sana', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'buyer_link', 'offers_count')
    
    def buyer_link(self, obj):
        """Sotib oluvchi havolasi"""
        if obj.buyer:
            url = reverse('admin:api_user_change', args=[obj.buyer.id])
            return format_html('<a href="{}">{}</a>', url, obj.buyer.phone)
        return '-'
    buyer_link.short_description = 'Sotib oluvchi'
    
    def offers_count(self, obj):
        """Takliflar soni"""
        count = obj.offers.count()
        if count > 0:
            url = reverse('admin:api_offer_changelist') + f'?rfq__id__exact={obj.id}'
            return format_html('<a href="{}">{} ta</a>', url, count)
        return '0 ta'
    offers_count.short_description = 'Takliflar'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related(
            'buyer', 'category', 'unit'
        ).prefetch_related('buyer__company', 'offers')
    
    def save_model(self, request, obj, form, change):
        """Model saqlash"""
        super().save_model(request, obj, form, change)
        
        # Agar RFQ faol bo'lsa, sotib oluvchini ham faollashtirish
        if obj.status == 'active' and obj.buyer:
            obj.buyer.is_active = True
            obj.buyer.save()
