"""
Document Admin - Hujjatlar uchun Django admin interface
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.http import HttpResponse
import os

from ..models import Document, DocumentShare


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    """
    Hujjatlar uchun admin interface
    """
    list_display = [
        'id', 'title', 'document_type', 'user_info', 'status', 
        'file_info', 'file_size_display', 'source', 'created_at'
    ]
    list_filter = [
        'document_type', 'status', 'source', 'created_at', 
        'verified_at', 'expires_at'
    ]
    search_fields = [
        'title', 'description', 'file_name', 'user__first_name', 
        'user__last_name', 'user__phone'
    ]
    readonly_fields = [
        'id', 'file_name', 'file_size', 'content_type', 'file_extension',
        'is_image', 'is_pdf', 'human_readable_size', 'is_expired',
        'file_preview', 'created_at', 'updated_at'
    ]
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': (
                'id', 'user', 'order', 'company', 'document_type', 
                'title', 'description'
            )
        }),
        ('Fayl ma\'lumotlari', {
            'fields': (
                'file', 'file_preview', 'file_name', 'file_size', 
                'human_readable_size', 'content_type', 'file_extension',
                'is_image', 'is_pdf'
            )
        }),
        ('Status va verificatsiya', {
            'fields': (
                'status', 'source', 'verified_by', 'verified_at',
                'rejection_reason', 'expires_at', 'is_expired'
            )
        }),
        ('Didox Integration', {
            'fields': ('didox_document_id', 'didox_metadata'),
            'classes': ('collapse',)
        }),
        ('Qo\'shimcha ma\'lumotlar', {
            'fields': ('metadata',),
            'classes': ('collapse',)
        }),
        ('Vaqt belgilari', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Fikrlangan ordering
    ordering = ['-created_at']
    
    # Per page items
    list_per_page = 50
    
    # Actions
    actions = ['mark_as_verified', 'mark_as_rejected', 'download_selected']

    def user_info(self, obj):
        """Foydalanuvchi ma'lumotlari"""
        return format_html(
            '<strong>{}</strong><br><small>{}</small>',
            obj.user.get_full_name() or obj.user.username,
            obj.user.phone
        )
    user_info.short_description = 'Foydalanuvchi'

    def file_info(self, obj):
        """Fayl ma'lumotlari"""
        if obj.file:
            download_url = reverse('admin:download_document', args=[obj.pk])
            return format_html(
                '<a href="{}" target="_blank" class="button">📥 Yuklab olish</a><br>'
                '<small>{}</small>',
                download_url,
                obj.file_name
            )
        return '-'
    file_info.short_description = 'Fayl'

    def file_size_display(self, obj):
        """Fayl hajmi ko'rinishi"""
        return obj.human_readable_size
    file_size_display.short_description = 'Hajm'

    def file_preview(self, obj):
        """Fayl preview"""
        if not obj.file:
            return '-'
        
        if obj.is_image:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 200px;" />',
                obj.file.url
            )
        elif obj.is_pdf:
            return format_html(
                '<iframe src="{}" width="300" height="200"></iframe>',
                obj.file.url
            )
        else:
            return format_html(
                '<a href="{}" target="_blank">📄 {}</a>',
                obj.file.url,
                obj.file_name
            )
    file_preview.short_description = 'Preview'

    def mark_as_verified(self, request, queryset):
        """Belgilangan hujjatlarni tasdiqlash"""
        updated = 0
        for document in queryset:
            document.mark_as_verified(request.user)
            updated += 1
        
        self.message_user(
            request,
            f'{updated} ta hujjat tasdiqlandi.'
        )
    mark_as_verified.short_description = 'Belgilangan hujjatlarni tasdiqlash'

    def mark_as_rejected(self, request, queryset):
        """Belgilangan hujjatlarni rad etish"""
        updated = 0
        for document in queryset:
            document.mark_as_rejected(
                'Admin tomonidan rad etildi', 
                request.user
            )
            updated += 1
        
        self.message_user(
            request,
            f'{updated} ta hujjat rad etildi.'
        )
    mark_as_rejected.short_description = 'Belgilangan hujjatlarni rad etish'

    def download_selected(self, request, queryset):
        """Belgilangan hujjatlarni yuklab olish"""
        # Bu action faqat bitta hujjat uchun ishlaydi
        if queryset.count() != 1:
            self.message_user(
                request,
                'Faqat bitta hujjatni yuklab olish mumkin.',
                level='ERROR'
            )
            return
        
        document = queryset.first()
        if not document.file or not os.path.isfile(document.file.path):
            self.message_user(
                request,
                'Fayl topilmadi.',
                level='ERROR'
            )
            return
        
        with open(document.file.path, 'rb') as f:
            response = HttpResponse(
                f.read(),
                content_type=document.content_type
            )
            response['Content-Disposition'] = f'attachment; filename="{document.file_name}"'
            return response
    download_selected.short_description = 'Belgilangan hujjatni yuklab olish'

    def get_urls(self):
        """Custom URLs qo'shish"""
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:document_id>/download/',
                self.admin_site.admin_view(self.download_document),
                name='download_document',
            ),
        ]
        return custom_urls + urls

    def download_document(self, request, document_id):
        """Hujjatni yuklab olish"""
        try:
            document = Document.objects.get(pk=document_id)
            
            if not document.file or not os.path.isfile(document.file.path):
                self.message_user(
                    request,
                    'Fayl topilmadi.',
                    level='ERROR'
                )
                return self.response_redirect(request, f'../change/')
            
            with open(document.file.path, 'rb') as f:
                response = HttpResponse(
                    f.read(),
                    content_type=document.content_type
                )
                response['Content-Disposition'] = f'attachment; filename="{document.file_name}"'
                return response
                
        except Document.DoesNotExist:
            self.message_user(
                request,
                'Hujjat topilmadi.',
                level='ERROR'
            )
            return self.response_redirect(request, '../')


@admin.register(DocumentShare)
class DocumentShareAdmin(admin.ModelAdmin):
    """
    Hujjat ulashish uchun admin interface
    """
    list_display = [
        'id', 'document_info', 'shared_by_info', 'shared_with_info',
        'share_type', 'is_active', 'access_count', 'expires_at', 'created_at'
    ]
    list_filter = [
        'share_type', 'is_active', 'created_at', 'expires_at', 'accessed_at'
    ]
    search_fields = [
        'document__title', 'shared_by__first_name', 'shared_by__last_name',
        'shared_with__first_name', 'shared_with__last_name'
    ]
    readonly_fields = [
        'id', 'accessed_at', 'access_count', 'is_expired', 'created_at'
    ]
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': (
                'id', 'document', 'shared_by', 'shared_with', 'share_type'
            )
        }),
        ('Sozlamalar', {
            'fields': ('is_active', 'expires_at', 'is_expired')
        }),
        ('Statistika', {
            'fields': ('accessed_at', 'access_count', 'created_at')
        }),
    )
    
    ordering = ['-created_at']
    list_per_page = 30

    def document_info(self, obj):
        """Hujjat ma'lumotlari"""
        return format_html(
            '<strong>{}</strong><br><small>{}</small>',
            obj.document.title,
            obj.document.get_document_type_display()
        )
    document_info.short_description = 'Hujjat'

    def shared_by_info(self, obj):
        """Kim ulashgan"""
        return format_html(
            '<strong>{}</strong><br><small>{}</small>',
            obj.shared_by.get_full_name() or obj.shared_by.username,
            obj.shared_by.phone
        )
    shared_by_info.short_description = 'Kim ulashgan'

    def shared_with_info(self, obj):
        """Kim bilan ulashgan"""
        return format_html(
            '<strong>{}</strong><br><small>{}</small>',
            obj.shared_with.get_full_name() or obj.shared_with.username,
            obj.shared_with.phone
        )
    shared_with_info.short_description = 'Kim bilan ulashgan'
