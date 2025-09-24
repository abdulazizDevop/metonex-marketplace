"""
Notification serializers - Xabarlar uchun serializers
"""

from rest_framework import serializers
from ..models import Notification, User


class NotificationSerializer(serializers.ModelSerializer):
    """
    To'liq xabar ma'lumotlari uchun serializer
    """
    recipient_info = serializers.SerializerMethodField()
    is_read = serializers.SerializerMethodField()
    is_sent = serializers.SerializerMethodField()
    is_failed = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'recipient_user', 'recipient_info', 'type', 'title', 'message',
            'delivery_method', 'related_rfq_id', 'related_offer_id', 'related_order_id',
            'read_at', 'sent_at', 'failed_at', 'error_message', 'is_read', 'is_sent',
            'is_failed', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'read_at', 'sent_at', 'failed_at', 'error_message',
            'is_read', 'is_sent', 'is_failed', 'created_at', 'updated_at'
        ]
    
    def get_recipient_info(self, obj):
        """Qabul qiluvchi ma'lumotlarini olish"""
        if obj.recipient_user:
            return {
                'id': obj.recipient_user.id,
                'full_name': obj.recipient_user.get_full_name(),
                'phone': obj.recipient_user.phone,
                'role': obj.recipient_user.role,
            }
        return None
    
    def get_is_read(self, obj):
        """Xabar o'qilganmi tekshirish"""
        return obj.is_read()
    
    def get_is_sent(self, obj):
        """Xabar yuborilganmi tekshirish"""
        return obj.is_sent()
    
    def get_is_failed(self, obj):
        """Xabar muvaffaqiyatsizmi tekshirish"""
        return obj.is_failed()


class NotificationListSerializer(serializers.ModelSerializer):
    """
    Xabarlar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    is_read = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'title', 'message', 'delivery_method',
            'related_rfq_id', 'related_offer_id', 'related_order_id',
            'is_read', 'created_at'
        ]
    
    def get_is_read(self, obj):
        """Xabar o'qilganmi tekshirish"""
        return obj.is_read()


class NotificationCreateSerializer(serializers.ModelSerializer):
    """
    Xabar yaratish uchun serializer
    """
    class Meta:
        model = Notification
        fields = [
            'recipient_user', 'type', 'title', 'message', 'delivery_method',
            'related_rfq_id', 'related_offer_id', 'related_order_id'
        ]
        extra_kwargs = {
            'recipient_user': {'required': True},
            'type': {'required': True},
            'title': {'required': True},
            'message': {'required': True},
        }
    
    def validate(self, attrs):
        """Validatsiya"""
        # Kamida bitta related object bo'lishi kerak
        related_objects = [
            attrs.get('related_rfq_id'),
            attrs.get('related_offer_id'),
            attrs.get('related_order_id')
        ]
        
        if not any(related_objects):
            raise serializers.ValidationError({
                'non_field_errors': 'Kamida bitta bog\'liq obyekt ko\'rsatilishi kerak'
            })
        
        return attrs
    
    def create(self, validated_data):
        """Xabar yaratish"""
        return Notification.objects.create(**validated_data)


class NotificationMarkReadSerializer(serializers.Serializer):
    """
    Xabarni o'qilgan deb belgilash uchun serializer
    """
    pass


class NotificationMarkUnreadSerializer(serializers.Serializer):
    """
    Xabarni o'qilmagan deb belgilash uchun serializer
    """
    pass


class NotificationBulkActionSerializer(serializers.Serializer):
    """
    Xabarlar ustida bulk amallar uchun serializer
    """
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        max_length=100
    )
    action = serializers.ChoiceField(choices=[
        ('mark_read', 'O\'qilgan deb belgilash'),
        ('mark_unread', 'O\'qilmagan deb belgilash'),
        ('delete', 'O\'chirish'),
    ])
    
    def validate_notification_ids(self, value):
        """Xabar ID lari validatsiyasi"""
        user = self.context['request'].user
        
        # Foydalanuvchiga tegishli xabarlarni tekshirish
        valid_ids = Notification.objects.filter(
            id__in=value,
            recipient_user=user
        ).values_list('id', flat=True)
        
        invalid_ids = set(value) - set(valid_ids)
        if invalid_ids:
            raise serializers.ValidationError({
                'notification_ids': f'Quyidagi xabarlar sizga tegishli emas: {list(invalid_ids)}'
            })
        
        return value


class NotificationSettingsSerializer(serializers.Serializer):
    """
    Xabar sozlamalari uchun serializer
    """
    push_enabled = serializers.BooleanField(default=True)
    sms_enabled = serializers.BooleanField(default=True)
    email_enabled = serializers.BooleanField(default=False)
    
    def validate(self, attrs):
        """Validatsiya"""
        # Kamida bitta kanal yoqilgan bo'lishi kerak
        if not any([
            attrs.get('push_enabled', True),
            attrs.get('sms_enabled', True),
            attrs.get('email_enabled', False)
        ]):
            raise serializers.ValidationError({
                'non_field_errors': 'Kamida bitta xabar kanali yoqilgan bo\'lishi kerak'
            })
        
        return attrs


class NotificationStatsSerializer(serializers.Serializer):
    """
    Xabar statistikasi uchun serializer
    """
    total_notifications = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
    read_notifications = serializers.IntegerField()
    failed_notifications = serializers.IntegerField()
    sent_notifications = serializers.IntegerField()
    notifications_by_type = serializers.DictField()
    notifications_by_delivery_method = serializers.DictField()
    
    class Meta:
        fields = [
            'total_notifications', 'unread_notifications', 'read_notifications',
            'failed_notifications', 'sent_notifications', 'notifications_by_type',
            'notifications_by_delivery_method'
        ]


class NotificationSearchSerializer(serializers.Serializer):
    """
    Xabarlar qidirish uchun serializer
    """
    type = serializers.ChoiceField(choices=Notification.NotificationType.choices, required=False)
    delivery_method = serializers.ChoiceField(choices=Notification.DeliveryMethod.choices, required=False)
    is_read = serializers.BooleanField(required=False)
    is_sent = serializers.BooleanField(required=False)
    is_failed = serializers.BooleanField(required=False)
    related_rfq_id = serializers.IntegerField(required=False)
    related_offer_id = serializers.IntegerField(required=False)
    related_order_id = serializers.IntegerField(required=False)
    created_from = serializers.DateTimeField(required=False)
    created_to = serializers.DateTimeField(required=False)
    search = serializers.CharField(max_length=200, required=False)
    
    def validate(self, attrs):
        """Validatsiya"""
        if attrs.get('created_from') and attrs.get('created_to'):
            if attrs['created_from'] > attrs['created_to']:
                raise serializers.ValidationError({
                    'created_to': 'Oxirgi vaqt boshlang\'ich vaqtdan keyin bo\'lishi kerak'
                })
        
        return attrs
