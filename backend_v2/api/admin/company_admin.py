"""
Company Admin - Kompaniyalar uchun admin panel
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """
    Kompaniyalar uchun admin panel
    """
    list_display = (
        'name', 'user_link', 'inn_stir', 'is_verified', 
        'created_at', 'verification_status'
    )
    list_filter = ('is_verified', 'created_at')
    search_fields = ('name', 'inn_stir', 'user__phone', 'user__first_name', 'user__last_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('user', 'name', 'legal_address', 'inn_stir')
        }),
        ('Bank ma\'lumotlari', {
            'fields': ('bank_details',),
            'classes': ('collapse',)
        }),
        ('Boshqa ma\'lumotlar', {
            'fields': ('accountant_contact', 'telegram_owner'),
            'classes': ('collapse',)
        }),
        ('Tasdiqlash', {
            'fields': ('is_verified', 'verification_documents')
        }),
        ('Sana', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'user_link', 'verification_status')
    
    def user_link(self, obj):
        """Foydalanuvchi havolasi"""
        if obj.user:
            url = reverse('admin:api_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.phone)
        return '-'
    user_link.short_description = 'Foydalanuvchi'
    
    def verification_status(self, obj):
        """Tasdiqlash holati"""
        if obj.is_verified:
            return format_html('<span style="color: green;">✓ Tasdiqlangan</span>')
        else:
            return format_html('<span style="color: red;">✗ Tasdiqlanmagan</span>')
    verification_status.short_description = 'Tasdiqlash holati'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('user')
    
    def save_model(self, request, obj, form, change):
        """Model saqlash"""
        super().save_model(request, obj, form, change)
        
        # Agar kompaniya tasdiqlangan bo'lsa, foydalanuvchini ham faollashtirish
        if obj.is_verified and obj.user:
            obj.user.is_active = True
            obj.user.save()
