from rest_framework import serializers
from api.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    related_request_title = serializers.CharField(source='related_request.title', read_only=True)
    related_order_id = serializers.CharField(source='related_order.id', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            "id",
            "recipient_user",
            "recipient_company",
            "type",
            "type_display",
            "message",
            "related_request",
            "related_request_title",
            "related_order",
            "related_order_id",
            "read_at",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

