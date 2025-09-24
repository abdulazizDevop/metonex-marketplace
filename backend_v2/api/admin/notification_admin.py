"""
Notification Admin - Xabarnomalar uchun admin panel
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """
    Xabarnomalar uchun admin panel
    """
    list_display = (
        'id', 'user_link', 'title', 'type', 'read_at', 
        'delivery_method', 'sent_at', 'created_at'
    )
    list_filter = ('type', 'delivery_method', 'sent_at', 'created_at')
    search_fields = (
        'title', 'message', 'user__phone', 'user__first_name', 
        'user__last_name', 'related_type'
    )
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('user', 'title', 'message', 'type')
        }),
        ('Bog\'liq ma\'lumotlar', {
            'fields': ('related_id', 'related_type'),
            'classes': ('collapse',)
        }),
        ('Yuborish', {
            'fields': ('delivery_method', 'read_at', 'sent_at')
        }),
        ('Sana', {
            'fields': ('created_at',)
        }),
    )
    
    readonly_fields = ('created_at', 'user_link')
    
    def user_link(self, obj):
        """Foydalanuvchi havolasi"""
        if obj.user:
            url = reverse('admin:api_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.phone)
        return '-'
    user_link.short_description = 'Foydalanuvchi'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('user')
    
    def save_model(self, request, obj, form, change):
        """Model saqlash"""
        super().save_model(request, obj, form, change)
        
        # Agar xabarnoma yuborilgan bo'lsa, sent_at ni yangilash
        if obj.sent_at is None and obj.read_at:
            from django.utils import timezone
            obj.sent_at = timezone.now()
            obj.save()
