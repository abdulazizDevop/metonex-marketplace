from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from api.models import Request, Notification, Order, Item


@shared_task
def request_reminder_scan():
    now = timezone.now()
    three_hours_ago = now - timedelta(hours=3)
    day_ago = now - timedelta(days=1)
    qs = Request.objects.filter(status=Request.RequestStatus.OPEN, created_at__gte=day_ago)
    for req in qs:
        # Agar shu so'rov bo'yicha Order yaratilmagan bo'lsa va 3 soat mobaynida eslatma chiqmagan bo'lsa
        has_order = Order.objects.filter(request=req).exists()
        if has_order:
            continue
        recent_reminder = Notification.objects.filter(
            related_request=req,
            created_at__gte=three_hours_ago,
            type=getattr(Notification.NotificationType, 'NEW_REQUEST', 'new_request')
        ).exists()
        if not recent_reminder:
            # Buyerga eslatma
            Notification.objects.create(
                recipient_company=req.buyer_company,
                type=getattr(Notification.NotificationType, 'NEW_REQUEST', 'new_request'),
                message=f"So'rovingiz bo'yicha hali order ochilmadi: {req.id}",
                related_request=req,
            )
            # Supplierlarga eslatma (shu kategoriya bo'yicha itemlari bor kompaniyalar)
            supplier_company_ids = (
                Item.objects.filter(category=req.category)
                .values_list('company_id', flat=True)
                .distinct()
            )
            for comp_id in supplier_company_ids:
                Notification.objects.create(
                    recipient_company_id=comp_id,
                    type=getattr(Notification.NotificationType, 'NEW_REQUEST', 'new_request'),
                    message=f"Yangi so'rovga javob bering: {req.id}",
                    related_request=req,
                )


@shared_task
def request_expire_scan():
    now = timezone.now()
    qs = Request.objects.filter(status=Request.RequestStatus.OPEN, expires_at__lte=now)
    for req in qs:
        req.status = Request.RequestStatus.EXPIRED
        req.save(update_fields=["status"])
        Notification.objects.create(
            recipient_company=req.buyer_company,
            type=getattr(Notification.NotificationType, 'ORDER_STATUS_CHANGED', 'order_status_changed'),
            message=f"So'rov muddati tugadi: {req.id}",
            related_request=req,
        )

