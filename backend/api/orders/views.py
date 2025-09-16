from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from api.models import Order, CompanyMember, Request, Notification
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("buyer_company", "supplier_company", "request").all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        # kompaniya a'zosi bo'lgan orderlarigina (distinct qo'shamiz)
        qs = qs.filter(
            Q(buyer_company__members__user=self.request.user) |
            Q(supplier_company__members__user=self.request.user)
        ).distinct()
        
        # Filterlar
        params = self.request.query_params
        search = params.get("search")
        status = params.get("status")
        ordering = params.get("ordering")
        
        if search:
            qs = qs.filter(
                Q(id__icontains=search) |
                Q(request__description__icontains=search) |
                Q(buyer_company__name__icontains=search) |
                Q(supplier_company__name__icontains=search)
            )
        if status:
            qs = qs.filter(status=status)
        if ordering in ["created_at", "-created_at", "total_amount", "-total_amount"]:
            qs = qs.order_by(ordering)
        else:
            qs = qs.order_by("-created_at")
        
        return qs

    def list(self, request, *args, **kwargs):
        """Orderlar ro'yxatini pagination bilan qaytarish"""
        queryset = self.get_queryset()
        
        # Pagination
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 10
        page = paginator.paginate_queryset(queryset, request)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def confirm_payment(self, request, pk=None):
        """To'lovni tasdiqlash"""
        order = self.get_object()
        
        # Faqat buyer to'lovni tasdiqlashi mumkin
        if not CompanyMember.objects.filter(company=order.buyer_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        
        # Faqat to'lov kutilayotgan orderlarni tasdiqlash mumkin
        if order.status != 'to_lov_kutilmoqda':
            return Response({"detail": "Bu order to'lov kutilmaydi"}, status=400)
        
        # To'lov hujjatini yuklash
        payment_document = request.FILES.get('payment_document')
        if not payment_document:
            return Response({"detail": "To'lov hujjati kerak"}, status=400)
        
        # File type validatsiyasi
        allowed_types = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        if payment_document.content_type not in allowed_types:
            return Response({"detail": "Faqat PDF, JPG, JPEG, PNG formatidagi fayllar qabul qilinadi"}, status=400)
        
        # File size validatsiyasi (5MB)
        max_size = 5 * 1024 * 1024
        if payment_document.size > max_size:
            return Response({"detail": "Fayl hajmi 5MB dan kichik bo'lishi kerak"}, status=400)
        
        order.payment_document = payment_document
        order.status = 'to_lov_qilindi'
        order.payment_confirmed_at = timezone.now()
        order.save()
        
        # Seller'ga bildirishnoma yuborish
        supplier_owner = order.supplier_company.members.filter(role='egasi').first()
        if supplier_owner:
            Notification.objects.create(
                recipient_user=supplier_owner.user,
                recipient_company=order.supplier_company,
                type='order_updated',
                message=f'{order.buyer_company.name} to\'lovni tasdiqladi. Order: {order.id}',
                related_order=order
            )
        
        return Response({"detail": "To'lov tasdiqlandi"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def start_production(self, request, pk=None):
        """Ishlab chiqarishni boshlash"""
        order = self.get_object()
        
        # Faqat supplier ishlab chiqarishni boshlashi mumkin
        if not CompanyMember.objects.filter(company=order.supplier_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        
        # Faqat to'lov qilingan orderlarni ishlab chiqarish mumkin
        if order.status != 'to_lov_qilindi':
            return Response({"detail": "To'lov qilinmagan"}, status=400)
        
        order.status = 'yeg_ilmoqda'
        order.started_at = timezone.now()
        order.save()
        
        # Buyer'ga bildirishnoma yuborish
        buyer_owner = order.buyer_company.members.filter(role='egasi').first()
        if buyer_owner:
            Notification.objects.create(
                recipient_user=buyer_owner.user,
                recipient_company=order.buyer_company,
                type='order_updated',
                message=f'{order.supplier_company.name} ishlab chiqarishni boshladi. Order: {order.id}',
                related_order=order
            )
        
        return Response({"detail": "Ishlab chiqarish boshlandi"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def ship_order(self, request, pk=None):
        """Buyumlarni yuborish"""
        order = self.get_object()
        
        # Faqat supplier yuborishi mumkin
        if not CompanyMember.objects.filter(company=order.supplier_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        
        # Faqat yeg'ilayotgan orderlarni yuborish mumkin
        if order.status != 'yeg_ilmoqda':
            return Response({"detail": "Order yeg'ilmagan"}, status=400)
        
        # TTN hujjatini yuklash
        ttn_document = request.FILES.get('ttn_document')
        if not ttn_document:
            return Response({"detail": "TTN hujjati kerak"}, status=400)
        
        # File type validatsiyasi
        allowed_types = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        if ttn_document.content_type not in allowed_types:
            return Response({"detail": "Faqat PDF, JPG, JPEG, PNG formatidagi fayllar qabul qilinadi"}, status=400)
        
        # File size validatsiyasi (5MB)
        max_size = 5 * 1024 * 1024
        if ttn_document.size > max_size:
            return Response({"detail": "Fayl hajmi 5MB dan kichik bo'lishi kerak"}, status=400)
        
        order.ttn_document = ttn_document
        order.status = 'yo_lda'
        order.save()
        
        # Buyer'ga bildirishnoma yuborish
        buyer_owner = order.buyer_company.members.filter(role='egasi').first()
        if buyer_owner:
            Notification.objects.create(
                recipient_user=buyer_owner.user,
                recipient_company=order.buyer_company,
                type='order_updated',
                message=f'{order.supplier_company.name} buyumlarni yubordi. Order: {order.id}',
                related_order=order
            )
        
        return Response({"detail": "Buyumlar yuborildi"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def mark_delivered(self, request, pk=None):
        """Yetkazib berilgan deb belgilash"""
        order = self.get_object()
        
        # Faqat supplier belgilashi mumkin
        if not CompanyMember.objects.filter(company=order.supplier_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        
        # Faqat yo'lda bo'lgan orderlarni yetkazib berilgan deb belgilash mumkin
        if order.status != 'yo_lda':
            return Response({"detail": "Order yo'lda emas"}, status=400)
        
        order.status = 'yetib_bordi'
        order.save()
        
        # Buyer'ga bildirishnoma yuborish
        buyer_owner = order.buyer_company.members.filter(role='egasi').first()
        if buyer_owner:
            Notification.objects.create(
                recipient_user=buyer_owner.user,
                recipient_company=order.buyer_company,
                type='order_updated',
                message=f'{order.supplier_company.name} buyumlarni yetkazib berdi. Order: {order.id}',
                related_order=order
            )
        
        return Response({"detail": "Buyumlar yetkazib berildi"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def confirm_delivery(self, request, pk=None):
        """Yetkazib berishni tasdiqlash"""
        order = self.get_object()
        
        # Faqat buyer tasdiqlashi mumkin
        if not CompanyMember.objects.filter(company=order.buyer_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        
        # Faqat yetib borgan orderlarni tasdiqlash mumkin
        if order.status != 'yetib_bordi':
            return Response({"detail": "Buyumlar yetib bormagan"}, status=400)
        
        # Yetkazib berish rasmlarini yuklash
        delivery_photos = request.FILES.getlist('delivery_photos')
        if not delivery_photos:
            return Response({"detail": "Yetkazib berish rasmlari kerak"}, status=400)
        
        # File count validatsiyasi (maksimal 5 ta)
        if len(delivery_photos) > 5:
            return Response({"detail": "Maksimal 5 ta rasm yuklashingiz mumkin"}, status=400)
        
        # File type va size validatsiyasi
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
        max_size = 2 * 1024 * 1024  # 2MB per image
        
        for photo in delivery_photos:
            if photo.content_type not in allowed_types:
                return Response({"detail": "Faqat JPG, JPEG, PNG formatidagi rasmlar qabul qilinadi"}, status=400)
            if photo.size > max_size:
                return Response({"detail": "Har bir rasm hajmi 2MB dan kichik bo'lishi kerak"}, status=400)
        
        # Rasmlarni saqlash
        photo_urls = []
        for photo in delivery_photos:
            # Rasmlarni files/orders/delivery_photos/ papkasiga saqlaymiz
            import os
            from django.conf import settings
            import uuid
            
            # Papka yaratish
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'orders', 'delivery_photos')
            os.makedirs(upload_dir, exist_ok=True)
            
            # Fayl nomini unique qilish
            file_extension = os.path.splitext(photo.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            # Faylni saqlash
            file_path = os.path.join(upload_dir, unique_filename)
            with open(file_path, 'wb') as destination:
                for chunk in photo.chunks():
                    destination.write(chunk)
            
            photo_urls.append(unique_filename)
        
        order.delivery_photos = photo_urls
        
        # Naqd to'lov uchun status'ni tekshiramiz
        payment_type = order.payment_terms or order.request.payment_type if order.request else None
        if payment_type and 'naqd' in payment_type.lower():
            # Naqd to'lov uchun to'g'ridan-to'g'ri yakunlaymiz (seller allaqachon naqd to'lovni qabul qilgan)
            order.status = 'yakunlandi'
            order.completed_at = timezone.now()
        else:
            # Bank orqali to'lov uchun to'g'ridan-to'g'ri yakunlaymiz
            order.status = 'yakunlandi'
            order.completed_at = timezone.now()
        
        order.save()
        
        # Seller'ga bildirishnoma yuborish
        supplier_owner = order.supplier_company.members.filter(role='egasi').first()
        if supplier_owner:
            Notification.objects.create(
                recipient_user=supplier_owner.user,
                recipient_company=order.supplier_company,
                type='order_completed',
                message=f'{order.buyer_company.name} orderni yakunladi. Order: {order.id}',
                related_order=order
            )
        
        return Response({"detail": "Order yakunlandi"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def confirm_cash_payment(self, request, pk=None):
        """Naqd to'lovni qabul qilish (seller) - buyer qabul qilish uchun ruxsat berish"""
        order = self.get_object()
        
        # Faqat supplier qabul qilishi mumkin
        if not CompanyMember.objects.filter(company=order.supplier_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        
        # Faqat naqd to'lov kutilayotgan orderlarni qabul qilish mumkin
        if order.status != 'naqd_tolov_kutilmoqda':
            return Response({"detail": "Naqd to'lov kutilmoqda emas"}, status=400)
        
        # Naqd to'lovni qabul qildik, lekin hali yakunlanmadi
        # Buyer qabul qilgandan keyin yakunlanadi
        order.status = 'naqd_tolov_qabul_qilindi'  # Yangi status
        order.save()
        
        # Buyer'ga bildirishnoma yuborish
        buyer_owner = order.buyer_company.members.filter(role='egasi').first()
        if buyer_owner:
            Notification.objects.create(
                recipient_user=buyer_owner.user,
                recipient_company=order.buyer_company,
                type='cash_payment_confirmed',
                message=f'{order.supplier_company.name} naqd to\'lovni qabul qildi. Endi siz qabul qilishingiz mumkin. Order: {order.id}',
                related_order=order
            )
        
        return Response({"detail": "Naqd to'lov qabul qilindi. Buyer endi qabul qilishi mumkin"})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def buyer(self, request):
        """Buyer uchun orderlar"""
        qs = self.get_queryset()
        # Faqat buyer bo'lgan orderlar
        qs = qs.filter(buyer_company__members__user=request.user)
        
        # Pagination
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 10
        page = paginator.paginate_queryset(qs, request)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def seller(self, request):
        """Seller uchun orderlar"""
        qs = self.get_queryset()
        # Faqat supplier bo'lgan orderlar
        qs = qs.filter(supplier_company__members__user=request.user)
        
        # Pagination
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 10
        page = paginator.paginate_queryset(qs, request)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
