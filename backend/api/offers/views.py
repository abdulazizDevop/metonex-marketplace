from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from api.models import Offer, Request, CompanyMember, Order, Notification
from .serializers import OfferSerializer


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.select_related("request", "supplier_company", "request__category").all().order_by("-created_at")
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return OfferSerializer
        return OfferSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        request_id = params.get("request")
        status_param = params.get("status")
        ordering = params.get("ordering")
        
        if request_id:
            qs = qs.filter(request_id=request_id)
        if status_param:
            qs = qs.filter(status=status_param)
        if ordering in ["created_at", "-created_at", "price", "-price", "eta_days", "-eta_days"]:
            qs = qs.order_by(ordering)
        return qs

    def perform_create(self, serializer):
        # Ensure user is in a supplier company
        supplier_company_id = self.request.data.get("supplier_company")
        if not supplier_company_id:
            raise ValueError("supplier_company talab qilinadi")
        if not CompanyMember.objects.filter(company_id=supplier_company_id, user=self.request.user).exists():
            raise PermissionError("Kompaniyaga a'zo emassiz")
        
        # Check request status - only allow offers for open requests
        request_id = self.request.data.get("request")
        from api.models import Request
        try:
            request_obj = Request.objects.get(id=request_id)
            if request_obj.status not in ['ochiq', 'bekor_qilindi']:
                raise ValueError(f"Bu so'rov {request_obj.get_status_display()} holatida. Faqat ochiq va bekor qilingan so'rovlarga taklif yuborish mumkin.")
        except Request.DoesNotExist:
            raise ValueError("So'rov topilmadi")
        
        # Check if user already has an active offer for this request
        existing_active_offer = Offer.objects.filter(
            request_id=request_id,
            supplier_company_id=supplier_company_id,
            status__in=['kutilmoqda', 'qabul_qilindi', 'bekor_qilindi']  # Faol, qabul qilingan va bekor qilingan offer'larni tekshiramiz
        ).exists()
        if existing_active_offer:
            raise ValueError("Bu so'rov uchun allaqachon faol taklif yuborgan ekansiz")
        
        # Qo'shimcha validatsiyalar
        data = self.request.data
        
        # Price validatsiyasi
        price = data.get('price')
        if price:
            try:
                price_float = float(price)
                if price_float <= 0:
                    raise ValueError("Narx 0 dan katta bo'lishi kerak")
                if price_float > 99999999999:  # 100 milliard
                    raise ValueError("Narx juda katta")
            except ValueError as e:
                if "could not convert" in str(e):
                    raise ValueError("Noto'g'ri narx formati")
                raise e
        
        # ETA days validatsiyasi
        eta_days = data.get('eta_days')
        if eta_days:
            try:
                eta_int = int(eta_days)
                if eta_int <= 0:
                    raise ValueError("ETA kunlari 0 dan katta bo'lishi kerak")
                if eta_int > 365:  # 1 yil
                    raise ValueError("ETA juda uzoq")
            except ValueError as e:
                if "invalid literal" in str(e):
                    raise ValueError("Noto'g'ri ETA formati")
                raise e
        
        # Qo'shimcha fieldlar validatsiyasi
        warranty_period = data.get('warranty_period')
        if warranty_period:
            try:
                warranty_int = int(warranty_period)
                if warranty_int < 0:
                    raise ValueError("Kafolat muddati manfiy bo'lishi mumkin emas")
                if warranty_int > 120:  # 10 yil
                    raise ValueError("Kafolat muddati juda uzoq")
            except ValueError as e:
                if "invalid literal" in str(e):
                    raise ValueError("Noto'g'ri kafolat muddati formati")
                raise e
        
        
        serializer.save(supplier_company_id=supplier_company_id)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def my(self, request):
        # User's company offers
        user_companies = CompanyMember.objects.filter(user=request.user).values_list('company_id', flat=True)
        qs = self.get_queryset().filter(supplier_company_id__in=user_companies)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def request(self, request, request_id=None):
        # All offers for a specific request
        qs = self.get_queryset().filter(request_id=request_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["put"], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        offer = self.get_object()
        
        # Check if user is buyer of the request
        if not CompanyMember.objects.filter(company=offer.request.buyer_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if offer is still pending
        if offer.status != 'kutilmoqda':
            return Response({"detail": "Taklif qabul qilinmaydi"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if request is still open
        if offer.request.status != 'ochiq':
            return Response({"detail": "So'rov ochiq emas"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Accept the offer
        offer.status = 'qabul_qilindi'
        offer.save(update_fields=["status"])
        
        # Reject all other pending offers for this request
        Offer.objects.filter(
            request=offer.request,
            status='kutilmoqda'
        ).exclude(id=offer.id).update(
            status='rad_etildi',
            rejection_reason='Boshqa taklif qabul qilindi'
        )
        
        # Close the request
        offer.request.status = 'yopilgan'
        offer.request.save(update_fields=["status"])
        
        # Create order
        order = Order.objects.create(
            request=offer.request,
            offer=offer,
            buyer_company=offer.request.buyer_company,
            supplier_company=offer.supplier_company,
            total_amount=offer.price,
            payment_terms=offer.request.payment_type  # Request'dan payment_type ni olamiz
        )
        
        # To'lov turiga qarab order status'ini belgilash
        if offer.request.payment_type and 'bank' in offer.request.payment_type.lower():
            # Bank orqali to'lov - to'lov kutiladi
            order.status = 'to_lov_kutilmoqda'
        else:
            # Naqd to'lov - ishlab chiqarish boshlandi
            order.status = 'yeg_ilmoqda'
            order.started_at = timezone.now()
        
        order.save()
        
        # Create notifications
        Notification.objects.create(
            recipient_company=offer.supplier_company,
            type=Notification.NotificationType.ORDER_CREATED,
            message=f"Taklifingiz qabul qilindi. Order yaratildi: {order.id}",
            related_request=offer.request,
            related_order=order,
        )
        
        Notification.objects.create(
            recipient_company=offer.request.buyer_company,
            type=Notification.NotificationType.ORDER_CREATED,
            message=f"Taklif qabul qilindi. Order yaratildi: {order.id}",
            related_request=offer.request,
            related_order=order,
        )
        
        return Response({"detail": "Taklif qabul qilindi", "order_id": order.id})

    @action(detail=True, methods=["put"], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        offer = self.get_object()
        
        # Check if user is buyer of the request
        if not CompanyMember.objects.filter(company=offer.request.buyer_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if offer is still pending
        if offer.status != 'kutilmoqda':
            return Response({"detail": "Taklif rad etilmaydi"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Reject the offer
        offer.status = 'rad_etildi'
        offer.rejection_reason = request.data.get("reason", "")
        offer.save(update_fields=["status", "rejection_reason"])
        
        # Create notification
        Notification.objects.create(
            recipient_company=offer.supplier_company,
            type=Notification.NotificationType.OFFER_REJECTED,
            message=f"Taklifingiz rad etildi: {offer.request.category.name}",
            related_request=offer.request,
        )
        
        return Response({"detail": "Taklif rad etildi"})

    @action(detail=True, methods=["put"], permission_classes=[permissions.IsAuthenticated])
    def cancel(self, request, pk=None):
        """Buyer tomonidan taklifni bekor qilish"""
        offer = self.get_object()
        
        # Check if user is buyer of the request
        if not CompanyMember.objects.filter(company=offer.request.buyer_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if offer is still pending
        if offer.status != 'kutilmoqda':
            return Response({"detail": "Taklif bekor qilinmaydi"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Cancel the offer
        offer.status = 'bekor_qilindi'
        offer.cancellation_reason = request.data.get("reason", "")
        offer.save(update_fields=["status", "cancellation_reason"])
        
        # Create notification
        Notification.objects.create(
            recipient_company=offer.supplier_company,
            type=Notification.NotificationType.OFFER_CANCELLED,
            message=f"Taklifingiz bekor qilindi: {offer.request.category.name}",
            related_request=offer.request,
        )
        
        return Response({"detail": "Taklif bekor qilindi"})
