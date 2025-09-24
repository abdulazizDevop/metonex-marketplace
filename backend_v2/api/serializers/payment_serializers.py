"""
Payment serializers - To'lovlar uchun serializers
"""

from rest_framework import serializers
from ..models import Payment, Order, User


class PaymentSerializer(serializers.ModelSerializer):
    """
    To'liq to'lov ma'lumotlari uchun serializer
    """
    order_info = serializers.SerializerMethodField()
    is_escrow_payment = serializers.SerializerMethodField()
    can_be_released = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_info', 'amount', 'payment_method', 'status',
            'payment_proof_url', 'escrow_reference', 'transaction_id',
            'gateway_response', 'fee_amount', 'currency', 'exchange_rate',
            'processed_at', 'is_escrow_payment', 'can_be_released', 'created_at'
        ]
        read_only_fields = [
            'id', 'processed_at', 'is_escrow_payment', 'can_be_released', 'created_at'
        ]
    
    def get_order_info(self, obj):
        """Buyurtma ma'lumotlarini olish"""
        return {
            'id': obj.order.id,
            'buyer_name': obj.order.buyer.get_full_name(),
            'supplier_name': obj.order.supplier.get_full_name(),
            'total_amount': obj.order.total_amount,
            'status': obj.order.status,
        }
    
    def get_is_escrow_payment(self, obj):
        """Escrow to'lovimi tekshirish"""
        return obj.is_escrow_payment()
    
    def get_can_be_released(self, obj):
        """Ozod qilinadimi tekshirish"""
        return obj.can_be_released()


class PaymentCreateSerializer(serializers.ModelSerializer):
    """
    To'lov yaratish uchun serializer
    """
    class Meta:
        model = Payment
        fields = [
            'order', 'amount', 'payment_method', 'payment_proof_url',
            'transaction_id', 'gateway_response', 'fee_amount',
            'currency', 'exchange_rate'
        ]
        extra_kwargs = {
            'order': {'required': True},
            'amount': {'required': True},
            'payment_method': {'required': True},
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        user = self.context['request'].user
        order = attrs['order']
        
        # Sotib oluvchi tekshirish
        if user.role != User.UserRole.BUYER:
            raise serializers.ValidationError({
                'buyer': 'Faqat sotib oluvchilar to\'lov amalga oshira oladi'
            })
        
        # Buyurtma sotib oluvchiga tegishli bo'lishi kerak
        if order.buyer != user:
            raise serializers.ValidationError({
                'order': 'Bu buyurtma sizga tegishli emas'
            })
        
        # Buyurtma to'lov kutayotgan holatda bo'lishi kerak
        if order.status != Order.OrderStatus.AWAITING_PAYMENT:
            raise serializers.ValidationError({
                'order': 'Bu buyurtma to\'lov kutmaydi'
            })
        
        # Summa buyurtma summasiga mos kelishi kerak
        if attrs['amount'] != order.total_amount:
            raise serializers.ValidationError({
                'amount': f'Summa buyurtma summasiga mos kelmaydi. Kutilayotgan: {order.total_amount}'
            })
        
        return attrs
    
    def create(self, validated_data):
        """To'lov yaratish"""
        return Payment.objects.create(**validated_data)


class PaymentListSerializer(serializers.ModelSerializer):
    """
    To'lovlar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    order_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order_info', 'amount', 'payment_method', 'status',
            'currency', 'created_at'
        ]
    
    def get_order_info(self, obj):
        """Buyurtma ma'lumotlarini olish"""
        return {
            'id': obj.order.id,
            'buyer_name': obj.order.buyer.get_full_name(),
            'supplier_name': obj.order.supplier.get_full_name(),
        }


class PaymentConfirmSerializer(serializers.Serializer):
    """
    To'lovni tasdiqlash uchun serializer
    """
    confirmed_by = serializers.ChoiceField(choices=[
        ('buyer', 'Sotib oluvchi'),
        ('supplier', 'Sotuvchi'),
    ])
    
    def validate(self, attrs):
        """Validatsiya"""
        payment = self.context['payment']
        user = self.context['request'].user
        
        # Faqat buyurtma ishtirokchilari tasdiqlay oladi
        if user not in [payment.order.buyer, payment.order.supplier]:
            raise serializers.ValidationError({
                'confirmed_by': 'Siz bu to\'lovni tasdiqlay olmaysiz'
            })
        
        # Tasdiqlovchi to'g'ri tanlanganmi
        if attrs['confirmed_by'] == 'buyer' and user != payment.order.buyer:
            raise serializers.ValidationError({
                'confirmed_by': 'Siz sotib oluvchi emassiz'
            })
        
        if attrs['confirmed_by'] == 'supplier' and user != payment.order.supplier:
            raise serializers.ValidationError({
                'confirmed_by': 'Siz sotuvchi emassiz'
            })
        
        return attrs


class PaymentReleaseSerializer(serializers.Serializer):
    """
    Escrow to'lovini ozod qilish uchun serializer
    """
    pass


class PaymentRefundSerializer(serializers.Serializer):
    """
    To'lovni qaytarish uchun serializer
    """
    reason = serializers.CharField(max_length=500, required=True)
    
    def validate(self, attrs):
        """Validatsiya"""
        payment = self.context['payment']
        user = self.context['request'].user
        
        # Faqat buyurtma ishtirokchilari qaytara oladi
        if user not in [payment.order.buyer, payment.order.supplier]:
            raise serializers.ValidationError({
                'reason': 'Siz bu to\'lovni qaytara olmaysiz'
            })
        
        return attrs


class PaymentSearchSerializer(serializers.Serializer):
    """
    To'lovlar qidirish uchun serializer
    """
    order_id = serializers.IntegerField(required=False)
    buyer_id = serializers.IntegerField(required=False)
    supplier_id = serializers.IntegerField(required=False)
    status = serializers.ChoiceField(choices=Payment.PaymentStatus.choices, required=False)
    payment_method = serializers.ChoiceField(choices=Payment.PaymentMethod.choices, required=False)
    min_amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    max_amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    currency = serializers.CharField(max_length=3, required=False)
    created_from = serializers.DateTimeField(required=False)
    created_to = serializers.DateTimeField(required=False)
    search = serializers.CharField(max_length=200, required=False)
    
    def validate(self, attrs):
        """Validatsiya"""
        if attrs.get('min_amount') and attrs.get('max_amount'):
            if attrs['min_amount'] > attrs['max_amount']:
                raise serializers.ValidationError({
                    'max_amount': 'Maksimal summa minimal summa dan katta bo\'lishi kerak'
                })
        
        if attrs.get('created_from') and attrs.get('created_to'):
            if attrs['created_from'] > attrs['created_to']:
                raise serializers.ValidationError({
                    'created_to': 'Oxirgi vaqt boshlang\'ich vaqtdan keyin bo\'lishi kerak'
                })
        
        return attrs


class PaymentAnalyticsSerializer(serializers.Serializer):
    """
    To'lov analytics uchun serializer
    """
    total_payments = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    successful_payments = serializers.IntegerField()
    failed_payments = serializers.IntegerField()
    pending_payments = serializers.IntegerField()
    escrow_payments = serializers.IntegerField()
    cash_payments = serializers.IntegerField()
    average_payment_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    success_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    class Meta:
        fields = [
            'total_payments', 'total_amount', 'successful_payments', 'failed_payments',
            'pending_payments', 'escrow_payments', 'cash_payments',
            'average_payment_amount', 'success_rate'
        ]
