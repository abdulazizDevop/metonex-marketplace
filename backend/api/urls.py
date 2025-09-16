from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse


def ping(_):
    return JsonResponse({"api": "ok"})


urlpatterns = [
    path("ping/", ping),
    path("auth/jwt/create/", TokenObtainPairView.as_view(), name="jwt_create"),
    path("auth/jwt/refresh/", TokenRefreshView.as_view(), name="jwt_refresh"),
    path("auth/", include("api.auth.urls")),
    path("companies/", include("api.companies.urls")),
    path("items/", include("api.items.urls")),
    path("requests/", include("api.requests.urls")),
    path("offers/", include("api.offers.urls")),
    path("orders/", include("api.orders.urls")),
    path("ratings/", include("api.ratings.urls")),
    path("notifications/", include("api.notifications.urls")),
]
