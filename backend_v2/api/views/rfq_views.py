"""
RFQ views - Request for Quote uchun views
"""

from django.db.models import Q
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

from ..models import RFQ, User, Category, SubCategory, Unit
from ..serializers import (
    RFQSerializer,
    RFQListSerializer,
    RFQCreateSerializer,
    RFQUpdateSerializer,
    RFQSearchSerializer
)


class RFQViewSet(viewsets.ModelViewSet):
    """
    RFQ lar uchun ViewSet
    """
    queryset = RFQ.objects.all()
    serializer_class = RFQSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['buyer', 'category', 'status']
    search_fields = ['brand', 'grade']
    ordering_fields = ['created_at', 'delivery_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return RFQ.objects.select_related(
            'buyer', 'category', 'unit'
        ).prefetch_related('buyer__company')
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return RFQListSerializer
        elif self.action == 'create':
            return RFQCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return RFQUpdateSerializer
        return RFQSerializer
    
    def get_object(self):
        """RFQ objektini olish (ownership tekshirish bilan)"""
        obj = super().get_object()
        
        # Faqat RFQ egasi yoki supplierlar ko'ra oladi
        if (self.request.user.role == User.UserRole.BUYER and 
            obj.buyer != self.request.user):
            # Boshqa buyerlar ko'ra olmaydi
            raise PermissionDenied("Siz bu RFQ ni ko'ra olmaysiz")
        
        return obj
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'search', 'my_rfqs', 'active', 'completed', 'cancelled', 'by_category', 'by_buyer', 'offers']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update', 'destroy', 'accept_offer', 'cancel', 'complete']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """RFQ yaratish"""
        # Faqat buyerlar RFQ yarata oladi
        if self.request.user.role != User.UserRole.BUYER:
            raise permissions.PermissionDenied("Faqat sotib oluvchilar RFQ yarata oladi")
        serializer.save(buyer=self.request.user)
    
    def perform_update(self, serializer):
        """RFQ yangilash"""
        # Faqat RFQ egasi yangilay oladi
        if serializer.instance.buyer != self.request.user:
            raise permissions.PermissionDenied("Siz bu RFQ ni yangilay olmaysiz")
        serializer.save()
    
    def perform_destroy(self, instance):
        """RFQ o'chirish"""
        # Faqat RFQ egasi o'chira oladi
        if instance.buyer != self.request.user:
            raise permissions.PermissionDenied("Siz bu RFQ ni o'chira olmaysiz")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def my_rfqs(self, request):
        """Joriy foydalanuvchi RFQ lari"""
        if request.user.role != User.UserRole.BUYER:
            return Response({'error': 'Faqat sotib oluvchilar RFQ yarata oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        rfqs = self.get_queryset().filter(buyer=request.user)
        serializer = RFQListSerializer(rfqs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Faol RFQ lar"""
        rfqs = self.get_queryset().filter(status='active')
        serializer = RFQListSerializer(rfqs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Tugallangan RFQ lar"""
        rfqs = self.get_queryset().filter(status='completed')
        serializer = RFQListSerializer(rfqs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def cancelled(self, request):
        """Bekor qilingan RFQ lar"""
        rfqs = self.get_queryset().filter(status='cancelled')
        serializer = RFQListSerializer(rfqs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Kategoriya bo'yicha RFQ lar"""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response({'error': 'category_id parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        rfqs = self.get_queryset().filter(category_id=category_id, status='active')
        serializer = RFQListSerializer(rfqs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_buyer(self, request):
        """Sotib oluvchi bo'yicha RFQ lar"""
        buyer_id = request.query_params.get('buyer_id')
        if not buyer_id:
            return Response({'error': 'buyer_id parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        rfqs = self.get_queryset().filter(buyer_id=buyer_id)
        serializer = RFQListSerializer(rfqs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def offers(self, request, pk=None):
        """RFQ takliflari"""
        rfq = self.get_object()
        offers = rfq.offers.all()
        from ..serializers import OfferListSerializer
        serializer = OfferListSerializer(offers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def accept_offer(self, request, pk=None):
        """Taklifni qabul qilish"""
        rfq = self.get_object()
        offer_id = request.data.get('offer_id')
        
        if not offer_id:
            return Response({'error': 'offer_id kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        try:
            offer = rfq.offers.get(id=offer_id)
            offer.status = 'accepted'
            offer.save()
            
            # RFQ ni tugallangan deb belgilash
            rfq.status = 'completed'
            rfq.save()
            
            return Response({'message': 'Taklif qabul qilindi'})
        except Exception as e:
            return Response({'error': 'Taklif topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """RFQ ni bekor qilish"""
        rfq = self.get_object()
        if rfq.buyer != request.user:
            raise permissions.PermissionDenied("Siz bu RFQ ni bekor qila olmaysiz")
        
        rfq.status = 'cancelled'
        rfq.save()
        return Response({'message': 'RFQ bekor qilindi'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """RFQ ni tugallash"""
        rfq = self.get_object()
        if rfq.buyer != request.user:
            raise permissions.PermissionDenied("Siz bu RFQ ni tugallay olmaysiz")
        
        rfq.status = 'completed'
        rfq.save()
        return Response({'message': 'RFQ tugallandi'})


class RFQListView(viewsets.ReadOnlyModelViewSet):
    """
    RFQ lar ro'yxati uchun ViewSet
    """
    queryset = RFQ.objects.all()
    serializer_class = RFQListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['buyer', 'category', 'status']
    search_fields = ['brand', 'grade']
    ordering_fields = ['created_at', 'delivery_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return RFQ.objects.select_related(
            'buyer', 'category', 'unit'
        ).filter(status='active')


class RFQDetailView(viewsets.ReadOnlyModelViewSet):
    """
    RFQ batafsil ma'lumotlari uchun ViewSet
    """
    queryset = RFQ.objects.all()
    serializer_class = RFQSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return RFQ.objects.select_related(
            'buyer', 'category', 'unit'
        ).prefetch_related(
            'buyer__company',
            'offers__supplier'
        )


class RFQCreateView(APIView):
    """
    RFQ yaratish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RFQCreateSerializer
    
    def post(self, request):
        """RFQ yaratish"""
        if request.user.role != User.UserRole.BUYER:
            return Response({'error': 'Faqat sotib oluvchilar RFQ yarata oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RFQCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            rfq = serializer.save()
            response_serializer = RFQSerializer(rfq)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RFQUpdateView(APIView):
    """
    RFQ yangilash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RFQUpdateSerializer
    
    def put(self, request, pk):
        """RFQ yangilash"""
        try:
            rfq = RFQ.objects.get(pk=pk, buyer=request.user)
            serializer = RFQUpdateSerializer(
                rfq, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                response_serializer = RFQSerializer(rfq)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except RFQ.DoesNotExist:
            return Response({'error': 'RFQ topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class RFQSearchView(APIView):
    """
    RFQ qidirish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RFQSearchSerializer
    
    def get(self, request):
        """RFQ qidirish"""
        serializer = RFQSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = RFQ.objects.select_related(
            'buyer', 'category', 'unit'
        ).filter(status='active')
        
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
        if filters.get('min_volume'):
            queryset = queryset.filter(volume__gte=filters['min_volume'])
        if filters.get('max_volume'):
            queryset = queryset.filter(volume__lte=filters['max_volume'])
        if filters.get('delivery_location'):
            queryset = queryset.filter(delivery_location__icontains=filters['delivery_location'])
        if filters.get('payment_method'):
            queryset = queryset.filter(payment_method=filters['payment_method'])
        
        # Qidiruv matni
        if filters.get('search'):
            search_term = filters['search']
            queryset = queryset.filter(
                Q(brand__icontains=search_term) |
                Q(grade__icontains=search_term) |
                Q(delivery_location__icontains=search_term)
            )
        
        serializer = RFQListSerializer(queryset, many=True)
        return Response(serializer.data)
