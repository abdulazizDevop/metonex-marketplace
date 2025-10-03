"""
Order views - Buyurtmalar uchun views
"""

from django.db.models import Q
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

from ..models import Order, OrderDocument, OrderStatusHistory, Document
from django.utils import timezone
from ..serializers import (
    OrderSerializer,
    OrderListSerializer,
    OrderCreateSerializer,
    OrderUpdateSerializer,
    OrderSearchSerializer,
    OrderDocumentSerializer,
    OrderStatusHistorySerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """
    Buyurtmalar uchun ViewSet
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['buyer', 'supplier', 'status', 'payment_method']
    search_fields = ['contract_url', 'invoice_url']
    ordering_fields = ['created_at', 'delivery_date', 'total_amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Order.objects.select_related(
            'rfq', 'offer', 'buyer', 'supplier'
        ).prefetch_related(
            'buyer__company',
            'supplier__company',
            'documents',
            'status_history'
        )
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return OrderListSerializer
        elif self.action == 'create':
            return OrderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        return OrderSerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'search', 'my_orders', 'buyer_orders', 'supplier_orders']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Buyurtma yaratish"""
        serializer.save()
    
    def perform_update(self, serializer):
        """Buyurtma yangilash"""
        # Faqat buyurtma egasi yoki admin yangilay oladi
        order = serializer.instance
        if order.buyer != self.request.user and order.supplier != self.request.user:
            raise permissions.PermissionDenied("Siz bu buyurtmani yangilay olmaysiz")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Buyurtma o'chirish"""
        # Faqat admin o'chira oladi
        if not self.request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu buyurtmani o'chira olmaysiz")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Joriy foydalanuvchi buyurtmalari"""
        orders = self.get_queryset().filter(
            Q(buyer=request.user) | Q(supplier=request.user)
        )
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def buyer_orders(self, request):
        """Sotib oluvchi buyurtmalari"""
        orders = self.get_queryset().filter(buyer=request.user)
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def supplier_orders(self, request):
        """Sotuvchi buyurtmalari"""
        orders = self.get_queryset().filter(supplier=request.user)
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def created(self, request):
        """Yaratilgan buyurtmalar"""
        orders = self.get_queryset().filter(status='created')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def payment_confirmed(self, request):
        """To'lov tasdiqlangan buyurtmalar"""
        orders = self.get_queryset().filter(status='payment_confirmed')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def awaiting_payment(self, request):
        """To'lov kutayotgan buyurtmalar"""
        orders = self.get_queryset().filter(status='awaiting_payment')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def ready_for_delivery(self, request):
        """Yetkazib berishga tayyor buyurtmalar"""
        orders = self.get_queryset().filter(status='ready_for_delivery')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def in_preparation(self, request):
        """Tayyorlanayotgan buyurtmalar"""
        orders = self.get_queryset().filter(status='in_preparation')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def in_transit(self, request):
        """Yetkazilayotgan buyurtmalar"""
        orders = self.get_queryset().filter(status='in_transit')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def delivered(self, request):
        """Yetkazilgan buyurtmalar"""
        orders = self.get_queryset().filter(status='delivered')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def confirmed(self, request):
        """Tasdiqlangan buyurtmalar"""
        orders = self.get_queryset().filter(status='confirmed')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Tugallangan buyurtmalar"""
        orders = self.get_queryset().filter(status='completed')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def cancelled(self, request):
        """Bekor qilingan buyurtmalar"""
        orders = self.get_queryset().filter(status='cancelled')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        """Sotuvchi tomonidan to'lovni tasdiqlash"""
        order = self.get_object()
        
        if order.supplier != request.user:
            return Response(
                {'error': 'Faqat sotuvchi to\'lovni tasdiqlashi mumkin'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if order.status != Order.OrderStatus.AWAITING_PAYMENT:
            return Response(
                {'error': 'To\'lov kutilayotgan buyurtmalar uchun tasdiqlash mumkin'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.payment_confirmed_by_seller = True
        order.payment_confirmed_at = timezone.now()
        order.status = Order.OrderStatus.PAYMENT_CONFIRMED
        order.save()
        
        # Status history ga qo'shish
        OrderStatusHistory.objects.create(
            order=order,
            status=order.status,
            comment='Sotuvchi tomonidan to\'lov tasdiqlangan',
            created_by=request.user
        )
        
        return Response({'message': 'To\'lov muvaffaqiyatli tasdiqlandi'})
    
    @action(detail=True, methods=['post'])
    def upload_payment_proof(self, request, pk=None):
        """Buyer tomonidan to'lov hujjatini yuklash"""
        order = self.get_object()
        
        if order.buyer != request.user:
            return Response(
                {'error': 'Faqat buyer to\'lov hujjatini yuklashi mumkin'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if order.status != Order.OrderStatus.AWAITING_PAYMENT:
            return Response(
                {'error': 'To\'lov kutilayotgan buyurtmalar uchun hujjat yuklash mumkin'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Hujjat yuklash logikasi
        document = Document.objects.create(
            title=f"To'lov hujjati - Order {order.id}",
            file=request.FILES['file'],
            user=request.user,
            order=order,
            document_type='payment_proof',
            file_name=request.FILES['file'].name,
            file_size=request.FILES['file'].size,
            content_type=request.FILES['file'].content_type
        )
        
        order.payment_proof_document = document
        order.save()
        
        return Response({'message': 'To\'lov hujjati muvaffaqiyatli yuklandi'})
    
    @action(detail=True, methods=['post'])
    def upload_ttn(self, request, pk=None):
        """Sotuvchi tomonidan TTN hujjatini yuklash"""
        order = self.get_object()
        
        if order.supplier != request.user:
            return Response(
                {'error': 'Faqat sotuvchi TTN hujjatini yuklashi mumkin'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if order.status not in [Order.OrderStatus.READY_FOR_DELIVERY, Order.OrderStatus.IN_PREPARATION]:
            return Response(
                {'error': 'Tayyor yoki yetkazib berishga tayyor buyurtmalar uchun TTN yuklash mumkin'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # TTN hujjatini yuklash
        document = Document.objects.create(
            title=f"TTN hujjati - Order {order.id}",
            file=request.FILES['file'],
            user=request.user,
            order=order,
            document_type='ttn',
            file_name=request.FILES['file'].name,
            file_size=request.FILES['file'].size,
            content_type=request.FILES['file'].content_type
        )
        
        order.ttn_document = document
        order.status = Order.OrderStatus.IN_TRANSIT
        order.save()
        
        # Status history ga qo'shish
        OrderStatusHistory.objects.create(
            order=order,
            status=order.status,
            comment='TTN hujjati yuklandi, mahsulot yo\'lda',
            created_by=request.user
        )
        
        return Response({'message': 'TTN hujjati muvaffaqiyatli yuklandi'})
    
    @action(detail=True, methods=['post'])
    def upload_contract(self, request, pk=None):
        """Sotuvchi tomonidan shartnoma hujjatini yuklash"""
        order = self.get_object()
        
        if order.supplier != request.user:
            return Response(
                {'error': 'Faqat sotuvchi shartnoma hujjatini yuklashi mumkin'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Shartnoma hujjatini yuklash
        document = Document.objects.create(
            title=f"Shartnoma - Order {order.id}",
            file=request.FILES['file'],
            user=request.user,
            order=order,
            document_type='contract',
            file_name=request.FILES['file'].name,
            file_size=request.FILES['file'].size,
            content_type=request.FILES['file'].content_type
        )
        
        order.contract_document = document
        order.save()
        
        return Response({'message': 'Shartnoma hujjati muvaffaqiyatli yuklandi'})
    
    @action(detail=True, methods=['post'])
    def upload_invoice(self, request, pk=None):
        """Sotuvchi tomonidan hisob-faktura hujjatini yuklash"""
        order = self.get_object()
        
        if order.supplier != request.user:
            return Response(
                {'error': 'Faqat sotuvchi hisob-faktura hujjatini yuklashi mumkin'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Hisob-faktura hujjatini yuklash
        document = Document.objects.create(
            title=f"Hisob-faktura - Order {order.id}",
            file=request.FILES['file'],
            user=request.user,
            order=order,
            document_type='invoice',
            file_name=request.FILES['file'].name,
            file_size=request.FILES['file'].size,
            content_type=request.FILES['file'].content_type
        )
        
        order.invoice_document = document
        order.save()
        
        return Response({'message': 'Hisob-faktura hujjati muvaffaqiyatli yuklandi'})
    
    @action(detail=True, methods=['post'])
    def confirm_delivery(self, request, pk=None):
        """Yetkazishni tasdiqlash"""
        order = self.get_object()
        # Faqat sotib oluvchi tasdiqlay oladi
        if order.buyer != request.user:
            raise permissions.PermissionDenied("Siz bu buyurtma yetkazishini tasdiqlay olmaysiz")
        
        order.status = 'confirmed'
        order.save()
        
        return Response({'message': 'Yetkazish tasdiqlandi'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Buyurtmani bekor qilish"""
        order = self.get_object()
        # Faqat buyurtma egasi bekor qila oladi
        if order.buyer != request.user and order.supplier != request.user:
            raise permissions.PermissionDenied("Siz bu buyurtmani bekor qila olmaysiz")
        
        order.status = 'cancelled'
        order.save()
        
        return Response({'message': 'Buyurtma bekor qilindi'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Buyurtmani tugallash"""
        order = self.get_object()
        # Faqat admin tugallay oladi
        if not request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu buyurtmani tugallay olmaysiz")
        
        order.status = 'completed'
        order.save()
        
        return Response({'message': 'Buyurtma tugallandi'})


class OrderListView(viewsets.ReadOnlyModelViewSet):
    """
    Buyurtmalar ro'yxati uchun ViewSet
    """
    queryset = Order.objects.all()
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['buyer', 'supplier', 'status', 'payment_method']
    search_fields = ['contract_url', 'invoice_url']
    ordering_fields = ['created_at', 'delivery_date', 'total_amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Order.objects.select_related(
            'rfq', 'offer', 'buyer', 'supplier'
        )


class OrderDetailView(viewsets.ReadOnlyModelViewSet):
    """
    Buyurtma batafsil ma'lumotlari uchun ViewSet
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Order.objects.select_related(
            'rfq', 'offer', 'buyer', 'supplier'
        ).prefetch_related(
            'buyer__company',
            'supplier__company',
            'documents',
            'status_history'
        )


class OrderCreateView(APIView):
    """
    Buyurtma yaratish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Buyurtma yaratish"""
        serializer = OrderCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            order = serializer.save()
            response_serializer = OrderSerializer(order)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderUpdateView(APIView):
    """
    Buyurtma yangilash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, pk):
        """Buyurtma yangilash"""
        try:
            order = Order.objects.get(pk=pk)
            # Faqat buyurtma egasi yangilay oladi
            if order.buyer != request.user and order.supplier != request.user:
                return Response({'error': 'Siz bu buyurtmani yangilay olmaysiz'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            serializer = OrderUpdateSerializer(
                order, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                response_serializer = OrderSerializer(order)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response({'error': 'Buyurtma topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class OrderStatusUpdateView(APIView):
    """
    Buyurtma holatini yangilash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Buyurtma holatini yangilash"""
        try:
            order = Order.objects.get(pk=pk)
            new_status = request.data.get('status')
            comment = request.data.get('comment', '')
            
            if not new_status:
                return Response({'error': 'status kerak'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Holat yangilash logikasi
            order.status = new_status
            order.save()
            
            # Status history ga qo'shish
            OrderStatusHistory.objects.create(
                order=order,
                status=new_status,
                comment=comment,
                created_by=request.user
            )
            
            return Response({'message': 'Buyurtma holati yangilandi'})
        except Order.DoesNotExist:
            return Response({'error': 'Buyurtma topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)


class OrderDocumentViewSet(viewsets.ModelViewSet):
    """
    Buyurtma hujjatlari uchun ViewSet
    """
    queryset = OrderDocument.objects.all()
    serializer_class = OrderDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['order', 'document_type', 'uploaded_by']
    search_fields = ['file_url']
    ordering_fields = ['uploaded_at']
    ordering = ['-uploaded_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return OrderDocument.objects.select_related(
            'order', 'uploaded_by'
        )
    
    def perform_create(self, serializer):
        """Hujjat yaratish"""
        serializer.save(uploaded_by=self.request.user)


class OrderStatusHistoryViewSet(viewsets.ModelViewSet):
    """
    Buyurtma holat tarixi uchun ViewSet
    """
    queryset = OrderStatusHistory.objects.all()
    serializer_class = OrderStatusHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['order', 'status', 'created_by']
    search_fields = ['comment']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return OrderStatusHistory.objects.select_related(
            'order', 'created_by'
        )
    
    def perform_create(self, serializer):
        """Status history yaratish"""
        serializer.save(created_by=self.request.user)


class OrderSearchView(APIView):
    """
    Buyurtma qidirish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Buyurtma qidirish"""
        serializer = OrderSearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = Order.objects.select_related(
            'rfq', 'offer', 'buyer', 'supplier'
        )
        
        filters = serializer.validated_data
        
        # Filterlar
        if filters.get('buyer_id'):
            queryset = queryset.filter(buyer_id=filters['buyer_id'])
        if filters.get('supplier_id'):
            queryset = queryset.filter(supplier_id=filters['supplier_id'])
        if filters.get('status'):
            queryset = queryset.filter(status=filters['status'])
        if filters.get('payment_method'):
            queryset = queryset.filter(payment_method=filters['payment_method'])
        if filters.get('min_amount'):
            queryset = queryset.filter(total_amount__gte=filters['min_amount'])
        if filters.get('max_amount'):
            queryset = queryset.filter(total_amount__lte=filters['max_amount'])
        if filters.get('delivery_date_from'):
            queryset = queryset.filter(delivery_date__gte=filters['delivery_date_from'])
        if filters.get('delivery_date_to'):
            queryset = queryset.filter(delivery_date__lte=filters['delivery_date_to'])
        
        # Qidiruv matni
        if filters.get('search'):
            search_term = filters['search']
            queryset = queryset.filter(
                Q(contract_url__icontains=search_term) |
                Q(invoice_url__icontains=search_term) |
                Q(payment_reference__icontains=search_term)
            )
        
        serializer = OrderListSerializer(queryset, many=True)
        return Response(serializer.data)
