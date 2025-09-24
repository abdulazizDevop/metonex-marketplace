"""
MetOneX Backend v2 - Admin Package
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from ..models import (
    User, VerificationCode, UserSession, Company, Unit, Category, SubCategory, 
    Factory, Product, RFQ, Offer, CounterOffer, Order, OrderDocument, 
    OrderStatusHistory, Payment, Notification
)

# Custom Admin Site
class MetOneXAdminSite(admin.AdminSite):
    site_header = "MetOneX Admin Panel"
    site_title = "MetOneX Admin"
    index_title = "MetOneX B2B Platform Administration"

admin_site = MetOneXAdminSite(name='metonex_admin')

# Import all admin classes
from .user_admin import UserAdmin, VerificationCodeAdmin, UserSessionAdmin
from .company_admin import CompanyAdmin
from .catalog_admin import UnitAdmin, CategoryAdmin, SubCategoryAdmin, FactoryAdmin
from .product_admin import ProductAdmin
from .rfq_admin import RFQAdmin
from .offer_admin import OfferAdmin, CounterOfferAdmin
from .order_admin import OrderAdmin, OrderDocumentAdmin, OrderStatusHistoryAdmin
from .payment_admin import PaymentAdmin
from .notification_admin import NotificationAdmin

# Register all models
admin_site.register(User, UserAdmin)
admin_site.register(VerificationCode, VerificationCodeAdmin)
admin_site.register(UserSession, UserSessionAdmin)
admin_site.register(Company, CompanyAdmin)
admin_site.register(Unit, UnitAdmin)
admin_site.register(Category, CategoryAdmin)
admin_site.register(SubCategory, SubCategoryAdmin)
admin_site.register(Factory, FactoryAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(RFQ, RFQAdmin)
admin_site.register(Offer, OfferAdmin)
admin_site.register(CounterOffer, CounterOfferAdmin)
admin_site.register(Order, OrderAdmin)
admin_site.register(OrderDocument, OrderDocumentAdmin)
admin_site.register(OrderStatusHistory, OrderStatusHistoryAdmin)
admin_site.register(Payment, PaymentAdmin)
admin_site.register(Notification, NotificationAdmin)

__all__ = [
    'admin_site',
    'UserAdmin',
    'VerificationCodeAdmin',
    'UserSessionAdmin',
    'CompanyAdmin',
    'UnitAdmin',
    'CategoryAdmin',
    'SubCategoryAdmin',
    'FactoryAdmin',
    'ProductAdmin',
    'RFQAdmin',
    'OfferAdmin',
    'CounterOfferAdmin',
    'OrderAdmin',
    'OrderDocumentAdmin',
    'OrderStatusHistoryAdmin',
    'PaymentAdmin',
    'NotificationAdmin',
]
