from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RatingViewSet


router = DefaultRouter()
router.register(r"", RatingViewSet, basename="rating")


urlpatterns = [
    path("company/<uuid:company_id>/", RatingViewSet.as_view({'get': 'company'}), name='rating-company'),
    path("order/<uuid:order_id>/", RatingViewSet.as_view({'get': 'order'}), name='rating-order'),
    path("", include(router.urls)),
]
