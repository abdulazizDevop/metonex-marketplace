"""
Catalog URLs - Katalog ma'lumotlari uchun URL patterns (Unit, Category, SubCategory, Factory)
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.catalog_views import (
    UnitViewSet,
    CategoryViewSet,
    SubCategoryViewSet,
    FactoryViewSet,
    CatalogMetaView
)


# Catalog routers
unit_router = DefaultRouter()
unit_router.register(r'units', UnitViewSet, basename='unit')

category_router = DefaultRouter()
category_router.register(r'categories', CategoryViewSet, basename='category')

subcategory_router = DefaultRouter()
subcategory_router.register(r'subcategories', SubCategoryViewSet, basename='subcategory')

factory_router = DefaultRouter()
factory_router.register(r'factories', FactoryViewSet, basename='factory')

catalog_urlpatterns = [
    # Router URLs
    path('', include(unit_router.urls)),
    path('', include(category_router.urls)),
    path('', include(subcategory_router.urls)),
    path('', include(factory_router.urls)),
    
    # Meta information
    path('meta/', CatalogMetaView.as_view(), name='catalog-meta'),
    
    # Category endpoints
    path('categories/<int:pk>/with-subcategories/', CategoryViewSet.as_view({'get': 'with_subcategories'}), name='category-with-subcategories'),
    path('categories/<int:pk>/available-units/', CategoryViewSet.as_view({'get': 'available_units'}), name='category-available-units'),
    path('categories/<int:pk>/default-unit/', CategoryViewSet.as_view({'get': 'default_unit'}), name='category-default-unit'),
    path('categories/with-subcategories-all/', CategoryViewSet.as_view({'get': 'with_subcategories_all'}), name='categories-with-subcategories-all'),
    
    # SubCategory endpoints
    path('subcategories/<int:pk>/available-units/', SubCategoryViewSet.as_view({'get': 'available_units'}), name='subcategory-available-units'),
    path('subcategories/<int:pk>/default-unit/', SubCategoryViewSet.as_view({'get': 'default_unit'}), name='subcategory-default-unit'),
    path('subcategories/by-category/', SubCategoryViewSet.as_view({'get': 'by_category'}), name='subcategories-by-category'),
    
    # Factory endpoints
    path('factories/<int:pk>/dealers/', FactoryViewSet.as_view({'get': 'dealers'}), name='factory-dealers'),
]
