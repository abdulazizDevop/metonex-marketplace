"""
Document views - Hujjatlar uchun API views
"""

from rest_framework import status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from django.conf import settings
import os
import mimetypes
import logging

from ..models import Document, DocumentShare, User, Order, Company
from ..serializers.document_serializers import (
    DocumentSerializer,
    DocumentListSerializer,
    DocumentCreateSerializer,
    DocumentUpdateSerializer,
    DocumentVerificationSerializer,
    DocumentShareSerializer,
    DocumentSearchSerializer
)

logger = logging.getLogger(__name__)


class DocumentViewSet(ModelViewSet):
    """
    Hujjatlar uchun to'liq CRUD API
    """
    queryset = Document.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        """Action ga qarab serializer tanlash"""
        if self.action == 'list':
            return DocumentListSerializer
        elif self.action == 'create':
            return DocumentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DocumentUpdateSerializer
        elif self.action == 'verify':
            return DocumentVerificationSerializer
        elif self.action == 'share':
            return DocumentShareSerializer
        elif self.action == 'search':
            return DocumentSearchSerializer
        return DocumentSerializer

    def get_queryset(self):
        """Foydalanuvchiga tegishli hujjatlarni qaytarish"""
        user = self.request.user
        
        if user.is_staff:
            # Admin barcha hujjatlarni ko'ra oladi
            return Document.objects.all().select_related(
                'user', 'order', 'company', 'verified_by'
            ).prefetch_related('shares')
        
        # Oddiy foydalanuvchi faqat o'z hujjatlari va ulashilgan hujjatlarni ko'ra oladi
        user_documents = Q(user=user)
        order_documents = Q(order__buyer=user) | Q(order__supplier=user)
        company_documents = Q(company__user=user)
        shared_documents = Q(shares__shared_with=user, shares__is_active=True)
        
        return Document.objects.filter(
            user_documents | order_documents | company_documents | shared_documents
        ).distinct().select_related(
            'user', 'order', 'company', 'verified_by'
        ).prefetch_related('shares')

    def perform_create(self, serializer):
        """Hujjat yaratishda qo'shimcha ma'lumotlar qo'shish"""
        try:
            document = serializer.save()
            logger.info(f"Document created: {document.id} by user: {self.request.user.id}")
            
            # Auto-generate title if not provided
            if not document.title:
                document.title = f"{document.get_document_type_display()} - {document.file_name}"
                document.save(update_fields=['title'])
                
        except Exception as e:
            logger.error(f"Error creating document: {str(e)}")
            raise

    def destroy(self, request, *args, **kwargs):
        """Hujjatni o'chirish"""
        document = self.get_object()
        
        # Ruxsat tekshiruvi
        if not document.can_be_deleted_by(request.user):
            return Response(
                {'detail': 'Siz bu hujjatni o\'chira olmaysiz'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Faylni ham o'chirish
            if document.file and os.path.isfile(document.file.path):
                os.remove(document.file.path)
            
            document.delete()
            logger.info(f"Document deleted: {kwargs.get('pk')} by user: {request.user.id}")
            
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            return Response(
                {'detail': 'Hujjat o\'chirishda xatolik'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'], url_path='download')
    def download(self, request, pk=None):
        """Hujjatni yuklab olish"""
        document = self.get_object()
        
        # Ko'rish ruxsati tekshiruvi
        if not document.can_be_viewed_by(request.user):
            return Response(
                {'detail': 'Siz bu hujjatni yuklab ola olmaysiz'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            if not document.file or not os.path.isfile(document.file.path):
                raise Http404("Fayl topilmadi")
            
            # MIME type aniqlash
            content_type, _ = mimetypes.guess_type(document.file.path)
            if not content_type:
                content_type = 'application/octet-stream'
            
            # Faylni o'qish
            with open(document.file.path, 'rb') as f:
                response = HttpResponse(f.read(), content_type=content_type)
                response['Content-Disposition'] = f'attachment; filename="{document.file_name}"'
                response['Content-Length'] = document.file_size
                
            logger.info(f"Document downloaded: {document.id} by user: {request.user.id}")
            return response
            
        except Exception as e:
            logger.error(f"Error downloading document {pk}: {str(e)}")
            return Response(
                {'detail': 'Fayl yuklab olishda xatolik'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], url_path='verify')
    def verify(self, request, pk=None):
        """Hujjatni tasdiqlash yoki rad etish (Admin uchun)"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Faqat adminlar hujjatlarni tasdiqlay oladi'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        document = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            action_type = serializer.validated_data['action']
            reason = serializer.validated_data.get('reason', '')
            
            try:
                if action_type == 'verify':
                    document.mark_as_verified(request.user)
                    message = 'Hujjat tasdiqlandi'
                else:  # reject
                    document.mark_as_rejected(reason, request.user)
                    message = 'Hujjat rad etildi'
                
                logger.info(f"Document {action_type}: {document.id} by admin: {request.user.id}")
                
                return Response({
                    'message': message,
                    'document': DocumentSerializer(document, context={'request': request}).data
                })
            except Exception as e:
                logger.error(f"Error verifying document {pk}: {str(e)}")
                return Response(
                    {'detail': 'Hujjat tasdiqlashda xatolik'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='share')
    def share(self, request, pk=None):
        """Hujjatni boshqa foydalanuvchi bilan ulashish"""
        document = self.get_object()
        
        # Ko'rish ruxsati tekshiruvi
        if not document.can_be_viewed_by(request.user):
            return Response(
                {'detail': 'Siz bu hujjatni ulasha olmaysiz'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = DocumentShareSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Document ni serializer ma'lumotlariga qo'shish
            serializer.validated_data['document'] = document
            
            try:
                share = serializer.save()
                logger.info(f"Document shared: {document.id} with user: {share.shared_with.id}")
                
                return Response(
                    DocumentShareSerializer(share, context={'request': request}).data,
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                logger.error(f"Error sharing document {pk}: {str(e)}")
                return Response(
                    {'detail': 'Hujjat ulashishda xatolik'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='my-documents')
    def my_documents(self, request):
        """Foydalanuvchining barcha hujjatlari"""
        documents = Document.objects.filter(user=request.user).select_related(
            'order', 'company', 'verified_by'
        )
        
        # Filter by document type if provided
        doc_type = request.query_params.get('type')
        if doc_type:
            documents = documents.filter(document_type=doc_type)
        
        serializer = DocumentListSerializer(
            documents, many=True, context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='order-documents/(?P<order_id>[^/.]+)')
    def order_documents(self, request, order_id=None):
        """Buyurtma bilan bog'liq hujjatlar"""
        try:
            order = get_object_or_404(Order, id=order_id)
            
            # Buyurtma ruxsati tekshiruvi
            if not (order.buyer == request.user or order.supplier == request.user or request.user.is_staff):
                return Response(
                    {'detail': 'Siz bu buyurtma hujjatlarini ko\'ra olmaysiz'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            documents = Document.objects.filter(order=order).select_related(
                'user', 'verified_by'
            )
            
            serializer = DocumentListSerializer(
                documents, many=True, context={'request': request}
            )
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error getting order documents {order_id}: {str(e)}")
            return Response(
                {'detail': 'Buyurtma hujjatlarini olishda xatolik'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='company-documents/(?P<company_id>[^/.]+)')
    def company_documents(self, request, company_id=None):
        """Kompaniya bilan bog'liq hujjatlar"""
        try:
            company = get_object_or_404(Company, id=company_id)
            
            # Kompaniya ruxsati tekshiruvi
            if not (company.user == request.user or request.user.is_staff):
                return Response(
                    {'detail': 'Siz bu kompaniya hujjatlarini ko\'ra olmaysiz'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            documents = Document.objects.filter(company=company).select_related(
                'user', 'verified_by'
            )
            
            serializer = DocumentListSerializer(
                documents, many=True, context={'request': request}
            )
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error getting company documents {company_id}: {str(e)}")
            return Response(
                {'detail': 'Kompaniya hujjatlarini olishda xatolik'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], url_path='search')
    def search(self, request):
        """Hujjatlar qidirish"""
        serializer = DocumentSearchSerializer(data=request.data)
        
        if serializer.is_valid():
            filters = Q()
            data = serializer.validated_data
            
            # Basic filters
            if data.get('document_type'):
                filters &= Q(document_type=data['document_type'])
            
            if data.get('status'):
                filters &= Q(status=data['status'])
            
            if data.get('source'):
                filters &= Q(source=data['source'])
            
            if data.get('user_id'):
                filters &= Q(user_id=data['user_id'])
            
            if data.get('order_id'):
                filters &= Q(order_id=data['order_id'])
            
            if data.get('company_id'):
                filters &= Q(company_id=data['company_id'])
            
            # Date range filters
            if data.get('created_from'):
                filters &= Q(created_at__gte=data['created_from'])
            
            if data.get('created_to'):
                filters &= Q(created_at__lte=data['created_to'])
            
            # Expiry filter
            if data.get('is_expired') is not None:
                if data['is_expired']:
                    filters &= Q(expires_at__lt=timezone.now())
                else:
                    filters &= Q(Q(expires_at__gte=timezone.now()) | Q(expires_at__isnull=True))
            
            # Text search
            if data.get('search'):
                search_term = data['search']
                search_filters = (
                    Q(title__icontains=search_term) |
                    Q(description__icontains=search_term) |
                    Q(file_name__icontains=search_term)
                )
                filters &= search_filters
            
            # Apply to queryset
            queryset = self.get_queryset().filter(filters)
            
            serializer = DocumentListSerializer(
                queryset, many=True, context={'request': request}
            )
            return Response({
                'count': queryset.count(),
                'results': serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='shared-with-me')
    def shared_with_me(self, request):
        """Men bilan ulashilgan hujjatlar"""
        shares = DocumentShare.objects.filter(
            shared_with=request.user,
            is_active=True
        ).select_related('document', 'shared_by')
        
        # Expired shares ni filtrlash
        active_shares = [
            share for share in shares 
            if not share.is_expired
        ]
        
        serializer = DocumentShareSerializer(
            active_shares, many=True, context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='shared-by-me')
    def shared_by_me(self, request):
        """Men ulashgan hujjatlar"""
        shares = DocumentShare.objects.filter(
            shared_by=request.user
        ).select_related('document', 'shared_with')
        
        serializer = DocumentShareSerializer(
            shares, many=True, context={'request': request}
        )
        return Response(serializer.data)


class DocumentShareViewSet(ModelViewSet):
    """
    Hujjat ulashish uchun to'liq CRUD API
    """
    queryset = DocumentShare.objects.all()
    serializer_class = DocumentShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Foydalanuvchiga tegishli ulashishlarni qaytarish"""
        user = self.request.user
        
        if user.is_staff:
            return DocumentShare.objects.all().select_related(
                'document', 'shared_with', 'shared_by'
            )
        
        # Foydalanuvchi faqat o'z ulashishlari va o'ziga ulashilgan hujjatlarni ko'ra oladi
        return DocumentShare.objects.filter(
            Q(shared_by=user) | Q(shared_with=user)
        ).select_related('document', 'shared_with', 'shared_by')

    def destroy(self, request, *args, **kwargs):
        """Ulashishni o'chirish"""
        share = self.get_object()
        
        # Faqat ulashgan yoki admin o'chira oladi
        if not (share.shared_by == request.user or request.user.is_staff):
            return Response(
                {'detail': 'Siz bu ulashishni o\'chira olmaysiz'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='access')
    def access(self, request, pk=None):
        """Ulashilgan hujjatga kirish"""
        share = self.get_object()
        
        # Faqat ulashilgan foydalanuvchi kirishi mumkin
        if share.shared_with != request.user:
            return Response(
                {'detail': 'Siz bu hujjatga kira olmaysiz'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Muddat va faollik tekshiruvi
        if not share.is_active or share.is_expired:
            return Response(
                {'detail': 'Bu ulashish faol emas yoki muddati tugagan'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Kirish vaqtini belgilash
            share.mark_accessed()
            
            # Hujjat ma'lumotlarini qaytarish
            serializer = DocumentSerializer(
                share.document, context={'request': request}
            )
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error accessing shared document {pk}: {str(e)}")
            return Response(
                {'detail': 'Hujjatga kirishda xatolik'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
