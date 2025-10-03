"""
Document serializers - Hujjatlar uchun serializers
"""

from rest_framework import serializers
from ..models import Document


class DocumentSerializer(serializers.ModelSerializer):
    """
    To'liq hujjat ma'lumotlari uchun serializer
    """
    user_info = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'file_url', 'file_size', 'document_type',
            'user', 'user_info', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'user_info', 'file_url', 'file_size',
            'created_at', 'updated_at'
        ]
    
    def get_user_info(self, obj):
        """Yuklagan foydalanuvchi ma'lumotlarini olish"""
        return {
            'id': obj.user.id,
            'full_name': obj.user.get_full_name(),
            'phone': obj.user.phone,
        }
    
    def get_file_url(self, obj):
        """Fayl URL"""
        return obj.file.url if obj.file else None
    
    def get_file_size(self, obj):
        """Fayl hajmi"""
        try:
            return obj.file.size if obj.file else None
        except:
            return None


class DocumentListSerializer(serializers.ModelSerializer):
    """
    Hujjatlar ro'yxati uchun serializer (qisqa ma'lumotlar)
    """
    user_info = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file_url', 'document_type',
            'user_info', 'created_at'
        ]
    
    def get_user_info(self, obj):
        """Yuklagan foydalanuvchi ma'lumotlarini olish"""
        return {
            'id': obj.user.id,
            'full_name': obj.user.get_full_name(),
        }
    
    def get_file_url(self, obj):
        """Fayl URL"""
        return obj.file.url if obj.file else None


class DocumentCreateSerializer(serializers.ModelSerializer):
    """
    Hujjat yaratish uchun serializer
    """
    
    class Meta:
        model = Document
        fields = [
            'title', 'file', 'document_type'
        ]
    
    def create(self, validated_data):
        """Hujjat yaratish"""
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


class DocumentUpdateSerializer(serializers.ModelSerializer):
    """
    Hujjat yangilash uchun serializer
    """
    
    class Meta:
        model = Document
        fields = [
            'title', 'document_type'
        ]
        read_only_fields = ['user']


class DocumentSearchSerializer(serializers.ModelSerializer):
    """
    Hujjat qidiruv uchun serializer
    """
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'document_type', 'user_info', 'created_at'
        ]
    
    def get_user_info(self, obj):
        """Yuklagan foydalanuvchi ma'lumotlarini olish"""
        return {
            'id': obj.user.id,
            'full_name': obj.user.get_full_name(),
        }