from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.contrib.admin import AdminSite
from django.template.response import TemplateResponse
from .models import *

class MetOneXAdminSite(AdminSite):
    site_header = "MetOneX Marketplace Admin"
    site_title = "MetOneX Admin"
    index_title = "MetOneX Marketplace Boshqaruv Paneli"
    
    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['custom_css'] = 'admin/css/custom_admin.css'
        extra_context['custom_js'] = 'admin/js/custom_admin.js'
        
        # Dashboard statistikalar
        try:
            extra_context['user_count'] = User.objects.count()
            extra_context['company_count'] = Company.objects.count()
            extra_context['item_count'] = Item.objects.count()
            extra_context['order_count'] = Order.objects.count()
            extra_context['request_count'] = Request.objects.count()
            extra_context['offer_count'] = Offer.objects.count()
            extra_context['notification_count'] = Notification.objects.count()
            extra_context['rating_count'] = Rating.objects.count()
        except Exception as e:
            print(f"Dashboard stats error: {e}")
            extra_context['user_count'] = 0
            extra_context['company_count'] = 0
            extra_context['item_count'] = 0
            extra_context['order_count'] = 0
            extra_context['request_count'] = 0
            extra_context['offer_count'] = 0
            extra_context['notification_count'] = 0
            extra_context['rating_count'] = 0
            
        return super().index(request, extra_context)

# Custom admin site
admin_site = MetOneXAdminSite(name='metonex_admin')

# admin_site.register o'rniga @admin.register ishlatamiz site parametri bilan
@admin.register(User, site=admin_site)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'phone', 'name', 'type', 'verified', 'created_at', 'user_actions']
    list_filter = ['verified', 'created_at', 'type']
    search_fields = ['phone', 'name']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def user_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_user_change', args=[obj.pk])
        )
    user_actions.short_description = 'Amallar'

@admin.register(Company, site=admin_site)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type', 'verified', 'created_at', 'company_actions']
    list_filter = ['verified', 'created_at', 'type']
    search_fields = ['name', 'inn']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def company_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_company_change', args=[obj.pk])
        )
    company_actions.short_description = 'Amallar'


@admin.register(Item, site=admin_site)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'company', 'price', 'status', 'created_at', 'item_actions']
    list_filter = ['status', 'created_at', 'subcategory']
    search_fields = ['name', 'company__name']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def item_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_item_change', args=[obj.pk])
        )
    item_actions.short_description = 'Amallar'


@admin.register(Request, site=admin_site)
class RequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'buyer_company', 'category', 'status', 'budget_from', 'budget_to', 'created_at', 'request_actions']
    list_filter = ['status', 'created_at', 'category']
    search_fields = ['buyer_company__name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def request_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_request_change', args=[obj.pk])
        )
    request_actions.short_description = 'Amallar'


@admin.register(Order, site=admin_site)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'request', 'offer', 'status', 'total_amount', 'created_at', 'order_actions']
    list_filter = ['status', 'created_at']
    search_fields = ['request__buyer_company__name', 'offer__supplier_company__name']
    readonly_fields = ['created_at']
    list_per_page = 20
    
    def order_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_order_change', args=[obj.pk])
        )
    order_actions.short_description = 'Amallar'


@admin.register(Notification, site=admin_site)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipient_user', 'type', 'message', 'read_at', 'created_at', 'notification_actions']
    list_filter = ['type', 'read_at', 'created_at']
    search_fields = ['message', 'recipient_user__phone']
    readonly_fields = ['created_at']
    list_per_page = 20
    
    def notification_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_notification_change', args=[obj.pk])
        )
    notification_actions.short_description = 'Amallar'


@admin.register(Rating, site=admin_site)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['id', 'rater_company', 'rated_company', 'overall_score', 'created_at', 'rating_actions']
    list_filter = ['overall_score', 'created_at']
    search_fields = ['rater_company__name', 'rated_company__name']
    readonly_fields = ['created_at']
    list_per_page = 20
    
    def rating_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_rating_change', args=[obj.pk])
        )
    rating_actions.short_description = 'Amallar'


@admin.register(Category, site=admin_site)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_at', 'category_actions']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def category_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_category_change', args=[obj.pk])
        )
    category_actions.short_description = 'Amallar'


@admin.register(SubCategory, site=admin_site)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'unit', 'created_at', 'subcategory_actions']
    list_filter = ['category', 'unit']
    search_fields = ['name', 'category__name']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def subcategory_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_subcategory_change', args=[obj.pk])
        )
    subcategory_actions.short_description = 'Amallar'


@admin.register(Razmer, site=admin_site)
class RazmerAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'subcategory', 'created_at', 'razmer_actions']
    list_filter = ['category', 'subcategory']
    search_fields = ['name', 'category__name', 'subcategory__name']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def razmer_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Ko\'rish</a>',
            reverse('metonex_admin:api_razmer_change', args=[obj.pk])
        )
    razmer_actions.short_description = 'Amallar'


# Qolgan modellar uchun oddiy registratsiya
admin_site.register(CompanyMember, site=admin_site)
admin_site.register(VerificationCode, site=admin_site)
admin_site.register(ItemImage, site=admin_site)
admin_site.register(CompanyCertificate, site=admin_site)
admin_site.register(ItemDeletionReason, site=admin_site)
admin_site.register(Offer, site=admin_site)
