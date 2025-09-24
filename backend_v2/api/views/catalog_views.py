"""
Catalog views - Katalog ma'lumotlari uchun views (Unit, Category, SubCategory, Factory)
"""

from django.db.models import Q, Count
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

from ..models import Unit, Category, SubCategory, Factory
from ..serializers import (
    UnitSerializer,
    UnitListSerializer,
    CategorySerializer,
    CategoryListSerializer,
    CategoryWithSubcategoriesSerializer,
    SubCategorySerializer,
    SubCategoryListSerializer,
    SubCategoryCreateSerializer,
    FactorySerializer,
    FactoryListSerializer,
    FactoryCreateSerializer,
    CatalogMetaSerializer
)


class UnitViewSet(viewsets.ModelViewSet):
    """
    O'lchov birliklari uchun ViewSet
    """
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['unit_type', 'is_active']
    search_fields = ['name', 'symbol']
    ordering_fields = ['name', 'unit_type', 'created_at']
    ordering = ['unit_type', 'name']
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return UnitListSerializer
        return UnitSerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Birlik turi bo'yicha birliklarni olish"""
        unit_type = request.query_params.get('unit_type')
        if not unit_type:
            return Response({'error': 'unit_type parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        units = Unit.objects.filter(unit_type=unit_type, is_active=True)
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def weight_units(self, request):
        """Og'irlik birliklari"""
        units = Unit.get_weight_units()
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def volume_units(self, request):
        """Hajm birliklari"""
        units = Unit.get_volume_units()
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def piece_units(self, request):
        """Dona birliklari"""
        units = Unit.get_piece_units()
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def length_units(self, request):
        """Uzunlik birliklari"""
        units = Unit.get_length_units()
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def area_units(self, request):
        """Maydon birliklari"""
        units = Unit.get_area_units()
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Kategoriyalar uchun ViewSet
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['unit_type', 'is_active']
    search_fields = ['name', 'slug']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return CategoryListSerializer
        elif self.action == 'with_subcategories':
            return CategoryWithSubcategoriesSerializer
        return CategorySerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'with_subcategories', 'available_units']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['get'])
    def with_subcategories(self, request, pk=None):
        """Kategoriya va sub-kategoriyalar bilan"""
        category = self.get_object()
        serializer = CategoryWithSubcategoriesSerializer(category)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def available_units(self, request, pk=None):
        """Kategoriya uchun mavjud birliklar"""
        category = self.get_object()
        units = category.get_available_units()
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def default_unit(self, request, pk=None):
        """Kategoriya uchun standart birlik"""
        category = self.get_object()
        default_unit = category.get_default_unit()
        if default_unit:
            serializer = UnitListSerializer(default_unit)
            return Response(serializer.data)
        return Response({'error': 'Standart birlik topilmadi'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def with_subcategories_all(self, request):
        """Barcha kategoriyalar sub-kategoriyalar bilan"""
        categories = self.get_queryset().filter(is_active=True)
        serializer = CategoryWithSubcategoriesSerializer(categories, many=True)
        return Response(serializer.data)


class SubCategoryViewSet(viewsets.ModelViewSet):
    """
    Sub-kategoriyalar uchun ViewSet
    """
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'slug']
    ordering_fields = ['name', 'created_at']
    ordering = ['category', 'name']
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return SubCategoryListSerializer
        elif self.action == 'create':
            return SubCategoryCreateSerializer
        return SubCategorySerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'available_units', 'default_unit']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['get'])
    def available_units(self, request, pk=None):
        """Sub-kategoriya uchun mavjud birliklar"""
        subcategory = self.get_object()
        units = subcategory.get_available_units()
        serializer = UnitListSerializer(units, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def default_unit(self, request, pk=None):
        """Sub-kategoriya uchun standart birlik"""
        subcategory = self.get_object()
        default_unit = subcategory.get_default_unit()
        if default_unit:
            serializer = UnitListSerializer(default_unit)
            return Response(serializer.data)
        return Response({'error': 'Standart birlik topilmadi'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Kategoriya bo'yicha sub-kategoriyalar"""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response({'error': 'category_id parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        subcategories = SubCategory.objects.filter(
            category_id=category_id, 
            is_active=True
        )
        serializer = SubCategoryListSerializer(subcategories, many=True)
        return Response(serializer.data)


class FactoryViewSet(viewsets.ModelViewSet):
    """
    Zavodlar uchun ViewSet
    """
    queryset = Factory.objects.all()
    serializer_class = FactorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return FactoryListSerializer
        elif self.action == 'create':
            return FactoryCreateSerializer
        return FactorySerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['get'])
    def dealers(self, request, pk=None):
        """Zavod dilerlari"""
        factory = self.get_object()
        dealers = factory.dealers.all()
        from ..serializers import UserListSerializer
        serializer = UserListSerializer(dealers, many=True)
        return Response(serializer.data)


class CatalogMetaView(APIView):
    """
    Katalog meta ma'lumotlari uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CatalogMetaSerializer
    
    def get(self, request):
        """Katalog meta ma'lumotlari"""
        serializer = CatalogMetaSerializer({})
        return Response(serializer.data)
