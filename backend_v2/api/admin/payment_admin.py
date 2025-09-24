"""
Payment Admin - To'lovlar uchun admin panel
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    To'lovlar uchun admin panel
    """
    list_display = (
        'id', 'order_link', 'amount', 'currency', 'payment_method', 
        'status', 'processed_at', 'created_at'
    )
    list_filter = ('status', 'payment_method', 'currency', 'created_at')
    search_fields = (
        'payment_reference', 'escrow_reference', 'transaction_id',
        'order__id', 'order__buyer__phone', 'order__supplier__phone'
    )
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('order', 'amount', 'currency', 'payment_method', 'status')
        }),
        ('To\'lov ma\'lumotlari', {
            'fields': ('payment_proof_url', 'payment_reference'),
            'classes': ('collapse',)
        }),
        ('Escrow ma\'lumotlari', {
            'fields': ('escrow_reference', 'transaction_id', 'gateway_response'),
            'classes': ('collapse',)
        }),
        ('Qo\'shimcha ma\'lumotlar', {
            'fields': ('fee_amount', 'exchange_rate', 'processed_at'),
            'classes': ('collapse',)
        }),
        ('Sana', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ('created_at', 'order_link', 'payment_status')
    
    def order_link(self, obj):
        """Buyurtma havolasi"""
        if obj.order:
            url = reverse('admin:api_order_change', args=[obj.order.id])
            return format_html('<a href="{}">Buyurtma #{}</a>', url, obj.order.id)
        return '-'
    order_link.short_description = 'Buyurtma'
    
    def payment_status(self, obj):
        """To'lov holati"""
        status_colors = {
            'pending': 'orange',
            'received': 'green',
            'held_in_escrow': 'blue',
            'released': 'green',
            'refunded': 'red'
        }
        color = status_colors.get(obj.status, 'black')
        return format_html('<span style="color: {};">{}</span>', color, obj.get_status_display())
    payment_status.short_description = 'To\'lov holati'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related(
            'order', 'order__buyer', 'order__supplier'
        ).prefetch_related(
            'order__buyer__company', 'order__supplier__company'
        )
    
    def save_model(self, request, obj, form, change):
        """Model saqlash"""
        super().save_model(request, obj, form, change)
        
        # Agar to'lov qabul qilingan bo'lsa, buyurtma holatini yangilash
        if obj.status == 'received' and obj.order:
            obj.order.status = 'payment_received'
            obj.order.save()
