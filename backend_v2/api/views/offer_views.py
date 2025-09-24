"""
Offer views - Takliflar uchun views
"""

from django.db.models import Q
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

from ..models import Offer, CounterOffer, User
from ..serializers import (
    OfferSerializer,
    OfferListSerializer,
    OfferCreateSerializer,
    OfferUpdateSerializer,
    OfferSearchSerializer,
    CounterOfferSerializer,
    CounterOfferCreateSerializer
)


class OfferViewSet(viewsets.ModelViewSet):
    """
    Takliflar uchun ViewSet
    """
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['rfq', 'supplier', 'status']
    search_fields = ['delivery_terms']
    ordering_fields = ['created_at', 'price_per_unit']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Offer.objects.select_related(
            'rfq', 'supplier', 'product'
        ).prefetch_related('supplier__company')
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return OfferListSerializer
        elif self.action == 'create':
            return OfferCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OfferUpdateSerializer
        return OfferSerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'search']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Taklif yaratish"""
        # Faqat supplierlar taklif yarata oladi
        if self.request.user.role != User.UserRole.SUPPLIER:
            raise permissions.PermissionDenied("Faqat sotuvchilar taklif yarata oladi")
        serializer.save(supplier=self.request.user)
    
    def perform_update(self, serializer):
        """Taklif yangilash"""
        # Faqat taklif egasi yangilay oladi
        if serializer.instance.supplier != self.request.user:
            raise permissions.PermissionDenied("Siz bu taklifni yangilay olmaysiz")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Taklif o'chirish"""
        # Faqat taklif egasi o'chira oladi
        if instance.supplier != self.request.user:
            raise permissions.PermissionDenied("Siz bu taklifni o'chira olmaysiz")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def my_offers(self, request):
        """Joriy foydalanuvchi takliflari"""
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar taklif yarata oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        offers = self.get_queryset().filter(supplier=request.user)
        serializer = OfferListSerializer(offers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Kutilayotgan takliflar"""
        offers = self.get_queryset().filter(status='pending')
        serializer = OfferListSerializer(offers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def accepted(self, request):
        """Qabul qilingan takliflar"""
        offers = self.get_queryset().filter(status='accepted')
        serializer = OfferListSerializer(offers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def rejected(self, request):
        """Rad etilgan takliflar"""
        offers = self.get_queryset().filter(status='rejected')
        serializer = OfferListSerializer(offers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def counter_offered(self, request):
        """Counter-offer qilingan takliflar"""
        offers = self.get_queryset().filter(status='counter_offered')
        serializer = OfferListSerializer(offers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_rfq(self, request):
        """RFQ bo'yicha takliflar"""
        rfq_id = request.query_params.get('rfq_id')
        if not rfq_id:
            return Response({'error': 'rfq_id parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        offers = self.get_queryset().filter(rfq_id=rfq_id)
        serializer = OfferListSerializer(offers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_supplier(self, request):
        """Sotuvchi bo'yicha takliflar"""
        supplier_id = request.query_params.get('supplier_id')
        if not supplier_id:
            return Response({'error': 'supplier_id parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        offers = self.get_queryset().filter(supplier_id=supplier_id)
        serializer = OfferListSerializer(offers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def counter_offers(self, request, pk=None):
        """Taklif counter-offer lari"""
        offer = self.get_object()
        counter_offers = offer.counter_offers.all()
        serializer = CounterOfferSerializer(counter_offers, many=True)
        return Response(serializer.data)


class OfferListView(viewsets.ReadOnlyModelViewSet):
    """
    Takliflar ro'yxati uchun ViewSet
    """
    queryset = Offer.objects.all()
    serializer_class = OfferListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['rfq', 'supplier', 'status']
    search_fields = ['delivery_terms']
    ordering_fields = ['created_at', 'price_per_unit']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Offer.objects.select_related(
            'rfq', 'supplier', 'product'
        )


class OfferDetailView(viewsets.ReadOnlyModelViewSet):
    """
    Taklif batafsil ma'lumotlari uchun ViewSet
    """
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Offer.objects.select_related(
            'rfq', 'supplier', 'product'
        ).prefetch_related(
            'supplier__company',
            'counter_offers'
        )


class OfferCreateView(APIView):
    """
    Taklif yaratish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Taklif yaratish"""
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar taklif yarata oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        serializer = OfferCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            offer = serializer.save()
            response_serializer = OfferSerializer(offer)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OfferUpdateView(APIView):
    """
    Taklif yangilash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, pk):
        """Taklif yangilash"""
        try:
            offer = Offer.objects.get(pk=pk, supplier=request.user)
            serializer = OfferUpdateSerializer(
                offer, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                response_serializer = OfferSerializer(offer)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Offer.DoesNotExist:
            return Response({'error': 'Taklif topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class OfferAcceptView(APIView):
    """
    Taklifni qabul qilish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Taklifni qabul qilish"""
        try:
            offer = Offer.objects.get(pk=pk)
            # Faqat RFQ egasi qabul qila oladi
            if offer.rfq.buyer != request.user:
                return Response({'error': 'Siz bu taklifni qabul qila olmaysiz'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            offer.status = 'accepted'
            offer.save()
            
            # RFQ ni tugallangan deb belgilash
            offer.rfq.status = 'completed'
            offer.rfq.save()
            
            # Order yaratish
            from ..models import Order
            order = Order.objects.create(
                rfq=offer.rfq,
                offer=offer,
                buyer=offer.rfq.buyer,
                supplier=offer.supplier,
                total_amount=offer.total_amount,
                payment_method=offer.rfq.payment_method,
                delivery_address=offer.rfq.delivery_location,
                delivery_date=offer.delivery_date,
                status='created'
            )
            
            return Response({
                'message': 'Taklif qabul qilindi',
                'order_id': order.id
            })
        except Offer.DoesNotExist:
            return Response({'error': 'Taklif topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class OfferRejectView(APIView):
    """
    Taklifni rad etish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Taklifni rad etish"""
        try:
            offer = Offer.objects.get(pk=pk)
            # Faqat RFQ egasi rad eta oladi
            if offer.rfq.buyer != request.user:
                return Response({'error': 'Siz bu taklifni rad eta olmaysiz'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            offer.status = 'rejected'
            offer.rejection_reason = request.data.get('reason', '')
            offer.save()
            
            return Response({'message': 'Taklif rad etildi'})
        except Offer.DoesNotExist:
            return Response({'error': 'Taklif topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class CounterOfferViewSet(viewsets.ModelViewSet):
    """
    Counter-offer lar uchun ViewSet
    """
    queryset = CounterOffer.objects.all()
    serializer_class = CounterOfferSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['original_offer', 'sender', 'status']
    search_fields = ['comment']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return CounterOffer.objects.select_related(
            'original_offer', 'sender'
        ).prefetch_related('sender__company')
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'create':
            return CounterOfferCreateSerializer
        return CounterOfferSerializer
    
    def perform_create(self, serializer):
        """Counter-offer yaratish"""
        serializer.save(sender=self.request.user)


class CounterOfferCreateView(APIView):
    """
    Counter-offer yaratish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Counter-offer yaratish"""
        serializer = CounterOfferCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            counter_offer = serializer.save()
            response_serializer = CounterOfferSerializer(counter_offer)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CounterOfferAcceptView(APIView):
    """
    Counter-offer ni qabul qilish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Counter-offer ni qabul qilish"""
        try:
            counter_offer = CounterOffer.objects.get(pk=pk)
            # Faqat original offer egasi qabul qila oladi
            if counter_offer.original_offer.supplier != request.user:
                return Response({'error': 'Siz bu counter-offer ni qabul qila olmaysiz'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            counter_offer.status = 'accepted'
            counter_offer.save()
            
            # Original offer ni yangilash
            original_offer = counter_offer.original_offer
            if counter_offer.price_per_unit:
                original_offer.price_per_unit = counter_offer.price_per_unit
            if counter_offer.volume:
                original_offer.total_amount = counter_offer.price_per_unit * counter_offer.volume
            if counter_offer.delivery_date:
                original_offer.delivery_date = counter_offer.delivery_date
            original_offer.save()
            
            return Response({'message': 'Counter-offer qabul qilindi'})
        except CounterOffer.DoesNotExist:
            return Response({'error': 'Counter-offer topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class CounterOfferRejectView(APIView):
    """
    Counter-offer ni rad etish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Counter-offer ni rad etish"""
        try:
            counter_offer = CounterOffer.objects.get(pk=pk)
            # Faqat original offer egasi rad eta oladi
            if counter_offer.original_offer.supplier != request.user:
                return Response({'error': 'Siz bu counter-offer ni rad eta olmaysiz'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            counter_offer.status = 'rejected'
            counter_offer.save()
            
            return Response({'message': 'Counter-offer rad etildi'})
        except CounterOffer.DoesNotExist:
            return Response({'error': 'Counter-offer topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class OfferSearchView(APIView):
    """
    Taklif qidirish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Taklif qidirish"""
        serializer = OfferSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = Offer.objects.select_related(
            'rfq', 'supplier', 'product'
        )
        
        filters = serializer.validated_data
        
        # Filterlar
        if filters.get('rfq_id'):
            queryset = queryset.filter(rfq_id=filters['rfq_id'])
        if filters.get('supplier_id'):
            queryset = queryset.filter(supplier_id=filters['supplier_id'])
        if filters.get('status'):
            queryset = queryset.filter(status=filters['status'])
        if filters.get('min_price'):
            queryset = queryset.filter(price_per_unit__gte=filters['min_price'])
        if filters.get('max_price'):
            queryset = queryset.filter(price_per_unit__lte=filters['max_price'])
        if filters.get('delivery_date_from'):
            queryset = queryset.filter(delivery_date__gte=filters['delivery_date_from'])
        if filters.get('delivery_date_to'):
            queryset = queryset.filter(delivery_date__lte=filters['delivery_date_to'])
        
        # Qidiruv matni
        if filters.get('search'):
            search_term = filters['search']
            queryset = queryset.filter(
                Q(delivery_terms__icontains=search_term) |
                Q(comment__icontains=search_term)
            )
        
        serializer = OfferListSerializer(queryset, many=True)
        return Response(serializer.data)
