"""
Company Member views - Kompaniya a'zolari uchun views
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from ..models import CompanyMember, Company
from ..serializers import (
    CompanyMemberSerializer,
    CompanyMemberCreateSerializer,
    CompanyMemberUpdateSerializer,
    CompanyMemberListSerializer
)


class CompanyMemberViewSet(viewsets.ModelViewSet):
    """
    Kompaniya a'zolari uchun ViewSet
    """
    queryset = CompanyMember.objects.all()
    serializer_class = CompanyMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Faqat joriy foydalanuvchi kompaniyasining a'zolarini qaytarish"""
        if hasattr(self.request.user, 'company'):
            return CompanyMember.objects.filter(
                company=self.request.user.company,
                is_active=True
            ).order_by('-joined_at')
        return CompanyMember.objects.none()
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return CompanyMemberListSerializer
        elif self.action == 'create':
            return CompanyMemberCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CompanyMemberUpdateSerializer
        return CompanyMemberSerializer
    
    def perform_create(self, serializer):
        """Kompaniya a'zosi yaratish"""
        # Company ni request.user.company dan olish
        if hasattr(self.request.user, 'company'):
            serializer.save(company=self.request.user.company)
        else:
            raise permissions.PermissionDenied("Sizda kompaniya yo'q")
    
    def perform_update(self, serializer):
        """Kompaniya a'zosi yangilash"""
        # Faqat o'z kompaniyasining a'zolarini yangilay oladi
        member = serializer.instance
        if member.company != self.request.user.company:
            raise permissions.PermissionDenied("Siz bu a'zoni yangilay olmaysiz")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Kompaniya a'zosi o'chirish (soft delete)"""
        # Faqat o'z kompaniyasining a'zolarini o'chira oladi
        if instance.company != self.request.user.company:
            raise permissions.PermissionDenied("Siz bu a'zoni o'chira olmaysiz")
        # Soft delete - is_active ni False qilish
        instance.is_active = False
        instance.save()
    
    @action(detail=False, methods=['get'])
    def my_company_members(self, request):
        """Joriy foydalanuvchi kompaniyasining a'zolari"""
        if not hasattr(request.user, 'company'):
            return Response({'error': 'Kompaniya topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        
        members = self.get_queryset()
        serializer = CompanyMemberListSerializer(members, many=True)
        return Response({
            'company_id': request.user.company.id,
            'company_name': request.user.company.name,
            'members': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def add_member(self, request):
        """Yangi a'zo qo'shish"""
        if not hasattr(request.user, 'company'):
            return Response({'error': 'Kompaniya topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CompanyMemberCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            member = serializer.save()
            response_serializer = CompanyMemberSerializer(member)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'])
    def update_member(self, request, pk=None):
        """A'zo ma'lumotlarini yangilash"""
        try:
            member = self.get_object()
        except CompanyMember.DoesNotExist:
            return Response({'error': 'A\'zo topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        
        if member.company != request.user.company:
            return Response({'error': 'Ruxsat yo\'q'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CompanyMemberUpdateSerializer(member, data=request.data, partial=True)
        if serializer.is_valid():
            member = serializer.save()
            response_serializer = CompanyMemberSerializer(member)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def remove_member(self, request, pk=None):
        """A'zoni o'chirish"""
        try:
            member = self.get_object()
        except CompanyMember.DoesNotExist:
            return Response({'error': 'A\'zo topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        
        if member.company != request.user.company:
            return Response({'error': 'Ruxsat yo\'q'}, status=status.HTTP_403_FORBIDDEN)
        
        # Soft delete
        member.is_active = False
        member.save()
        return Response({'message': 'A\'zo o\'chirildi'}, status=status.HTTP_200_OK)
