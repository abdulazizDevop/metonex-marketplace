from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView  # Temporarily disabled
from api.urls import urlpatterns as api_urlpatterns

urlpatterns = [
    
    # API Documentation - Temporarily disabled due to serializer field errors
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API URLs
    path("", include(api_urlpatterns)),
]
