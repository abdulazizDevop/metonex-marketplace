"""
User views - Foydalanuvchilar uchun views
"""

from django.db.models import Q
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from ..models import User
from ..serializers import (
    UserSerializer,
    UserListSerializer,
    UserProfileSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    Foydalanuvchilar uchun ViewSet
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'supplier_type', 'is_active']
    search_fields = ['first_name', 'last_name', 'phone']
    ordering_fields = ['created_at', 'last_login']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return User.objects.select_related('company').prefetch_related(
            'supplier_categories__category',
            'dealer_factories__factory'
        )
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return UserListSerializer
        return UserSerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Joriy foydalanuvchi ma'lumotlari"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def suppliers(self, request):
        """Sotuvchilar ro'yxati"""
        suppliers = self.get_queryset().filter(role=User.UserRole.SUPPLIER)
        serializer = UserListSerializer(suppliers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def buyers(self, request):
        """Sotib oluvchilar ro'yxati"""
        buyers = self.get_queryset().filter(role=User.UserRole.BUYER)
        serializer = UserListSerializer(buyers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def manufacturers(self, request):
        """Ishlab chiqaruvchilar ro'yxati"""
        manufacturers = self.get_queryset().filter(
            role=User.UserRole.SUPPLIER,
            supplier_type=User.SupplierType.MANUFACTURER
        )
        serializer = UserListSerializer(manufacturers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def dealers(self, request):
        """Dilerlar ro'yxati"""
        dealers = self.get_queryset().filter(
            role=User.UserRole.SUPPLIER,
            supplier_type=User.SupplierType.DEALER
        )
        serializer = UserListSerializer(dealers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Foydalanuvchini faollashtirish"""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'message': 'Foydalanuvchi faollashtirildi'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Foydalanuvchini deaktivlashtirish"""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'message': 'Foydalanuvchi deaktivlashtirildi'})


class UserListView(viewsets.ReadOnlyModelViewSet):
    """
    Foydalanuvchilar ro'yxati uchun ViewSet
    """
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'supplier_type', 'is_active']
    search_fields = ['first_name', 'last_name', 'phone']
    ordering_fields = ['created_at', 'last_login']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return User.objects.select_related('company')


class UserDetailView(viewsets.ReadOnlyModelViewSet):
    """
    Foydalanuvchi batafsil ma'lumotlari uchun ViewSet
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return User.objects.select_related('company').prefetch_related(
            'supplier_categories__category',
            'dealer_factories__factory',
            'products',
            'rfqs',
            'offers',
            'buyer_orders',
            'supplier_orders'
        )
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Foydalanuvchi mahsulotlari"""
        user = self.get_object()
        if user.role == User.UserRole.SUPPLIER:
            products = user.products.filter(is_active=True)
            from ..serializers import ProductListSerializer
            serializer = ProductListSerializer(products, many=True)
            return Response(serializer.data)
        return Response({'error': 'Faqat sotuvchilar mahsulotga ega'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def rfqs(self, request, pk=None):
        """Foydalanuvchi RFQ lari"""
        user = self.get_object()
        if user.role == User.UserRole.BUYER:
            rfqs = user.rfqs.all()
            from ..serializers import RFQListSerializer
            serializer = RFQListSerializer(rfqs, many=True)
            return Response(serializer.data)
        return Response({'error': 'Faqat sotib oluvchilar RFQ yarata oladi'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def offers(self, request, pk=None):
        """Foydalanuvchi takliflari"""
        user = self.get_object()
        if user.role == User.UserRole.SUPPLIER:
            offers = user.offers.all()
            from ..serializers import OfferListSerializer
            serializer = OfferListSerializer(offers, many=True)
            return Response(serializer.data)
        return Response({'error': 'Faqat sotuvchilar taklif yarata oladi'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        """Foydalanuvchi buyurtmalari"""
        user = self.get_object()
        buyer_orders = user.buyer_orders.all()
        supplier_orders = user.supplier_orders.all()
        
        from ..serializers import OrderListSerializer
        
        return Response({
            'buyer_orders': OrderListSerializer(buyer_orders, many=True).data,
            'supplier_orders': OrderListSerializer(supplier_orders, many=True).data
        })
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Foydalanuvchi statistikasi"""
        user = self.get_object()
        
        stats = {
            'user_id': user.id,
            'role': user.role,
            'supplier_type': user.supplier_type,
            'created_at': user.created_at,
            'is_active': user.is_active,
        }
        
        if user.role == User.UserRole.BUYER:
            stats.update({
                'rfqs_count': user.rfqs.count(),
                'active_rfqs_count': user.rfqs.filter(status='active').count(),
                'orders_count': user.buyer_orders.count(),
                'completed_orders_count': user.buyer_orders.filter(status='completed').count(),
            })
        elif user.role == User.UserRole.SUPPLIER:
            stats.update({
                'products_count': user.products.count(),
                'active_products_count': user.products.filter(is_active=True).count(),
                'offers_count': user.offers.count(),
                'accepted_offers_count': user.offers.filter(status='accepted').count(),
                'orders_count': user.supplier_orders.count(),
                'completed_orders_count': user.supplier_orders.filter(status='completed').count(),
            })
        
        return Response(stats)
