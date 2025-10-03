"""
Company Member serializers - Kompaniya a'zolari uchun serializers
"""

from rest_framework import serializers
from ..models import CompanyMember


class CompanyMemberSerializer(serializers.ModelSerializer):
    """Kompaniya a'zosi uchun serializer"""
    
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = CompanyMember
        fields = [
            'id', 'name', 'role', 'role_display', 'phone', 
            'telegram_username', 'email', 'is_active', 
            'joined_at', 'updated_at', 'company_name'
        ]
        read_only_fields = ['id', 'joined_at', 'updated_at']


class CompanyMemberCreateSerializer(serializers.ModelSerializer):
    """Kompaniya a'zosi yaratish uchun serializer"""
    
    class Meta:
        model = CompanyMember
        fields = [
            'name', 'role', 'phone', 'telegram_username', 'email'
        ]

    def create(self, validated_data):
        # Company ni request.user.company dan olish
        company = self.context['request'].user.company
        validated_data['company'] = company
        return super().create(validated_data)


class CompanyMemberUpdateSerializer(serializers.ModelSerializer):
    """Kompaniya a'zosi yangilash uchun serializer"""
    
    class Meta:
        model = CompanyMember
        fields = [
            'name', 'role', 'phone', 'telegram_username', 'email', 'is_active'
        ]


class CompanyMemberListSerializer(serializers.ModelSerializer):
    """Kompaniya a'zolari ro'yxati uchun serializer"""
    
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = CompanyMember
        fields = [
            'id', 'name', 'role', 'role_display', 'phone', 
            'telegram_username', 'email', 'is_active', 'joined_at'
        ]
