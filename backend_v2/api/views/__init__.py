"""
MetOneX Backend v2 - Views Package
"""

from .auth_views import (
    SendSMSView,
    VerifySMSView,
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    UserProfileView,
    UserPasswordChangeView,
    UserPhoneVerificationView,
    TokenRefreshView,
    TokenBlacklistView
)

from .user_views import (
    UserViewSet,
    UserListView,
    UserDetailView
)

from .company_views import (
    CompanyViewSet,
    CompanyProfileView,
    CompanyListView,
    CompanyCreateView,
    CompanyUpdateView
)

from .catalog_views import (
    UnitViewSet,
    CategoryViewSet,
    SubCategoryViewSet,
    FactoryViewSet,
    CatalogMetaView
)

from .product_views import (
    ProductViewSet,
    ProductListView,
    ProductDetailView,
    ProductCreateView,
    ProductUpdateView,
    ProductSearchView,
    ProductAnalyticsView
)

from .rfq_views import (
    RFQViewSet,
    RFQListView,
    RFQDetailView,
    RFQCreateView,
    RFQUpdateView,
    RFQSearchView
)

from .offer_views import (
    OfferViewSet,
    OfferListView,
    OfferDetailView,
    OfferCreateView,
    OfferUpdateView,
    OfferAcceptView,
    OfferRejectView,
    CounterOfferViewSet,
    CounterOfferCreateView,
    CounterOfferAcceptView,
    CounterOfferRejectView,
    OfferSearchView
)

from .order_views import (
    OrderViewSet,
    OrderListView,
    OrderDetailView,
    OrderCreateView,
    OrderUpdateView,
    OrderStatusUpdateView,
    OrderDocumentViewSet,
    OrderStatusHistoryViewSet,
    OrderSearchView
)

from .payment_views import (
    PaymentViewSet,
    PaymentListView,
    PaymentDetailView,
    PaymentCreateView,
    PaymentConfirmView,
    PaymentReleaseView,
    PaymentRefundView,
    PaymentSearchView,
    PaymentAnalyticsView
)

from .notification_views import (
    NotificationViewSet,
    NotificationListView,
    NotificationDetailView,
    NotificationCreateView,
    NotificationMarkReadView,
    NotificationMarkUnreadView,
    NotificationBulkActionView,
    NotificationSettingsView,
    NotificationStatsView,
    NotificationSearchView
)

__all__ = [
    # Auth views
    'SendSMSView',
    'VerifySMSView',
    'UserRegistrationView',
    'UserLoginView',
    'UserLogoutView',
    'UserProfileView',
    'UserPasswordChangeView',
    'UserPhoneVerificationView',
    'TokenRefreshView',
    'TokenBlacklistView',
    
    # User views
    'UserViewSet',
    'UserListView',
    'UserDetailView',
    
    # Company views
    'CompanyViewSet',
    'CompanyProfileView',
    'CompanyListView',
    'CompanyCreateView',
    'CompanyUpdateView',
    
    # Catalog views
    'UnitViewSet',
    'CategoryViewSet',
    'SubCategoryViewSet',
    'FactoryViewSet',
    'CatalogMetaView',
    
    # Product views
    'ProductViewSet',
    'ProductListView',
    'ProductDetailView',
    'ProductCreateView',
    'ProductUpdateView',
    'ProductSearchView',
    'ProductAnalyticsView',
    
    # RFQ views
    'RFQViewSet',
    'RFQListView',
    'RFQDetailView',
    'RFQCreateView',
    'RFQUpdateView',
    'RFQSearchView',
    
    # Offer views
    'OfferViewSet',
    'OfferListView',
    'OfferDetailView',
    'OfferCreateView',
    'OfferUpdateView',
    'OfferAcceptView',
    'OfferRejectView',
    'CounterOfferViewSet',
    'CounterOfferCreateView',
    'CounterOfferAcceptView',
    'CounterOfferRejectView',
    'OfferSearchView',
    
    # Order views
    'OrderViewSet',
    'OrderListView',
    'OrderDetailView',
    'OrderCreateView',
    'OrderUpdateView',
    'OrderStatusUpdateView',
    'OrderDocumentViewSet',
    'OrderStatusHistoryViewSet',
    'OrderSearchView',
    
    # Payment views
    'PaymentViewSet',
    'PaymentListView',
    'PaymentDetailView',
    'PaymentCreateView',
    'PaymentConfirmView',
    'PaymentReleaseView',
    'PaymentRefundView',
    'PaymentSearchView',
    'PaymentAnalyticsView',
    
    # Notification views
    'NotificationViewSet',
    'NotificationListView',
    'NotificationDetailView',
    'NotificationCreateView',
    'NotificationMarkReadView',
    'NotificationMarkUnreadView',
    'NotificationBulkActionView',
    'NotificationSettingsView',
    'NotificationStatsView',
    'NotificationSearchView',
]
