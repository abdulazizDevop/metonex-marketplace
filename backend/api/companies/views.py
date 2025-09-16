from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Company, CompanyMember, Request, Order, CompanyCertificate, User, Notification, Item, Rating, VerificationCode
from .serializers import CompanySerializer, CompanyMemberSerializer
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import timedelta
import random
import string


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by("-created_at")
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def my_status(self, request):
        user = request.user
        member = CompanyMember.objects.filter(user=user).select_related("company").first()
        has_company = bool(member)
        return Response({
            "has_company": has_company,
            "user_role": user.type,
            "company_id": str(member.company.id) if member else None,
            "user_id": str(user.id),
        })

    # User my_profile (name, phone, image)
    @action(detail=False, methods=["get", "patch"], permission_classes=[permissions.IsAuthenticated])
    def my_profile(self, request):
        user = request.user
        if request.method == "GET":
            return Response({
                "id": str(user.id),
                "name": user.name,
                "phone": user.phone,
                "image": request.build_absolute_uri(user.image.url) if user.image else None,
            })
        # PATCH
        name = request.data.get("name")
        phone = request.data.get("phone")
        if name is not None:
            user.name = name
        if phone is not None:
            user.phone = phone
        if request.FILES.get("image"):
            user.image = request.FILES.get("image")
        user.save(update_fields=["name", "phone", "image", "updated_at"]) if hasattr(user, 'updated_at') else user.save()
        # notify user about profile update
        Notification.objects.create(
            recipient_user=user,
            type=Notification.NotificationType.PROFILE_UPDATED,
            message=f"{user.name} ({user.phone}): Profil yangilandi",
        )
        return Response({
            "id": str(user.id),
            "name": user.name,
            "phone": user.phone,
            "image": request.build_absolute_uri(user.image.url) if user.image else None,
        })

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not old_password or not new_password:
            return Response({"detail": "old_password va new_password talab qilinadi"}, status=400)
        if not user.check_password(old_password):
            return Response({"detail": "Eski parol noto'g'ri"}, status=400)
        user.set_password(new_password)
        user.save(update_fields=["password"]) if hasattr(user, 'password') else user.save()
        Notification.objects.create(
            recipient_user=user,
            type=Notification.NotificationType.PASSWORD_CHANGED,
            message=f"{user.name} ({user.phone}): Parol yangilandi",
        )
        return Response({"detail": "Parol yangilandi"})

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def send_password_change_sms(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        
        if not old_password or not new_password:
            return Response({"detail": "old_password va new_password talab qilinadi"}, status=400)
        
        # Eski parolni tekshirish
        if not user.check_password(old_password):
            return Response({"detail": "Eski parol noto'g'ri"}, status=400)
        
        # Yangi parol eski parol bilan bir xil bo'lmasligi
        if old_password == new_password:
            return Response({"detail": "Yangi parol eski parol bilan bir xil bo'lishi mumkin emas"}, status=400)
        
        now = timezone.now()
        # Cooldown: 60s ichida qayta yuborilmaydi
        last = (
            VerificationCode.objects
            .filter(phone=user.phone)
            .order_by("-created_at")
            .first()
        )
        if last and last.used_at is None and last.expires_at > now:
            remaining = int((last.expires_at - now).total_seconds())
            return Response({
                "detail": "Hali amal qilayotgan kod mavjud",
                "cooldown_remaining": remaining,
            }, status=429)
        
        # Rate limit: 5/day
        start_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        count_today = VerificationCode.objects.filter(phone=user.phone, created_at__gte=start_day).count()
        if count_today >= 5:
            return Response({"detail": "Kunlik limit tugagan"}, status=429)
        
        # 6 ta raqamli SMS kod yaratish
        code = f"{random.randint(100000, 999999)}"
        expires_at = now + timedelta(minutes=5)  # 5 daqiqa amal qiladi
        VerificationCode.objects.create(phone=user.phone, code=code, expires_at=expires_at)
        
        # TODO: Haqiqiy SMS xizmat bilan integratsiya qilish
        # Hozircha faqat kod yaratiladi, notification yaratilmaydi
        print(f"DEBUG: SMS kod {user.phone} uchun: {code}")
        
        return Response({"detail": "SMS kod yuborildi"})

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def verify_password_change_sms(self, request):
        user = request.user
        code = request.data.get("code")
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        
        if not code or not old_password or not new_password:
            return Response({"detail": "code, old_password va new_password talab qilinadi"}, status=400)
        
        # SMS kodni tekshirish
        verification_code = (
            VerificationCode.objects
            .filter(phone=user.phone, code=code, used_at__isnull=True)
            .order_by("-created_at")
            .first()
        )
        
        if not verification_code:
            return Response({"detail": "SMS kod noto'g'ri"}, status=400)
        
        if not verification_code.is_valid_now():
            return Response({"detail": "SMS kod muddati tugagan"}, status=400)
        
        # Eski parolni qayta tekshirish
        if not user.check_password(old_password):
            return Response({"detail": "Eski parol noto'g'ri"}, status=400)
        
        # Parolni yangilash
        user.set_password(new_password)
        user.save(update_fields=['password'])
        
        # SMS kodni ishlatilgan deb belgilash
        verification_code.used_at = timezone.now()
        verification_code.save(update_fields=['used_at'])
        
        # Notification yaratish
        Notification.objects.create(
            recipient_user=user,
            type=Notification.NotificationType.PASSWORD_CHANGED,
            message=f"{user.name} ({user.phone}): Parol SMS orqali yangilandi",
        )
        
        return Response({"detail": "Parol muvaffaqiyatli yangilandi"})

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def create_for_user(self, request):
        user = request.user
        if CompanyMember.objects.filter(user=user).exists():
            return Response({"detail": "Foydalanuvchi allaqachon kompaniyada"}, status=400)
        
        # Qo'shimcha validatsiyalar
        data = request.data
        
        # Name validatsiyasi
        name = data.get('name')
        if not name or len(name.strip()) < 2:
            return Response({"detail": "Kompaniya nomi kamida 2 ta belgi bo'lishi kerak"}, status=400)
        if len(name) > 200:
            return Response({"detail": "Kompaniya nomi juda uzun"}, status=400)
        
        # INN validatsiyasi
        inn = data.get('inn')
        if inn:
            if not inn.isdigit() or len(inn) != 9:
                return Response({"detail": "INN 9 ta raqamdan iborat bo'lishi kerak"}, status=400)
        
        # Region validatsiyasi
        region = data.get('region')
        if region and len(region) > 100:
            return Response({"detail": "Viloyat nomi juda uzun"}, status=400)
        
        # Description validatsiyasi
        description = data.get('description')
        if description and len(description) > 1000:
            return Response({"detail": "Tavsif juda uzun"}, status=400)
        
        # File validatsiyasi
        documents = request.FILES.get("documents")
        if documents:
            allowed_types = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
            if documents.content_type not in allowed_types:
                return Response({"detail": "Hujjat faqat PDF, JPG, JPEG, PNG formatida bo'lishi kerak"}, status=400)
            if documents.size > 10 * 1024 * 1024:  # 10MB
                return Response({"detail": "Hujjat hajmi 10MB dan kichik bo'lishi kerak"}, status=400)
        
        # Certificate validatsiyasi
        certificates = request.FILES.getlist("sertificate")
        if certificates:
            if len(certificates) > 10:
                return Response({"detail": "Maksimal 10 ta sertifikat yuklashingiz mumkin"}, status=400)
            for cert in certificates:
                if cert.content_type not in ['image/jpeg', 'image/jpg', 'image/png']:
                    return Response({"detail": "Sertifikatlar faqat JPG, JPEG, PNG formatida bo'lishi kerak"}, status=400)
                if cert.size > 5 * 1024 * 1024:  # 5MB per certificate
                    return Response({"detail": "Har bir sertifikat hajmi 5MB dan kichik bo'lishi kerak"}, status=400)
        
        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # type foydalanuvchi roliga moslanadi va fayllar bilan saqlanadi
        company = Company(
            name=serializer.validated_data["name"],
            type=Company.CompanyType.SUPPLIER if user.type == user.UserType.SELLER else Company.CompanyType.BUYER,
            inn=serializer.validated_data.get("inn"),
            region=serializer.validated_data.get("region"),
            verified=True,
            description=serializer.validated_data.get("description"),
        )
        # Fayllar: documents (bitta), sertificate(lar) (ko'p)
        if documents:
            company.documents = documents
        company.save()
        for f in certificates:
            CompanyCertificate.objects.create(company=company, image=f)
        CompanyMember.objects.create(company=company, user=user, role=CompanyMember.Role.OWNER)
        return Response(CompanySerializer(company, context={'request': request}).data)

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def join(self, request):
        user = request.user
        if CompanyMember.objects.filter(user=user).exists():
            return Response({"detail": "Foydalanuvchi allaqachon kompaniyada"}, status=400)
        company_id = request.data.get("company_id")
        if not company_id:
            return Response({"detail": "company_id talab qilinadi"}, status=400)
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response({"detail": "Kompaniya topilmadi"}, status=404)
        # Kompaniya type foydalanuvchi roliga zid bo'lmasin
        expected = Company.CompanyType.SUPPLIER if user.type == user.UserType.SELLER else Company.CompanyType.BUYER
        if company.type != expected:
            return Response({"detail": "Kompaniya turi foydalanuvchi roliga mos emas"}, status=400)
        obj, created = CompanyMember.objects.get_or_create(
            company=company,
            user=user,
            defaults={"role": CompanyMember.Role.MEMBER},
        )
        if not created and obj.role != CompanyMember.Role.MEMBER:
            # mavjud bo'lsa ham javob OK
            return Response({"detail": "Allaqachon a'zo"})
        return Response({"detail": "Xodim sifatida qo'shildi"})

    # Company profile update (owner only): fields and media
    @action(detail=True, methods=["patch"], permission_classes=[permissions.IsAuthenticated])
    def update_profile(self, request, pk=None):
        company = self.get_object()
        # only owner can update
        if not CompanyMember.objects.filter(company=company, user=request.user, role=CompanyMember.Role.OWNER).exists():
            return Response({"detail": "Faqat egasi tahrirlaydi"}, status=403)
        # simple fields (name read-only)
        for f in ["inn", "region", "description"]:
            if f in request.data:
                setattr(company, f, request.data.get(f))
        # optional single document file
        if request.FILES.get("documents"):
            company.documents = request.FILES.get("documents")
        if request.FILES.get("logo"):
            company.logo = request.FILES.get("logo")
        company.save()
        # notify all company members about profile update
        for m in CompanyMember.objects.filter(company=company).select_related("user"):
            Notification.objects.create(
                recipient_user=m.user,
                recipient_company=company,
                type=Notification.NotificationType.COMPANY_PROFILE_UPDATED,
                message=f"{request.user.name} ({request.user.phone}): Kompaniya profili yangilandi",
            )
        return Response(CompanySerializer(company, context={'request': request}).data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def delete_logo(self, request, pk=None):
        company = self.get_object()
        if not CompanyMember.objects.filter(company=company, user=request.user, role=CompanyMember.Role.OWNER).exists():
            return Response({"detail": "Faqat egasi tahrirlaydi"}, status=403)
        company.logo = None
        company.save(update_fields=["logo"])
        return Response({"detail": "Logo o'chirildi"})

    # Certificates management (owner)
    @action(detail=True, methods=["get", "post", "delete"], permission_classes=[permissions.IsAuthenticated])
    def certificates(self, request, pk=None):
        company = self.get_object()
        if request.method == "GET":
            # GET: kompaniya a'zolari uchun ruxsat
            if not CompanyMember.objects.filter(company=company, user=request.user).exists():
                return Response({"detail": "A'zo emas"}, status=403)
            data = [{"id": str(c.id), "image": request.build_absolute_uri(c.image.url)} for c in company.certificates.all()]
            return Response(data)
        # POST/DELETE: faqat egasi
        if not CompanyMember.objects.filter(company=company, user=request.user, role=CompanyMember.Role.OWNER).exists():
            return Response({"detail": "Faqat egasi boshqaradi"}, status=403)
        if request.method == "POST":
            for f in request.FILES.getlist("sertificate"):
                CompanyCertificate.objects.create(company=company, image=f)
            data = [{"id": str(c.id), "image": request.build_absolute_uri(c.image.url)} for c in company.certificates.all()]
            for m in CompanyMember.objects.filter(company=company).select_related("user"):
                Notification.objects.create(
                    recipient_user=m.user,
                    recipient_company=company,
                    type=Notification.NotificationType.CERTIFICATE_ADDED,
                    message=f"{request.user.name} ({request.user.phone}): Sertifikat(lar) qo'shildi",
                )
            return Response(data, status=201)
        # DELETE
        cert_id = request.data.get("certificate_id") or request.query_params.get("certificate_id")
        if not cert_id:
            return Response({"detail": "certificate_id talab qilinadi"}, status=400)
        try:
            obj = CompanyCertificate.objects.get(id=cert_id, company=company)
        except CompanyCertificate.DoesNotExist:
            return Response({"detail": "Topilmadi"}, status=404)
        obj.delete()
        for m in CompanyMember.objects.filter(company=company).select_related("user"):
            Notification.objects.create(
                recipient_user=m.user,
                recipient_company=company,
                type=Notification.NotificationType.CERTIFICATE_REMOVED,
                message=f"{request.user.name} ({request.user.phone}): Sertifikat o'chirildi",
            )
        return Response({"detail": "O'chirildi"})

    # Members management: add by user_id or phone (owner)
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def add_member(self, request, pk=None):
        company = self.get_object()
        # Check if user is a member of this company (owner or member)
        user_membership = CompanyMember.objects.filter(company=company, user=request.user).first()
        if not user_membership:
            return Response({"detail": "Siz bu kompaniyaning a'zosi emassiz"}, status=403)
        user_id = request.data.get("user_id")
        phone = request.data.get("phone")
        if not user_id and not phone:
            return Response({"detail": "user_id yoki phone talab qilinadi"}, status=400)
        try:
            target = User.objects.get(id=user_id) if user_id else User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({"detail": "Foydalanuvchi topilmadi"}, status=404)
        obj, created = CompanyMember.objects.get_or_create(company=company, user=target, defaults={"role": CompanyMember.Role.MEMBER})
        if not created:
            return Response({"detail": "Allaqachon a'zo"})
        for m in CompanyMember.objects.filter(company=company).select_related("user"):
            Notification.objects.create(
                recipient_user=m.user,
                recipient_company=company,
                type=Notification.NotificationType.MEMBER_ADDED,
                message=f"{request.user.name} ({request.user.phone}): A'zo qo'shildi: {target.name} ({target.phone})",
            )
        return Response(CompanyMemberSerializer(obj).data, status=201)
    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def members(self, request, pk=None):
        company = self.get_object()
        members = CompanyMember.objects.filter(company=company).select_related("user")
        return Response(CompanyMemberSerializer(members, many=True, context={"request": request}).data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def remove_member(self, request, pk=None):
        company = self.get_object()
        # Check if user is a member of this company (owner or member)
        user_membership = CompanyMember.objects.filter(company=company, user=request.user).first()
        if not user_membership:
            return Response({"detail": "Siz bu kompaniyaning a'zosi emassiz"}, status=403)
        
        # Only owner can remove other members, but members can remove themselves
        user_id = request.data.get("user_id")
        if user_membership.role != CompanyMember.Role.OWNER and str(user_membership.user.id) != str(user_id):
            return Response({"detail": "Faqat egasi boshqa a'zolarni o'chira oladi"}, status=403)
        if not user_id:
            return Response({"detail": "user_id talab qilinadi"}, status=400)
        CompanyMember.objects.filter(company=company, user_id=user_id).delete()
        for m in CompanyMember.objects.filter(company=company).select_related("user"):
            Notification.objects.create(
                recipient_user=m.user,
                recipient_company=company,
                type=Notification.NotificationType.MEMBER_REMOVED,
                message=f"{request.user.name} ({request.user.phone}): A'zo o'chirildi: {user_id}",
            )
        return Response({"detail": "O'chirildi"})

    # Notifications API
    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def my_notifications(self, request):
        qs = Notification.objects.filter(recipient_user=request.user).order_by("-created_at")
        data = [
            {
                "id": str(n.id),
                "message": n.message,
                "type": n.type,
                "read_at": n.read_at,
                "created_at": n.created_at,
            }
            for n in qs
        ]
        unread = qs.filter(read_at__isnull=True).count()
        return Response({"unread": unread, "results": data})

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def mark_all_read(self, request):
        Notification.objects.filter(recipient_user=request.user, read_at__isnull=True).update(read_at=timezone.now())
        return Response({"detail": "ok"})

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def mark_read(self, request):
        notif_id = request.data.get('id') or request.query_params.get('id')
        if not notif_id:
            return Response({"detail": "id talab qilinadi"}, status=400)
        try:
            n = Notification.objects.get(id=notif_id, recipient_user=request.user)
        except Notification.DoesNotExist:
            return Response({"detail": "Topilmadi"}, status=404)
        if n.read_at is None:
            n.read_at = timezone.now()
            n.save(update_fields=['read_at'])
        return Response({"detail": "ok"})

    # Items alohida ItemViewSet ga ko'chirildi

    # Requests → accept and complete via Orders
    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def incoming_requests(self, request, pk=None):
        company = self.get_object()
        if not CompanyMember.objects.filter(company=company, user=request.user).exists():
            return Response({"detail": "A'zo emas"}, status=403)
        
        qs = Request.objects.select_related('buyer_company', 'category').filter(status=Request.RequestStatus.OPEN)
        
        # Filterlar
        params = request.query_params
        search = params.get("search")
        category = params.get("category")
        region = params.get("region")
        status = params.get("status")
        ordering = params.get("ordering")
        
        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(description__icontains=search) | 
                Q(category__name__icontains=search) |
                Q(buyer_company__name__icontains=search)
            )
        if category:
            qs = qs.filter(category_id=category)
        if region:
            qs = qs.filter(region__icontains=region)
        if status:
            qs = qs.filter(status=status)
        if ordering in ["created_at", "-created_at", "deadline_date", "-deadline_date", "budget_to", "-budget_to"]:
            qs = qs.order_by(ordering)
        else:
            qs = qs.order_by("-created_at")
            
        data = [
            {
                "id": str(r.id),
                "buyer_company": str(r.buyer_company_id),
                "buyer_company_name": r.buyer_company.name,
                "category": str(r.category_id),
                "category_name": r.category.name,
                "description": r.description,
                "quantity": r.quantity,
                "unit": r.unit,
                "budget_from": r.budget_from,
                "budget_to": r.budget_to,
                "region": r.region,
                "deadline_date": r.deadline_date,
                "status": r.status,
                "created_at": r.created_at,
            }
            for r in qs
        ]
        return Response(data)

    @action(detail=True, methods=["get"], permission_classes=[permissions.AllowAny])
    def rating(self, request, pk=None):
        company = self.get_object()
        from api.models import Rating
        avg = Rating.objects.filter(rated_company=company).aggregate(avg=Avg("overall_score"))['avg'] or 0
        return Response({"company": str(company.id), "avg_rating": float(avg)})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def accept_request(self, request, pk=None):
        company = self.get_object()
        if not CompanyMember.objects.filter(company=company, user=request.user).exists():
            return Response({"detail": "A'zo emas"}, status=403)
        request_id = request.data.get("request_id")
        if not request_id:
            return Response({"detail": "request_id talab qilinadi"}, status=400)
        try:
            req = Request.objects.get(id=request_id, status=Request.RequestStatus.OPEN)
        except Request.DoesNotExist:
            return Response({"detail": "So'rov topilmadi"}, status=404)
        order = Order.objects.create(
            request=req,
            buyer_company=req.buyer_company,
            supplier_company=company,
            total_amount=request.data.get("total_amount", 0),
            status=Order.OrderStatus.IN_PROGRESS,
        )
        req.status = Request.RequestStatus.CLOSED
        req.save(update_fields=["status"])
        return Response({"order_id": str(order.id)}, status=201)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def complete_order(self, request, pk=None):
        company = self.get_object()
        if not CompanyMember.objects.filter(company=company, user=request.user).exists():
            return Response({"detail": "A'zo emas"}, status=403)
        order_id = request.data.get("order_id")
        if not order_id:
            return Response({"detail": "order_id talab qilinadi"}, status=400)
        try:
            order = Order.objects.get(id=order_id, supplier_company=company)
        except Order.DoesNotExist:
            return Response({"detail": "Buyurtma topilmadi"}, status=404)
        order.status = Order.OrderStatus.COMPLETED
        order.completed_at = None
        order.save(update_fields=["status", "completed_at"])
        return Response({"detail": "Buyurtma yakunlandi"})

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def metrics(self, request, pk=None):
        company = self.get_object()
        if not CompanyMember.objects.filter(company=company, user=request.user).exists():
            return Response({"detail": "A'zo emas"}, status=403)
        now = timezone.now()
        d7 = now - timedelta(days=7)
        d30 = now - timedelta(days=30)
        # Items
        items_qs = Item.objects.filter(company=company)
        items_total = items_qs.count()
        items_active = items_qs.filter(status=Item.ItemStatus.AVAILABLE).count()
        items_inactive = items_qs.exclude(status=Item.ItemStatus.AVAILABLE).count()
        items_added_7d = items_qs.filter(created_at__gte=d7).count()
        items_added_30d = items_qs.filter(created_at__gte=d30).count()
        # Members
        mem_qs = CompanyMember.objects.filter(company=company)
        members_total = mem_qs.count()
        owners = mem_qs.filter(role=CompanyMember.Role.OWNER).count()
        staff = mem_qs.exclude(role=CompanyMember.Role.OWNER).count()
        members_added_30d = mem_qs.filter(created_at__gte=d30).count()
        # Orders
        from api.models import Order as OrderModel
        ord_qs = Order.objects.filter(supplier_company=company)
        orders_in_progress = ord_qs.filter(status=OrderModel.OrderStatus.IN_PROGRESS).count()
        orders_completed = ord_qs.filter(status=OrderModel.OrderStatus.COMPLETED).count()
        orders_cancelled = ord_qs.filter(status=OrderModel.OrderStatus.CANCELLED).count()
        orders_completed_30d = ord_qs.filter(status=OrderModel.OrderStatus.COMPLETED, created_at__gte=d30).count()
        # Requests (open ones in system)
        req_open = Request.objects.filter(status=Request.RequestStatus.OPEN).count()
        # Ratings
        ratings_qs = Rating.objects.filter(rated_company=company)
        ratings_avg = ratings_qs.aggregate(avg=Avg('overall_score'))['avg'] or 0
        ratings_30d = ratings_qs.filter(created_at__gte=d30).count()
        return Response({
            "items": {
                "total": items_total,
                "active": items_active,
                "inactive": items_inactive,
                "added_7d": items_added_7d,
                "added_30d": items_added_30d,
            },
            "members": {
                "total": members_total,
                "owners": owners,
                "staff": staff,
                "added_30d": members_added_30d,
            },
            "orders": {
                "in_progress": orders_in_progress,
                "completed": orders_completed,
                "cancelled": orders_cancelled,
                "completed_30d": orders_completed_30d,
            },
            "requests": {
                "open": req_open,
            },
            "ratings": {
                "avg": float(ratings_avg),
                "count_30d": ratings_30d,
            },
        })

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def ratings(self, request, pk=None):
        """Company uchun rating'lar"""
        company = self.get_object()
        
        # Company'ga berilgan rating'lar
        ratings = Rating.objects.filter(rated_company=company).select_related('rater_company', 'order').order_by('-created_at')
        
        # Umumiy statistika
        total_ratings = ratings.count()
        if total_ratings > 0:
            avg_overall = ratings.aggregate(avg=Avg('overall_score'))['avg']
            avg_quality = ratings.aggregate(avg=Avg('quality_rating'))['avg']
            avg_delivery = ratings.aggregate(avg=Avg('delivery_speed'))['avg']
            avg_communication = ratings.aggregate(avg=Avg('communication'))['avg']
            avg_price = ratings.aggregate(avg=Avg('price_fairness'))['avg']
            avg_reliability = ratings.aggregate(avg=Avg('reliability'))['avg']
        else:
            avg_overall = avg_quality = avg_delivery = avg_communication = avg_price = avg_reliability = 0
        
        # Rating'lar ro'yxati
        ratings_data = []
        for rating in ratings:
            ratings_data.append({
                'id': rating.id,
                'rater_company': {
                    'id': rating.rater_company.id,
                    'name': rating.rater_company.name,
                },
                'order_id': rating.order.id,
                'quality_rating': rating.quality_rating,
                'delivery_speed': rating.delivery_speed,
                'communication': rating.communication,
                'price_fairness': rating.price_fairness,
                'reliability': rating.reliability,
                'overall_score': float(rating.overall_score),
                'comment': rating.comment,
                'project_type': rating.project_type,
                'order_volume': rating.order_volume,
                'created_at': rating.created_at,
            })
        
        return Response({
            'company': {
                'id': company.id,
                'name': company.name,
            },
            'statistics': {
                'total_ratings': total_ratings,
                'average_overall': round(avg_overall, 1) if avg_overall else 0,
                'average_quality': round(avg_quality, 1) if avg_quality else 0,
                'average_delivery': round(avg_delivery, 1) if avg_delivery else 0,
                'average_communication': round(avg_communication, 1) if avg_communication else 0,
                'average_price': round(avg_price, 1) if avg_price else 0,
                'average_reliability': round(avg_reliability, 1) if avg_reliability else 0,
            },
            'ratings': ratings_data
        })


class CompanyMemberViewSet(viewsets.ModelViewSet):
    queryset = CompanyMember.objects.select_related("company", "user").all().order_by("-created_at")
    serializer_class = CompanyMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

