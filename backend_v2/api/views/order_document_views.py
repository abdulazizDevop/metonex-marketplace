"""
Order Document views - Buyurtma hujjatlari uchun views
"""
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Order, Document


class OrderDocumentView(APIView):
    """
    Buyurtma hujjatlari uchun APIView - Document modelini ishlatadi
    
    Buyer yuklaydi:
    - PAYMENT_PROOF - To'lov hujjati (platyoshka)
    - RECEIPT - Qabul qilish hujjati (imzolangan TTN rasmi)
    
    Seller yuklaydi:
    - CONTRACT - Shartnoma
    - INVOICE - Hisob varaqi  
    - TTN - Transport hujjati
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request, order_id=None):
        """Buyurtma hujjatlarini olish"""
        try:
            if not order_id:
                return Response({'error': 'Order ID talab qilinadi'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Buyurtmani tekshirish
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                return Response({'error': 'Buyurtma topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            # Foydalanuvchi bu buyurtmada ishtirok etganligini tekshirish
            if request.user != order.buyer and request.user != order.supplier:
                return Response({'error': 'Ruxsat etilmagan'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            # Document modelidan buyurtma hujjatlarini olish
            documents = Document.objects.filter(
                order=order,
                user=request.user
            ).values(
                'id', 'title', 'document_type', 'file', 
                'file_name', 'file_size', 'content_type', 'created_at'
            )
            
            # Fayl URL'larini to'g'ri formatda qaytarish
            documents_list = []
            for doc in documents:
                documents_list.append({
                    'id': doc['id'],
                    'name': doc['title'],
                    'type': doc['document_type'],
                    'file': doc['file'],
                    'file_name': doc['file_name'],
                    'size': doc['file_size'],
                    'content_type': doc['content_type'],
                    'date': doc['created_at']
                })
            
            return Response({
                'documents': documents_list,
                'count': len(documents_list),
                'order_id': order_id,
                'user_role': 'buyer' if request.user == order.buyer else 'supplier'
            })
        except Exception as e:
            return Response({'error': f'Xatolik: {str(e)}'}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, order_id=None):
        """Yangi buyurtma hujjati qo'shish"""
        try:
            if not order_id:
                return Response({'error': 'Order ID talab qilinadi'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Buyurtmani tekshirish
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                return Response({'error': 'Buyurtma topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            # Foydalanuvchi bu buyurtmada ishtirok etganligini tekshirish
            if request.user != order.buyer and request.user != order.supplier:
                return Response({'error': 'Ruxsat etilmagan'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            # Fayl va ma'lumotlarni olish
            file = request.FILES.get('file')
            name = request.data.get('name', '')
            document_type = request.data.get('type', '')
            
            if not file:
                return Response({'error': 'Fayl yuklanmagan'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            if not name:
                return Response({'error': 'Hujjat nomi kiritilmagan'}, 
                               status=status.HTTP_400_BAD_REQUEST)
                
            if not document_type:
                return Response({'error': 'Hujjat turi kiritilmagan'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Hujjat turini tekshirish - foydalanuvchi roliga qarab
            user_role = 'buyer' if request.user == order.buyer else 'supplier'
            allowed_types = self._get_allowed_document_types(user_role, order.payment_method)
            
            if document_type not in allowed_types:
                return Response({
                    'error': f'Bu hujjat turini yuklash ruxsat etilmagan. Ruxsat etilgan turlar: {", ".join(allowed_types)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Fayl hajmi tekshiruvi (10MB limit)
            max_size = 10 * 1024 * 1024  # 10MB
            if file.size > max_size:
                return Response({'error': 'Fayl hajmi 10MB dan oshmasligi kerak'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Document yaratish
            document = Document.objects.create(
                user=request.user,
                order=order,
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
    
    def put(self, request, order_id=None):
        """Buyurtma hujjatini yangilash"""
        try:
            if not order_id:
                return Response({'error': 'Order ID talab qilinadi'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Buyurtmani tekshirish
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                return Response({'error': 'Buyurtma topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            # Foydalanuvchi bu buyurtmada ishtirok etganligini tekshirish
            if request.user != order.buyer and request.user != order.supplier:
                return Response({'error': 'Ruxsat etilmagan'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            document_id = request.data.get('id')
            new_name = request.data.get('name')
            new_file = request.FILES.get('file')
            
            if not document_id:
                return Response({'error': 'Hujjat ID talab qilinadi'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            try:
                document = Document.objects.get(
                    id=document_id,
                    order=order,
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
    
    def delete(self, request, order_id=None):
        """Buyurtma hujjatini o'chirish"""
        try:
            if not order_id:
                return Response({'error': 'Order ID talab qilinadi'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Buyurtmani tekshirish
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                return Response({'error': 'Buyurtma topilmadi'}, 
                               status=status.HTTP_404_NOT_FOUND)
            
            # Foydalanuvchi bu buyurtmada ishtirok etganligini tekshirish
            if request.user != order.buyer and request.user != order.supplier:
                return Response({'error': 'Ruxsat etilmagan'}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            document_id = request.data.get('id')
            
            if not document_id:
                return Response({'error': 'Hujjat ID talab qilinadi'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            try:
                document = Document.objects.get(
                    id=document_id,
                    order=order,
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
            return Response({'error': f'Xatolik: {str(e)}'}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_allowed_document_types(self, user_role, payment_method):
        """Foydalanuvchi roli va to'lov usuliga qarab ruxsat etilgan hujjat turlarini qaytarish"""
        if user_role == 'buyer':
            # Buyer yuklaydi
            return ['payment_proof', 'receipt']
        elif user_role == 'supplier':
            # Seller yuklaydi
            allowed = ['ttn']  # TTN har doim
            
            if payment_method == 'bank':
                # Bank flow uchun shartnoma va hisob varaqi
                allowed.extend(['contract', 'invoice'])
            
            return allowed
        
        return []
