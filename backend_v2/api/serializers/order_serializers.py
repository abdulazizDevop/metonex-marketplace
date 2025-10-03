"""
Order serializers - Buyurtmalar uchun serializers
"""

from rest_framework import serializers
from ..models import Order, OrderDocument, OrderStatusHistory, User, RFQ, Offer, Document


class OrderSerializer(serializers.ModelSerializer):
    """
    To'liq buyurtma ma'lumotlari uchun serializer
    """
    buyer_info = serializers.SerializerMethodField()
    supplier_info = serializers.SerializerMethodField()
    rfq_info = serializers.SerializerMethodField()
    offer_info = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    can_be_cancelled = serializers.SerializerMethodField()
    contract_document_url = serializers.SerializerMethodField()
    invoice_document_url = serializers.SerializerMethodField()
    ttn_document_url = serializers.SerializerMethodField()
    payment_proof_document_url = serializers.SerializerMethodField()
    payment_confirmed_by_seller = serializers.BooleanField(read_only=True)
    payment_confirmed_at = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'rfq', 'rfq_info', 'offer', 'offer_info', 'buyer', 'buyer_info',
            'supplier', 'supplier_info', 'total_amount', 'payment_method', 'status',
            'contract_document', 'invoice_document', 'ttn_document', 'payment_proof_document',
            'contract_document_url', 'invoice_document_url', 'ttn_document_url', 'payment_proof_document_url',
            'payment_confirmed_by_seller', 'payment_confirmed_at',
            'delivery_date', 'delivery_address', 'delivery_contact', 'tracking_number',
            'estimated_delivery_date', 'actual_delivery_date', 'payment_status',
            'can_be_cancelled', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'buyer', 'supplier', 'payment_status', 'can_be_cancelled',
            'created_at', 'updated_at'
        ]
    
    def get_buyer_info(self, obj):
        """Sotib oluvchi ma'lumotlarini olish"""
        return {
            'id': obj.buyer.id,
            'full_name': obj.buyer.get_full_name(),
            'phone': obj.buyer.phone,
        }
    
    def get_supplier_info(self, obj):
        """Sotuvchi ma'lumotlarini olish"""
        return {
            'id': obj.supplier.id,
            'full_name': obj.supplier.get_full_name(),
            'phone': obj.supplier.phone,
            'supplier_type': obj.supplier.supplier_type,
        }
    
    def get_rfq_info(self, obj):
        """RFQ ma'lumotlarini olish"""
        return {
            'id': obj.rfq.id,
            'category_name': obj.rfq.category.name,
            'brand': obj.rfq.brand,
            'grade': obj.rfq.grade,
            'volume': obj.rfq.volume,
            'unit_symbol': obj.rfq.unit.symbol if obj.rfq.unit else None,
            'delivery_location': obj.rfq.delivery_location,
        }
    
    def get_offer_info(self, obj):
        """Taklif ma'lumotlarini olish"""
        return {
            'id': obj.offer.id,
            'price_per_unit': obj.offer.price_per_unit,
            'total_amount': obj.offer.total_amount,
            'delivery_terms': obj.offer.delivery_terms,
            'delivery_date': obj.offer.delivery_date,
        }
    
    def get_payment_status(self, obj):
        """To'lov holatini olish"""
        return obj.get_payment_status()
    
    def get_can_be_cancelled(self, obj):
        """Bekor qilinadimi tekshirish"""
        return obj.can_be_cancelled()
    
    def get_contract_document_url(self, obj):
        """Shartnoma hujjati URL"""
        return obj.contract_document.file.url if obj.contract_document else None
    
    def get_invoice_document_url(self, obj):
        """Hisob-faktura hujjati URL"""
        return obj.invoice_document.file.url if obj.invoice_document else None
    
    def get_ttn_document_url(self, obj):
        """TTN hujjati URL"""
        return obj.ttn_document.file.url if obj.ttn_document else None
    
    def get_payment_proof_document_url(self, obj):
        """To'lov hujjati URL"""
        return obj.payment_proof_document.file.url if obj.payment_proof_document else None


class OrderListSerializer(serializers.ModelSerializer):
    """
    Buyurtmalar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    buyer_info = serializers.SerializerMethodField()
    supplier_info = serializers.SerializerMethodField()
    rfq_info = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'buyer_info', 'supplier_info', 'rfq_info', 'total_amount',
            'payment_method', 'status', 'delivery_date', 'payment_status',
            'created_at'
        ]
    
    def get_buyer_info(self, obj):
        """Sotib oluvchi ma'lumotlarini olish"""
        return {
            'id': obj.buyer.id,
            'full_name': obj.buyer.get_full_name(),
        }
    
    def get_supplier_info(self, obj):
        """Sotuvchi ma'lumotlarini olish"""
        return {
            'id': obj.supplier.id,
            'full_name': obj.supplier.get_full_name(),
            'supplier_type': obj.supplier.supplier_type,
        }
    
    def get_rfq_info(self, obj):
        """RFQ ma'lumotlarini olish"""
        return {
            'id': obj.rfq.id,
            'category_name': obj.rfq.category.name,
            'brand': obj.rfq.brand,
            'grade': obj.rfq.grade,
            'volume': obj.rfq.volume,
            'unit_symbol': obj.rfq.unit.symbol if obj.rfq.unit else None,
        }
    
    def get_payment_status(self, obj):
        """To'lov holatini olish"""
        return obj.get_payment_status()


class OrderDetailSerializer(serializers.ModelSerializer):
    """
    Buyurtma batafsil ma'lumotlari uchun serializer
    """
    buyer_info = serializers.SerializerMethodField()
    supplier_info = serializers.SerializerMethodField()
    rfq_info = serializers.SerializerMethodField()
    offer_info = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
    status_history = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    can_be_cancelled = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'rfq', 'rfq_info', 'offer', 'offer_info', 'buyer', 'buyer_info',
            'supplier', 'supplier_info', 'total_amount', 'payment_method', 'status',
            'contract_url', 'invoice_url', 'payment_reference', 'delivery_date',
            'delivery_address', 'delivery_contact', 'tracking_number',
            'estimated_delivery_date', 'actual_delivery_date', 'documents',
            'status_history', 'payment_status', 'can_be_cancelled',
            'created_at', 'updated_at'
        ]
    
    def get_buyer_info(self, obj):
        """Sotib oluvchi ma'lumotlarini olish"""
        return {
            'id': obj.buyer.id,
            'full_name': obj.buyer.get_full_name(),
            'phone': obj.buyer.phone,
        }
    
    def get_supplier_info(self, obj):
        """Sotuvchi ma'lumotlarini olish"""
        return {
            'id': obj.supplier.id,
            'full_name': obj.supplier.get_full_name(),
            'phone': obj.supplier.phone,
            'supplier_type': obj.supplier.supplier_type,
        }
    
    def get_rfq_info(self, obj):
        """RFQ ma'lumotlarini olish"""
        return {
            'id': obj.rfq.id,
            'category_name': obj.rfq.category.name,
            'brand': obj.rfq.brand,
            'grade': obj.rfq.grade,
            'volume': obj.rfq.volume,
            'unit_symbol': obj.rfq.unit.symbol if obj.rfq.unit else None,
            'delivery_location': obj.rfq.delivery_location,
        }
    
    def get_offer_info(self, obj):
        """Taklif ma'lumotlarini olish"""
        return {
            'id': obj.offer.id,
            'price_per_unit': obj.offer.price_per_unit,
            'total_amount': obj.offer.total_amount,
            'delivery_terms': obj.offer.delivery_terms,
            'delivery_date': obj.offer.delivery_date,
        }
    
    def get_documents(self, obj):
        """Hujjatlarni olish"""
        documents = obj.documents.all().order_by('-uploaded_at')
        return OrderDocumentSerializer(documents, many=True).data
    
    def get_status_history(self, obj):
        """Holat tarixini olish"""
        history = obj.status_history.all().order_by('-created_at')
        return OrderStatusHistorySerializer(history, many=True).data
    
    def get_payment_status(self, obj):
        """To'lov holatini olish"""
        return obj.get_payment_status()
    
    def get_can_be_cancelled(self, obj):
        """Bekor qilinadimi tekshirish"""
        return obj.can_be_cancelled()


class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Buyurtma yaratish uchun serializer
    """
    class Meta:
        model = Order
        fields = [
            'rfq', 'offer', 'delivery_address', 'delivery_contact',
            'estimated_delivery_date'
        ]
        extra_kwargs = {
            'rfq': {'required': True},
            'offer': {'required': True},
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        user = self.context['request'].user
        rfq = attrs['rfq']
        offer = attrs['offer']
        
        # Sotib oluvchi tekshirish
        if user.role != User.UserRole.BUYER:
            raise serializers.ValidationError({
                'buyer': 'Faqat sotib oluvchilar buyurtma yarata oladi'
            })
        
        # RFQ sotib oluvchiga tegishli bo'lishi kerak
        if rfq.buyer != user:
            raise serializers.ValidationError({
                'rfq': 'Bu RFQ sizga tegishli emas'
            })
        
        # Taklif qabul qilingan bo'lishi kerak
        if offer.status != Offer.OfferStatus.ACCEPTED:
            raise serializers.ValidationError({
                'offer': 'Faqat qabul qilingan takliflar uchun buyurtma yarata olasiz'
            })
        
        # Taklif RFQ ga tegishli bo'lishi kerak
        if offer.rfq != rfq:
            raise serializers.ValidationError({
                'offer': 'Taklif RFQ ga tegishli emas'
            })
        
        return attrs
    
    def create(self, validated_data):
        """Buyurtma yaratish"""
        rfq = validated_data['rfq']
        offer = validated_data['offer']
        
        validated_data.update({
            'buyer': self.context['request'].user,
            'supplier': offer.supplier,
            'total_amount': offer.total_amount,
            'payment_method': rfq.payment_method,
            'delivery_date': offer.delivery_date,
        })
        
        return Order.objects.create(**validated_data)


class OrderUpdateSerializer(serializers.ModelSerializer):
    """
    Buyurtma yangilash uchun serializer
    """
    class Meta:
        model = Order
        fields = [
            'delivery_address', 'delivery_contact', 'tracking_number',
            'estimated_delivery_date', 'actual_delivery_date'
        ]


class OrderStatusUpdateSerializer(serializers.Serializer):
    """
    Buyurtma holatini yangilash uchun serializer
    """
    status = serializers.ChoiceField(choices=Order.OrderStatus.choices)
    comment = serializers.CharField(max_length=500, required=False)
    
    def validate_status(self, value):
        """Holat validatsiyasi"""
        order = self.context['order']
        user = self.context['request'].user
        
        # Holat o'zgarishini tekshirish
        if value == Order.OrderStatus.CANCELLED:
            if not order.can_be_cancelled():
                raise serializers.ValidationError('Bu buyurtma bekor qilinmaydi')
        
        return value


class OrderDocumentSerializer(serializers.ModelSerializer):
    """
    Buyurtma hujjatlari uchun serializer
    """
    uploaded_by_info = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderDocument
        fields = [
            'id', 'order', 'document_type', 'file_url', 'uploaded_by',
            'uploaded_by_info', 'uploaded_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']
    
    def get_uploaded_by_info(self, obj):
        """Yuklagan shaxs ma'lumotlarini olish"""
        return {
            'id': obj.uploaded_by.id,
            'full_name': obj.uploaded_by.get_full_name(),
            'role': obj.uploaded_by.role,
        }
    
    def create(self, validated_data):
        """Hujjat yaratish"""
        validated_data['uploaded_by'] = self.context['request'].user
        return OrderDocument.objects.create(**validated_data)


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """
    Buyurtma holati tarixi uchun serializer
    """
    created_by_info = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderStatusHistory
        fields = [
            'id', 'order', 'status', 'comment', 'created_by', 'created_by_info',
            'created_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at']
    
    def get_created_by_info(self, obj):
        """Yaratgan shaxs ma'lumotlarini olish"""
        return {
            'id': obj.created_by.id,
            'full_name': obj.created_by.get_full_name(),
            'role': obj.created_by.role,
        }
    
    def create(self, validated_data):
        """Holat tarixi yaratish"""
        validated_data['created_by'] = self.context['request'].user
        return OrderStatusHistory.objects.create(**validated_data)


class OrderSearchSerializer(serializers.Serializer):
    """
    Buyurtmalar qidirish uchun serializer
    """
    buyer_id = serializers.IntegerField(required=False)
    supplier_id = serializers.IntegerField(required=False)
    status = serializers.ChoiceField(choices=Order.OrderStatus.choices, required=False)
    payment_method = serializers.CharField(max_length=20, required=False)
    min_amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    max_amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    delivery_date_from = serializers.DateField(required=False)
    delivery_date_to = serializers.DateField(required=False)
    search = serializers.CharField(max_length=200, required=False)
    
    def validate(self, attrs):
        """Validatsiya"""
        if attrs.get('min_amount') and attrs.get('max_amount'):
            if attrs['min_amount'] > attrs['max_amount']:
                raise serializers.ValidationError({
                    'max_amount': 'Maksimal summa minimal summa dan katta bo\'lishi kerak'
                })
        
        if attrs.get('delivery_date_from') and attrs.get('delivery_date_to'):
            if attrs['delivery_date_from'] > attrs['delivery_date_to']:
                raise serializers.ValidationError({
                    'delivery_date_to': 'Oxirgi sana boshlang\'ich sanadan keyin bo\'lishi kerak'
                })
        
        return attrs
