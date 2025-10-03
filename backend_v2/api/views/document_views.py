"""
Document views - Hujjatlar uchun views
"""

from django.db.models import Q
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

from ..models import Document
from ..serializers import (
    DocumentSerializer,
    DocumentListSerializer,
    DocumentCreateSerializer,
    DocumentUpdateSerializer,
    DocumentSearchSerializer
)


class DocumentViewSet(viewsets.ModelViewSet):
    """
    Hujjatlar uchun ViewSet
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['document_type', 'user']
    search_fields = ['title']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Document.objects.select_related('user')
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return DocumentListSerializer
        elif self.action == 'create':
            return DocumentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DocumentUpdateSerializer
        return DocumentSerializer
    
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
        """Hujjat yaratish"""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Hujjat yangilash"""
        # Faqat hujjat egasi yoki admin yangilay oladi
        document = serializer.instance
        if document.user != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu hujjatni yangilay olmaysiz")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Hujjat o'chirish"""
        # Faqat hujjat egasi yoki admin o'chira oladi
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Siz bu hujjatni o'chira olmaysiz")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def my_documents(self, request):
        """Joriy foydalanuvchi hujjatlari"""
        documents = self.get_queryset().filter(user=request.user)
        serializer = DocumentListSerializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Hujjat turi bo'yicha filtrlash"""
        document_type = request.query_params.get('type')
        if document_type:
            documents = self.get_queryset().filter(document_type=document_type)
            serializer = DocumentListSerializer(documents, many=True)
            return Response(serializer.data)
        return Response({'error': 'Hujjat turi belgilanmagan'}, status=status.HTTP_400_BAD_REQUEST)


class DocumentListView(viewsets.ReadOnlyModelViewSet):
    """
    Hujjatlar ro'yxati uchun ViewSet
    """
    queryset = Document.objects.all()
    serializer_class = DocumentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['document_type', 'user']
    search_fields = ['title']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Document.objects.select_related('user')


class DocumentSearchView(APIView):
    """
    Hujjat qidiruv uchun View
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Hujjat qidiruv"""
        query = request.query_params.get('q', '')
        document_type = request.query_params.get('type', '')
        
        documents = Document.objects.all()
        
        if query:
            documents = documents.filter(
                Q(title__icontains=query)
            )
        
        if document_type:
            documents = documents.filter(document_type=document_type)
        
        documents = documents.select_related('user')[:50]  # Limit 50 ta
        serializer = DocumentSearchSerializer(documents, many=True)
        return Response(serializer.data)