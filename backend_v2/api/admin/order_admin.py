"""
Order Admin - Buyurtmalar uchun admin panel
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import Order, OrderDocument, OrderStatusHistory


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Buyurtmalar uchun admin panel
    """
    list_display = (
        'id', 'buyer_link', 'supplier_link', 'total_amount', 
        'payment_method', 'status', 'created_at'
    )
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = (
        'contract_url', 'invoice_url', 'payment_reference',
        'buyer__phone', 'buyer__first_name', 'buyer__last_name',
        'supplier__phone', 'supplier__first_name', 'supplier__last_name'
    )
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('rfq', 'offer', 'buyer', 'supplier', 'total_amount', 'payment_method')
        }),
        ('Hujjatlar', {
            'fields': ('contract_url', 'invoice_url', 'payment_reference'),
            'classes': ('collapse',)
        }),
        ('Yetkazish', {
            'fields': ('delivery_date', 'estimated_delivery_date', 'actual_delivery_date'),
            'classes': ('collapse',)
        }),
        ('Holat', {
            'fields': ('status',)
        }),
        ('Sana', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'buyer_link', 'supplier_link', 'documents_count', 'status_history_count')
    
    def buyer_link(self, obj):
        """Sotib oluvchi havolasi"""
        if obj.buyer:
            url = reverse('admin:api_user_change', args=[obj.buyer.id])
            return format_html('<a href="{}">{}</a>', url, obj.buyer.phone)
        return '-'
    buyer_link.short_description = 'Sotib oluvchi'
    
    def supplier_link(self, obj):
        """Sotuvchi havolasi"""
        if obj.supplier:
            url = reverse('admin:api_user_change', args=[obj.supplier.id])
            return format_html('<a href="{}">{}</a>', url, obj.supplier.phone)
        return '-'
    supplier_link.short_description = 'Sotuvchi'
    
    def documents_count(self, obj):
        """Hujjatlar soni"""
        count = obj.documents.count()
        if count > 0:
            url = reverse('admin:api_orderdocument_changelist') + f'?order__id__exact={obj.id}'
            return format_html('<a href="{}">{} ta</a>', url, count)
        return '0 ta'
    documents_count.short_description = 'Hujjatlar'
    
    def status_history_count(self, obj):
        """Holat tarixi soni"""
        count = obj.status_history.count()
        if count > 0:
            url = reverse('admin:api_orderstatushistory_changelist') + f'?order__id__exact={obj.id}'
            return format_html('<a href="{}">{} ta</a>', url, count)
        return '0 ta'
    status_history_count.short_description = 'Holat tarixi'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related(
            'rfq', 'offer', 'buyer', 'supplier'
        ).prefetch_related(
            'buyer__company', 'supplier__company', 'documents', 'status_history'
        )


@admin.register(OrderDocument)
class OrderDocumentAdmin(admin.ModelAdmin):
    """
    Buyurtma hujjatlari uchun admin panel
    """
    list_display = ('id', 'order_link', 'document_type', 'uploaded_by_link', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('file_url', 'order__id', 'uploaded_by__phone', 'uploaded_by__first_name')
    ordering = ('-uploaded_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('order', 'document_type', 'file_url', 'uploaded_by')
        }),
        ('Sana', {
            'fields': ('uploaded_at',)
        }),
    )
    
    readonly_fields = ('uploaded_at', 'order_link', 'uploaded_by_link')
    
    def order_link(self, obj):
        """Buyurtma havolasi"""
        if obj.order:
            url = reverse('admin:api_order_change', args=[obj.order.id])
            return format_html('<a href="{}">Buyurtma #{}</a>', url, obj.order.id)
        return '-'
    order_link.short_description = 'Buyurtma'
    
    def uploaded_by_link(self, obj):
        """Yuklagan foydalanuvchi havolasi"""
        if obj.uploaded_by:
            url = reverse('admin:api_user_change', args=[obj.uploaded_by.id])
            return format_html('<a href="{}">{}</a>', url, obj.uploaded_by.phone)
        return '-'
    uploaded_by_link.short_description = 'Yuklagan'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('order', 'uploaded_by')


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    """
    Buyurtma holat tarixi uchun admin panel
    """
    list_display = ('id', 'order_link', 'status', 'created_by_link', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('comment', 'order__id', 'created_by__phone', 'created_by__first_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('order', 'status', 'comment', 'created_by')
        }),
        ('Sana', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ('created_at', 'order_link', 'created_by_link')
    
    def order_link(self, obj):
        """Buyurtma havolasi"""
        if obj.order:
            url = reverse('admin:api_order_change', args=[obj.order.id])
            return format_html('<a href="{}">Buyurtma #{}</a>', url, obj.order.id)
        return '-'
    order_link.short_description = 'Buyurtma'
    
    def created_by_link(self, obj):
        """Yaratgan foydalanuvchi havolasi"""
        if obj.created_by:
            url = reverse('admin:api_user_change', args=[obj.created_by.id])
            return format_html('<a href="{}">{}</a>', url, obj.created_by.phone)
        return '-'
    created_by_link.short_description = 'Yaratgan'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('order', 'created_by')
