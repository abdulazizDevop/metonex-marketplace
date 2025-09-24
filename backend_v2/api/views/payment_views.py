"""
Payment views - To'lovlar uchun views
"""

from django.db.models import Q
from django.utils import timezone
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Payment, Order, User
from ..serializers import (
    PaymentSerializer,
    PaymentListSerializer,
    PaymentCreateSerializer,
    PaymentSearchSerializer,
    PaymentAnalyticsSerializer
)


class PaymentViewSet(viewsets.ModelViewSet):
    """
    To'lovlar uchun ViewSet
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['order', 'payment_method', 'status']
    search_fields = ['payment_reference', 'escrow_reference']
    ordering_fields = ['created_at', 'amount', 'processed_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Payment.objects.select_related(
            'order', 'order__buyer', 'order__supplier'
        ).prefetch_related(
            'order__buyer__company',
            'order__supplier__company'
        )
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return PaymentListSerializer
        elif self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'search', 'analytics']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """To'lov yaratish"""
        serializer.save()
    
    def perform_update(self, serializer):
        """To'lov yangilash"""
        # Faqat admin yoki to'lov egasi yangilay oladi
        payment = serializer.instance
        if payment.order.buyer != self.request.user and payment.order.supplier != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu to'lovni yangilay olmaysiz")
        serializer.save()
    
    def perform_destroy(self, instance):
        """To'lov o'chirish"""
        # Faqat admin o'chira oladi
        if not self.request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu to'lovni o'chira olmaysiz")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def my_payments(self, request):
        """Joriy foydalanuvchi to'lovlari"""
        payments = self.get_queryset().filter(
            Q(order__buyer=request.user) | Q(order__supplier=request.user)
        )
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Kutilayotgan to'lovlar"""
        payments = self.get_queryset().filter(status='pending')
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def received(self, request):
        """Qabul qilingan to'lovlar"""
        payments = self.get_queryset().filter(status='received')
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def held_in_escrow(self, request):
        """Escrow da ushlab turilgan to'lovlar"""
        payments = self.get_queryset().filter(status='held_in_escrow')
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def released(self, request):
        """Chiqarilgan to'lovlar"""
        payments = self.get_queryset().filter(status='released')
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def refunded(self, request):
        """Qaytarilgan to'lovlar"""
        payments = self.get_queryset().filter(status='refunded')
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_order(self, request):
        """Buyurtma bo'yicha to'lovlar"""
        order_id = request.query_params.get('order_id')
        if not order_id:
            return Response({'error': 'order_id parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        payments = self.get_queryset().filter(order_id=order_id)
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_method(self, request):
        """To'lov usuli bo'yicha to'lovlar"""
        payment_method = request.query_params.get('payment_method')
        if not payment_method:
            return Response({'error': 'payment_method parametri kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        payments = self.get_queryset().filter(payment_method=payment_method)
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm_cash(self, request, pk=None):
        """Naqd to'lovni tasdiqlash"""
        payment = self.get_object()
        confirmed_by = request.data.get('confirmed_by')
        
        if not confirmed_by:
            return Response({'error': 'confirmed_by kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Faqat buyurtma egasi tasdiqlay oladi
        if confirmed_by == 'buyer' and payment.order.buyer != request.user:
            return Response({'error': 'Siz bu to\'lovni tasdiqlay olmaysiz'}, 
                           status=status.HTTP_403_FORBIDDEN)
        elif confirmed_by == 'supplier' and payment.order.supplier != request.user:
            return Response({'error': 'Siz bu to\'lovni tasdiqlay olmaysiz'}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        payment.status = 'received'
        payment.processed_at = timezone.now()
        payment.save()
        
        return Response({'message': 'Naqd to\'lov tasdiqlandi'})
    
    @action(detail=True, methods=['post'])
    def release_escrow(self, request, pk=None):
        """Escrow dan to'lovni chiqarish"""
        payment = self.get_object()
        # Faqat admin yoki buyurtma egasi chiqara oladi
        if payment.order.buyer != request.user and not request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu to'lovni chiqara olmaysiz")
        
        payment.status = 'released'
        payment.processed_at = timezone.now()
        payment.save()
        
        return Response({'message': 'Escrow dan to\'lov chiqarildi'})
    
    @action(detail=True, methods=['post'])
    def process_refund(self, request, pk=None):
        """To'lovni qaytarish"""
        payment = self.get_object()
        # Faqat admin qaytara oladi
        if not request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu to'lovni qaytara olmaysiz")
        
        payment.status = 'refunded'
        payment.processed_at = timezone.now()
        payment.save()
        
        return Response({'message': 'To\'lov qaytarildi'})


class PaymentListView(viewsets.ReadOnlyModelViewSet):
    """
    To'lovlar ro'yxati uchun ViewSet
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['order', 'payment_method', 'status']
    search_fields = ['payment_reference', 'escrow_reference']
    ordering_fields = ['created_at', 'amount', 'processed_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Payment.objects.select_related(
            'order', 'order__buyer', 'order__supplier'
        )


class PaymentDetailView(viewsets.ReadOnlyModelViewSet):
    """
    To'lov batafsil ma'lumotlari uchun ViewSet
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Payment.objects.select_related(
            'order', 'order__buyer', 'order__supplier'
        ).prefetch_related(
            'order__buyer__company',
            'order__supplier__company'
        )


class PaymentCreateView(APIView):
    """
    To'lov yaratish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """To'lov yaratish"""
        serializer = PaymentCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            payment = serializer.save()
            response_serializer = PaymentSerializer(payment)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentConfirmView(APIView):
    """
    To'lovni tasdiqlash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """To'lovni tasdiqlash"""
        try:
            payment = Payment.objects.get(pk=pk)
            # Faqat buyurtma egasi tasdiqlay oladi
            if payment.order.buyer != request.user and payment.order.supplier != request.user:
                return Response({'error': 'Siz bu to\'lovni tasdiqlay olmaysiz'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            payment.status = 'received'
            payment.processed_at = timezone.now()
            payment.save()
            
            return Response({'message': 'To\'lov tasdiqlandi'})
        except Payment.DoesNotExist:
            return Response({'error': 'To\'lov topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class PaymentReleaseView(APIView):
    """
    To'lovni chiqarish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """To'lovni chiqarish"""
        try:
            payment = Payment.objects.get(pk=pk)
            # Faqat admin yoki buyurtma egasi chiqara oladi
            if payment.order.buyer != request.user and not request.user.is_staff:
                return Response({'error': 'Siz bu to\'lovni chiqara olmaysiz'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            payment.status = 'released'
            payment.processed_at = timezone.now()
            payment.save()
            
            return Response({'message': 'To\'lov chiqarildi'})
        except Payment.DoesNotExist:
            return Response({'error': 'To\'lov topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class PaymentRefundView(APIView):
    """
    To'lovni qaytarish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """To'lovni qaytarish"""
        try:
            payment = Payment.objects.get(pk=pk)
            # Faqat admin qaytara oladi
            if not request.user.is_staff:
                return Response({'error': 'Siz bu to\'lovni qaytara olmaysiz'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            payment.status = 'refunded'
            payment.processed_at = timezone.now()
            payment.save()
            
            return Response({'message': 'To\'lov qaytarildi'})
        except Payment.DoesNotExist:
            return Response({'error': 'To\'lov topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class PaymentSearchView(APIView):
    """
    To'lov qidirish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """To'lov qidirish"""
        serializer = PaymentSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = Payment.objects.select_related(
            'order', 'order__buyer', 'order__supplier'
        )
        
        filters = serializer.validated_data
        
        # Filterlar
        if filters.get('order_id'):
            queryset = queryset.filter(order_id=filters['order_id'])
        if filters.get('payment_method'):
            queryset = queryset.filter(payment_method=filters['payment_method'])
        if filters.get('status'):
            queryset = queryset.filter(status=filters['status'])
        if filters.get('min_amount'):
            queryset = queryset.filter(amount__gte=filters['min_amount'])
        if filters.get('max_amount'):
            queryset = queryset.filter(amount__lte=filters['max_amount'])
        if filters.get('date_from'):
            queryset = queryset.filter(created_at__gte=filters['date_from'])
        if filters.get('date_to'):
            queryset = queryset.filter(created_at__lte=filters['date_to'])
        
        # Qidiruv matni
        if filters.get('search'):
            search_term = filters['search']
            queryset = queryset.filter(
                Q(payment_reference__icontains=search_term) |
                Q(escrow_reference__icontains=search_term) |
                Q(transaction_id__icontains=search_term)
            )
        
        serializer = PaymentListSerializer(queryset, many=True)
        return Response(serializer.data)


class PaymentAnalyticsView(APIView):
    """
    To'lov analytics uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """To'lov analytics"""
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar analytics ko\'ra oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        payments = Payment.objects.filter(
            order__supplier=request.user
        ).select_related('order')
        
        serializer = PaymentAnalyticsSerializer(payments, many=True)
        return Response(serializer.data)
