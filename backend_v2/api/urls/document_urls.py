"""
Document URLs - Hujjatlar uchun URL patterns
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.document_views import DocumentViewSet, DocumentShareViewSet

# Router yaratish
router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='documents')
router.register(r'document-shares', DocumentShareViewSet, basename='document-shares')

# URL patterns
urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Qo'shimcha custom URLs (agar kerak bo'lsa)
    # path('documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    # path('documents/bulk-delete/', BulkDeleteView.as_view(), name='document-bulk-delete'),
]

"""
Yaratilgan URL patterns:

Documents:
- GET /api/v1/documents/ - Barcha hujjatlar ro'yxati
- POST /api/v1/documents/ - Yangi hujjat yaratish
- GET /api/v1/documents/{id}/ - Bitta hujjat ma'lumotlari
- PUT /api/v1/documents/{id}/ - Hujjat yangilash
- PATCH /api/v1/documents/{id}/ - Qisman yangilash
- DELETE /api/v1/documents/{id}/ - Hujjat o'chirish

Custom Actions:
- GET /api/v1/documents/{id}/download/ - Hujjat yuklab olish
- POST /api/v1/documents/{id}/verify/ - Hujjat tasdiqlash (Admin)
- POST /api/v1/documents/{id}/share/ - Hujjat ulashish
- GET /api/v1/documents/my-documents/ - Mening hujjatlarim
- GET /api/v1/documents/order-documents/{order_id}/ - Buyurtma hujjatlari
- GET /api/v1/documents/company-documents/{company_id}/ - Kompaniya hujjatlari
- POST /api/v1/documents/search/ - Hujjatlar qidirish
- GET /api/v1/documents/shared-with-me/ - Men bilan ulashilgan
- GET /api/v1/documents/shared-by-me/ - Men ulashgan

Document Shares:
- GET /api/v1/document-shares/ - Barcha ulashishlar
- POST /api/v1/document-shares/ - Yangi ulashish
- GET /api/v1/document-shares/{id}/ - Bitta ulashish
- PUT /api/v1/document-shares/{id}/ - Ulashish yangilash
- DELETE /api/v1/document-shares/{id}/ - Ulashishni o'chirish
- POST /api/v1/document-shares/{id}/access/ - Ulashilgan hujjatga kirish
"""
