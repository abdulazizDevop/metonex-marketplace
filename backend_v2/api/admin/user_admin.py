"""
User Admin - Foydalanuvchilar uchun admin panel
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import User, VerificationCode, UserSession


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Foydalanuvchilar uchun admin panel
    """
    list_display = (
        'phone', 'first_name', 'last_name', 'role', 'supplier_type', 
        'phone_verified', 'is_active', 'created_at', 'company_link'
    )
    list_filter = ('role', 'supplier_type', 'phone_verified', 'is_active', 'created_at')
    search_fields = ('phone', 'first_name', 'last_name', 'username')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'avatar', 'device_token')}),
        ('Role & Type', {'fields': ('role', 'supplier_type')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
        ('Verification', {'fields': ('phone_verified',)}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone', 'first_name', 'last_name', 'role', 'supplier_type', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'date_joined', 'company_link')
    
    def company_link(self, obj):
        """Kompaniya havolasi"""
        if hasattr(obj, 'company'):
            url = reverse('admin:api_company_change', args=[obj.company.id])
            return format_html('<a href="{}">{}</a>', url, obj.company.name)
        return '-'
    company_link.short_description = 'Kompaniya'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('company')


@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    """
    SMS kodlari uchun admin panel
    """
    list_display = ('phone', 'code', 'created_at', 'expires_at', 'used_at', 'attempts', 'is_expired')
    list_filter = ('used_at', 'created_at', 'expires_at')
    search_fields = ('phone', 'code')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'is_expired')
    
    def is_expired(self, obj):
        """Kod muddati o'tganmi"""
        from django.utils import timezone
        return obj.expires_at < timezone.now()
    is_expired.boolean = True
    is_expired.short_description = 'Muddati o\'tgan'


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """
    Foydalanuvchi sessiyalari uchun admin panel
    """
    list_display = ('user', 'ip_address', 'is_active', 'created_at', 'last_activity', 'duration')
    list_filter = ('is_active', 'created_at', 'last_activity')
    search_fields = ('user__phone', 'user__first_name', 'user__last_name', 'ip_address')
    ordering = ('-last_activity',)
    readonly_fields = ('created_at', 'last_activity', 'duration')
    
    def duration(self, obj):
        """Sessiya davomiyligi"""
        if obj.last_activity and obj.created_at:
            duration = obj.last_activity - obj.created_at
            hours, remainder = divmod(duration.total_seconds(), 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"{int(hours)}h {int(minutes)}m {int(seconds)}s"
        return '-'
    duration.short_description = 'Davomiyligi'
    
    def get_queryset(self, request):
        """Queryset optimizatsiyasi"""
        return super().get_queryset(request).select_related('user')
