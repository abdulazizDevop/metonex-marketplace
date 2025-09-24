"""
Product views - Mahsulotlar uchun views
"""

from django.db.models import Q, Count, Avg
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from ..models import Product, User, Category, SubCategory, Unit, Factory
from ..serializers import (
    ProductSerializer,
    ProductListSerializer,
    ProductCreateSerializer,
    ProductUpdateSerializer,
    ProductSearchSerializer,
    ProductAnalyticsSerializer
)


class ProductViewSet(viewsets.ModelViewSet):
    """
    Mahsulotlar uchun ViewSet
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['supplier', 'category', 'factory', 'is_active', 'is_featured']
    search_fields = ['brand', 'grade', 'material', 'origin_country']
    ordering_fields = ['created_at', 'base_price', 'rating', 'view_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Product.objects.select_related(
            'supplier', 'category', 'unit', 'factory'
        ).prefetch_related('supplier__company')
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return ProductListSerializer
        elif self.action == 'create':
            return ProductCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProductUpdateSerializer
        return ProductSerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'search', 'analytics']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Mahsulot yaratish"""
        serializer.save(supplier=self.request.user)
    
    def perform_update(self, serializer):
        """Mahsulot yangilash"""
        # Faqat mahsulot egasi yangilay oladi
        if serializer.instance.supplier != self.request.user:
            raise permissions.PermissionDenied("Siz bu mahsulotni yangilay olmaysiz")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Mahsulot o'chirish"""
        # Faqat mahsulot egasi o'chira oladi
        if instance.supplier != self.request.user:
            raise permissions.PermissionDenied("Siz bu mahsulotni o'chira olmaysiz")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """Joriy foydalanuvchi mahsulotlari"""
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar mahsulotga ega'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        products = self.get_queryset().filter(supplier=request.user)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Taniqli mahsulotlar"""
        products = self.get_queryset().filter(is_featured=True, is_active=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Kategoriya bo'yicha mahsulotlar"""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response({'error': 'category_id parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        products = self.get_queryset().filter(category_id=category_id, is_active=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_supplier(self, request):
        """Sotuvchi bo'yicha mahsulotlar"""
        supplier_id = request.query_params.get('supplier_id')
        if not supplier_id:
            return Response({'error': 'supplier_id parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        products = self.get_queryset().filter(supplier_id=supplier_id, is_active=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Mahsulot qidirish"""
        serializer = ProductSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(is_active=True)
        filters = serializer.validated_data
        
        # Kategoriya bo'yicha filter
        if filters.get('category_id'):
            queryset = queryset.filter(category_id=filters['category_id'])
        
        # Sub-kategoriya bo'yicha filter
        if filters.get('subcategory_id'):
            queryset = queryset.filter(category__subcategories__id=filters['subcategory_id'])
        
        # Brend bo'yicha filter
        if filters.get('brand'):
            queryset = queryset.filter(brand__icontains=filters['brand'])
        
        # Marka bo'yicha filter
        if filters.get('grade'):
            queryset = queryset.filter(grade__icontains=filters['grade'])
        
        # Narx bo'yicha filter
        if filters.get('min_price'):
            queryset = queryset.filter(base_price__gte=filters['min_price'])
        if filters.get('max_price'):
            queryset = queryset.filter(base_price__lte=filters['max_price'])
        
        # Sotuvchi turi bo'yicha filter
        if filters.get('supplier_type'):
            queryset = queryset.filter(supplier__supplier_type=filters['supplier_type'])
        
        # Taniqli mahsulotlar
        if filters.get('is_featured') is not None:
            queryset = queryset.filter(is_featured=filters['is_featured'])
        
        # Qidiruv matni
        if filters.get('search'):
            search_term = filters['search']
            queryset = queryset.filter(
                Q(brand__icontains=search_term) |
                Q(grade__icontains=search_term) |
                Q(material__icontains=search_term) |
                Q(origin_country__icontains=search_term)
            )
        
        serializer = ProductListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Ko'rishlar sonini oshirish"""
        product = self.get_object()
        product.view_count += 1
        product.save(update_fields=['view_count'])
        return Response({'message': 'Ko\'rishlar soni oshirildi'})
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Mahsulotlar analytics"""
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar analytics ko\'ra oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        products = self.get_queryset().filter(supplier=request.user)
        serializer = ProductAnalyticsSerializer(products, many=True)
        return Response(serializer.data)


class ProductListView(viewsets.ReadOnlyModelViewSet):
    """
    Mahsulotlar ro'yxati uchun ViewSet
    """
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['supplier', 'category', 'factory', 'is_active', 'is_featured']
    search_fields = ['brand', 'grade', 'material']
    ordering_fields = ['created_at', 'base_price', 'rating']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Product.objects.select_related(
            'supplier', 'category', 'unit'
        ).filter(is_active=True)


class ProductDetailView(viewsets.ReadOnlyModelViewSet):
    """
    Mahsulot batafsil ma'lumotlari uchun ViewSet
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Product.objects.select_related(
            'supplier', 'category', 'unit', 'factory'
        ).prefetch_related(
            'supplier__company',
            'offers'
        )


class ProductCreateView(APIView):
    """
    Mahsulot yaratish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Mahsulot yaratish"""
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar mahsulot yarata oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProductCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            product = serializer.save()
            response_serializer = ProductSerializer(product)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductUpdateView(APIView):
    """
    Mahsulot yangilash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, pk):
        """Mahsulot yangilash"""
        try:
            product = Product.objects.get(pk=pk, supplier=request.user)
            serializer = ProductUpdateSerializer(
                product, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                response_serializer = ProductSerializer(product)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({'error': 'Mahsulot topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class ProductSearchView(APIView):
    """
    Mahsulot qidirish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Mahsulot qidirish"""
        serializer = ProductSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = Product.objects.select_related(
            'supplier', 'category', 'unit'
        ).filter(is_active=True)
        
        filters = serializer.validated_data
        
        # Filterlar
        if filters.get('category_id'):
            queryset = queryset.filter(category_id=filters['category_id'])
        if filters.get('subcategory_id'):
            queryset = queryset.filter(category__subcategories__id=filters['subcategory_id'])
        if filters.get('brand'):
            queryset = queryset.filter(brand__icontains=filters['brand'])
        if filters.get('grade'):
            queryset = queryset.filter(grade__icontains=filters['grade'])
        if filters.get('min_price'):
            queryset = queryset.filter(base_price__gte=filters['min_price'])
        if filters.get('max_price'):
            queryset = queryset.filter(base_price__lte=filters['max_price'])
        if filters.get('supplier_type'):
            queryset = queryset.filter(supplier__supplier_type=filters['supplier_type'])
        if filters.get('is_featured') is not None:
            queryset = queryset.filter(is_featured=filters['is_featured'])
        
        # Qidiruv matni
        if filters.get('search'):
            search_term = filters['search']
            queryset = queryset.filter(
                Q(brand__icontains=search_term) |
                Q(grade__icontains=search_term) |
                Q(material__icontains=search_term) |
                Q(origin_country__icontains=search_term)
            )
        
        serializer = ProductListSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductAnalyticsView(APIView):
    """
    Mahsulot analytics uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Mahsulot analytics"""
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar analytics ko\'ra oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        products = Product.objects.filter(supplier=request.user).select_related(
            'supplier', 'category'
        )
        
        serializer = ProductAnalyticsSerializer(products, many=True)
        return Response(serializer.data)
