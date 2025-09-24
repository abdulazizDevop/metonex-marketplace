"""
Authentication URLs - Autentifikatsiya uchun URL patterns
"""

from django.urls import path
from ..views.auth_views import (
    SendSMSView,
    VerifySMSView,
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    UserProfileView,
    UserPasswordChangeView,
    SendPasswordChangeCodeView,
    UserPhoneVerificationView,
    TokenRefreshView,
    TokenBlacklistView
)


auth_urlpatterns = [
    # SMS verification
    path('send-sms/', SendSMSView.as_view(), name='send-sms'),
    path('verify-sms/', VerifySMSView.as_view(), name='verify-sms'),
    
    # User registration and login
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    
    # User profile
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', UserPasswordChangeView.as_view(), name='change-password'),
    path('send-password-change-code/', SendPasswordChangeCodeView.as_view(), name='send-password-change-code'),
    path('verify-phone/', UserPhoneVerificationView.as_view(), name='verify-phone'),
    
    # JWT token management
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token-blacklist'),
]
