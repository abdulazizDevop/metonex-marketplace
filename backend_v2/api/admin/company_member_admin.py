"""
Company Member Admin - Kompaniya a'zolari uchun admin panel
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse

from ..models import CompanyMember


@admin.register(CompanyMember)
class CompanyMemberAdmin(admin.ModelAdmin):
    """
    Kompaniya a'zolari uchun admin panel
    """
    list_display = (
        'name', 'company_link', 'role', 'phone', 'telegram_username', 
        'is_active', 'joined_at'
    )
    list_filter = ('role', 'is_active', 'joined_at', 'company')
    search_fields = ('name', 'phone', 'telegram_username', 'email', 'company__name')
    ordering = ('-joined_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('company', 'user', 'name', 'role')
        }),
        ('Aloqa ma\'lumotlari', {
            'fields': ('phone', 'telegram_username', 'email')
        }),
        ('Holat', {
            'fields': ('is_active',)
        }),
        ('Sana', {
            'fields': ('joined_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('joined_at', 'updated_at', 'company_link')
    
    def company_link(self, obj):
        """Kompaniya havolasi"""
        if obj.company:
            url = reverse('admin:api_company_change', args=[obj.company.id])
            return format_html('<a href="{}">{}</a>', url, obj.company.name)
        return '-'
    company_link.short_description = 'Kompaniya'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('company', 'user')
    
    def save_model(self, request, obj, form, change):
        """Model saqlash"""
        super().save_model(request, obj, form, change)
        
        # Agar a'zo faol bo'lsa va user bog'langan bo'lsa, user ni ham faollashtirish
        if obj.is_active and obj.user:
            obj.user.is_active = True
            obj.user.save()
