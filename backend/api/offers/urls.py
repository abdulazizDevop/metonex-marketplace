from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfferViewSet

router = DefaultRouter()
router.register(r'', OfferViewSet)

urlpatterns = [
    path('request/<uuid:request_id>/', OfferViewSet.as_view({'get': 'request'}), name='offer-request'),
    path('', include(router.urls)),
]
