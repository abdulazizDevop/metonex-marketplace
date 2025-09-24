"""
Product URLs - Mahsulotlar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.product_views import (
    ProductViewSet,
    ProductListView,
    ProductDetailView,
    ProductCreateView,
    ProductUpdateView,
    ProductSearchView,
    ProductAnalyticsView
)


# Product router
product_router = DefaultRouter()
product_router.register(r'', ProductViewSet, basename='product')

product_urlpatterns = [
    # Router URLs
    path('', include(product_router.urls)),
    
    # Additional product endpoints
    path('list/', ProductListView.as_view({'get': 'list'}), name='product-list'),
    path('<int:pk>/detail/', ProductDetailView.as_view({'get': 'retrieve'}), name='product-detail'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('<int:pk>/update/', ProductUpdateView.as_view(), name='product-update'),
    
    # Product search and analytics
    path('search/', ProductSearchView.as_view(), name='product-search'),
    path('analytics/', ProductAnalyticsView.as_view(), name='product-analytics'),
    
    # Custom product actions
    path('my-products/', ProductViewSet.as_view({'get': 'my_products'}), name='product-my'),
    path('featured/', ProductViewSet.as_view({'get': 'featured'}), name='product-featured'),
    path('by-category/', ProductViewSet.as_view({'get': 'by_category'}), name='product-by-category'),
    path('by-supplier/', ProductViewSet.as_view({'get': 'by_supplier'}), name='product-by-supplier'),
    path('<int:pk>/increment-view/', ProductViewSet.as_view({'post': 'increment_view'}), name='product-increment-view'),
]
