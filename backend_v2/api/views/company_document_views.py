"""
Company Document views - Kompaniya hujjatlari uchun views
"""

from django.utils import timezone
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication
import uuid

from ..models import Company, Document


class CompanyDocumentView(APIView):
    """
    Kompaniya hujjatlari uchun APIView - Document modelini ishlatadi
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        """Kompaniya hujjatlarini olish"""
        try:
            # Foydalanuvchining kompaniyasi borligini tekshirish
            if not hasattr(request.user, 'company'):
                return Response({'error': 'Kompaniya topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            company = request.user.company
            
            # Document modelidan kompaniya hujjatlarini olish
            documents = Document.objects.filter(
                company=company,
                user=request.user
            ).values(
                'id', 'title', 'document_type', 'file', 
                'file_name', 'file_size', 'content_type', 'created_at'
            )
            
            # Fayl URL'larini to'g'ri formatda qaytarish
            documents_list = []
            for doc in documents:
                # Build full file URL
                file_url = f"/files/{doc['file']}" if doc['file'] else None
                documents_list.append({
                    'id': doc['id'],
                    'name': doc['title'],
                    'type': doc['document_type'],
                    'file': file_url,
                    'file_name': doc['file_name'],
                    'size': doc['file_size'],
                    'content_type': doc['content_type'],
                    'date': doc['created_at']
                })
            
            return Response({
                'documents': documents_list,
                'count': len(documents_list)
            })
        except Exception as e:
            return Response({'error': f'Xatolik: {str(e)}'}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Yangi hujjat qo'shish"""
        try:
            print(f"POST request received. User: {request.user}")
            print(f"User role: {request.user.role}")
            print(f"User authenticated: {request.user.is_authenticated}")
            print(f"Request data: {request.data}")
            print(f"Request FILES: {request.FILES}")
            
            # Foydalanuvchining kompaniyasi borligini tekshirish
            if not hasattr(request.user, 'company'):
                print(f"User has no company attribute")
                return Response({'error': 'Kompaniya topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            company = request.user.company
            
            # Fayl va ma'lumotlarni olish
            file = request.FILES.get('file')
            name = request.data.get('name', '')
            document_type = request.data.get('type', 'other')  # Default type
            
            if not file:
                return Response({'error': 'Fayl yuklanmagan'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            if not name:
                return Response({'error': 'Hujjat nomi kiritilmagan'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Fayl hajmi tekshiruvi (10MB limit)
            max_size = 10 * 1024 * 1024  # 10MB
            if file.size > max_size:
                return Response({'error': 'Fayl hajmi 10MB dan oshmasligi kerak'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Document yaratish
            document = Document.objects.create(
                user=request.user,
                company=company,
                document_type=document_type,
                title=name,
                file=file,
                file_name=file.name,
                file_size=file.size,
                content_type=file.content_type,
                status='verified',  # Avtomatik tasdiqlangan
                source='manual_upload'
            )
            
            return Response({
                'message': 'Hujjat muvaffaqiyatli yuklandi',
                'document': {
                    'id': document.id,
                    'name': document.title,
                    'type': document.document_type,
                    'file': document.file.url if document.file else None,
                    'file_name': document.file_name,
                    'size': document.file_size,
                    'content_type': document.content_type,
                    'date': document.created_at
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Xatolik: {str(e)}'}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        """Hujjatni yangilash"""
        try:
            # Foydalanuvchining kompaniyasi borligini tekshirish
            if not hasattr(request.user, 'company'):
                return Response({'error': 'Kompaniya topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            company = request.user.company
            document_id = request.data.get('id')
            new_name = request.data.get('name')
            new_file = request.FILES.get('file')
            
            if not document_id:
                return Response({'error': 'Hujjat ID talab qilinadi'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            try:
                document = Document.objects.get(
                    id=document_id,
                    company=company,
                    user=request.user
                )
            except Document.DoesNotExist:
                return Response({'error': 'Hujjat topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            # Hujjat nomini yangilash
            if new_name:
                document.title = new_name
            
            # Yangi fayl yuklash
            if new_file:
                # Eski faylni o'chirish
                if document.file:
                    default_storage.delete(document.file.name)
                
                document.file = new_file
                document.file_name = new_file.name
                document.file_size = new_file.size
                document.content_type = new_file.content_type
            
            document.save()
            
            return Response({
                'message': 'Hujjat muvaffaqiyatli yangilandi',
                'document': {
                    'id': document.id,
                    'name': document.title,
                    'type': document.document_type,
                    'file': document.file.url if document.file else None,
                    'file_name': document.file_name,
                    'size': document.file_size,
                    'content_type': document.content_type,
                    'date': document.created_at
                }
            })
            
        except Exception as e:
            return Response({'error': f'Xatolik: {str(e)}'}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request):
        """Hujjatni o'chirish"""
        try:
            # Foydalanuvchining kompaniyasi borligini tekshirish
            if not hasattr(request.user, 'company'):
                return Response({'error': 'Kompaniya topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            company = request.user.company
            
            # Request data'ni olish - DRF ba'zan DELETE body'ni parse qilmaydi
            import json
            try:
                if request.body:
                    data = json.loads(request.body.decode('utf-8'))
                    document_id = data.get('id')
                else:
                    document_id = request.data.get('id')
            except (json.JSONDecodeError, UnicodeDecodeError):
                document_id = request.data.get('id')
            
            if not document_id:
                return Response({'error': 'Hujjat ID talab qilinadi'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            try:
                document = Document.objects.get(
                    id=document_id,
                    company=company,
                    user=request.user
                )
            except Document.DoesNotExist:
                return Response({'error': 'Hujjat topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            # Faylni o'chirish
            if document.file:
                default_storage.delete(document.file.name)
            
            # Hujjatni o'chirish
            document.delete()
            
            return Response({
                'message': 'Hujjat muvaffaqiyatli o\'chirildi'
            })
            
        except Exception as e:
            return Response({'error': f'Hujjat o\'chirishda xatolik: {str(e)}'}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)