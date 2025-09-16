from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from api.models import Item, CompanyMember, Company, Category, ItemImage, SubCategory, Notification, ItemDeletionReason
from .serializers import ItemSerializer
from django.db.models import Q


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.select_related("company", "category", "user").all().order_by("-created_at")
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        search = params.get("search") or params.get("q")
        category = params.get("category")
        unit = params.get("unit")
        status = params.get("status")
        subcategory = params.get("subcategory")
        min_price = params.get("min_price")
        max_price = params.get("max_price")
        region = params.get("region")
        company = params.get("company")
        ordering = params.get("ordering")
        
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if category:
            qs = qs.filter(category_id=category)
        if unit:
            qs = qs.filter(unit=unit)
        if status:
            qs = qs.filter(status=status)
        if subcategory:
            qs = qs.filter(subcategory_id=subcategory)
        if region:
            qs = qs.filter(company__region__icontains=region)
        if company:
            qs = qs.filter(company_id=company)
        if ordering in ["created_at", "-created_at", "price", "-price", "name", "-name"]:
            qs = qs.order_by(ordering)
        return qs

    def perform_create(self, serializer):
        company_id = self.request.data.get("company")
        if not company_id:
            raise ValueError("company talab qilinadi")
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            raise ValueError("Kompaniya topilmadi")
        if not CompanyMember.objects.filter(company=company, user=self.request.user).exists():
            raise PermissionError("A'zo emas")
        
        # Qo'shimcha validatsiyalar
        data = self.request.data
        
        # Name validatsiyasi
        name = data.get('name')
        if not name or len(name.strip()) < 2:
            raise ValueError("Mahsulot nomi kamida 2 ta belgi bo'lishi kerak")
        if len(name) > 200:
            raise ValueError("Mahsulot nomi juda uzun")
        
        # Description validatsiyasi
        description = data.get('description')
        if description and len(description) > 2000:
            raise ValueError("Tavsif juda uzun")
        
        # Price validatsiyasi
        price = data.get('price')
        if price:
            try:
                price_float = float(price)
                if price_float < 0:
                    raise ValueError("Narx manfiy bo'lishi mumkin emas")
                if price_float > 99999999999:  # 100 milliard
                    raise ValueError("Narx juda katta")
            except ValueError as e:
                if "could not convert" in str(e):
                    raise ValueError("Noto'g'ri narx formati")
                raise e
        
        # Quantity validatsiyasi
        quantity = data.get('quantity')
        if quantity:
            try:
                quantity_float = float(quantity)
                if quantity_float < 0:
                    raise ValueError("Miqdor manfiy bo'lishi mumkin emas")
                if quantity_float > 999999:  # 1 million
                    raise ValueError("Miqdor juda katta")
            except ValueError as e:
                if "could not convert" in str(e):
                    raise ValueError("Noto'g'ri miqdor formati")
                raise e
        
        # File validatsiyasi
        images = self.request.FILES.getlist("images")
        if images:
            if len(images) > 10:
                raise ValueError("Maksimal 10 ta rasm yuklashingiz mumkin")
            for img in images:
                if img.content_type not in ['image/jpeg', 'image/jpg', 'image/png']:
                    raise ValueError("Rasmlar faqat JPG, JPEG, PNG formatida bo'lishi kerak")
                if img.size > 5 * 1024 * 1024:  # 5MB per image
                    raise ValueError("Har bir rasm hajmi 5MB dan kichik bo'lishi kerak")
        
        item = serializer.save(user=self.request.user)
        # notify all company members about new item
        for m in CompanyMember.objects.filter(company=company).select_related("user"):
            Notification.objects.create(
                recipient_user=m.user,
                recipient_company=company,
                type=Notification.NotificationType.ITEM_CREATED,
                message=f"{self.request.user.name} ({self.request.user.phone}): Yangi mahsulot qo'shildi — {item.name}",
            )

    def perform_update(self, serializer):
        instance = self.get_object()
        if not CompanyMember.objects.filter(company=instance.company, user=self.request.user).exists():
            raise PermissionError("A'zo emas")
        item = serializer.save()
        # notify all company members about item update
        for m in CompanyMember.objects.filter(company=instance.company).select_related("user"):
            Notification.objects.create(
                recipient_user=m.user,
                recipient_company=instance.company,
                type=Notification.NotificationType.ITEM_UPDATED,
                message=f"{self.request.user.name} ({self.request.user.phone}): Mahsulot yangilandi — {item.name}",
            )

    def perform_destroy(self, instance):
        if not CompanyMember.objects.filter(company=instance.company, user=self.request.user).exists():
            raise PermissionError("A'zo emas")
        
        # O'chirish sababini olish
        subject = self.request.data.get("deletion_reason", "")
        if not subject:
            subject = "Sabab kiritilmagan"
        
        # ItemDeletionReason yaratish
        ItemDeletionReason.objects.create(
            company_name=instance.company.name,
            company_id=instance.company.id,
            user_name=self.request.user.name,
            user_phone=self.request.user.phone,
            user_id=self.request.user.id,
            subject=subject
        )
        
        name = instance.name
        company = instance.company
        instance.delete()
        for m in CompanyMember.objects.filter(company=company).select_related("user"):
            Notification.objects.create(
                recipient_user=m.user,
                recipient_company=company,
                type=Notification.NotificationType.ITEM_DELETED,
                message=f"{self.request.user.name} ({self.request.user.phone}): Mahsulot o'chirildi — {name}",
            )

    @action(detail=True, methods=["get", "post", "delete"], permission_classes=[permissions.IsAuthenticated])
    def images(self, request, pk=None):
        item = self.get_object()
        if not CompanyMember.objects.filter(company=item.company, user=request.user).exists():
            return Response({"detail": "A'zo emas"}, status=403)
        if request.method == "GET":
            data = [{"id": str(img.id), "url": request.build_absolute_uri(img.image.url)} for img in item.images.all()]
            return Response(data)
        if request.method == "POST":
            images = request.FILES.getlist("images")
            if not images:
                return Response({"detail": "Rasmlar talab qilinadi"}, status=400)
            
            # File validatsiyasi
            if len(images) > 10:
                return Response({"detail": "Maksimal 10 ta rasm yuklashingiz mumkin"}, status=400)
            
            for img in images:
                if img.content_type not in ['image/jpeg', 'image/jpg', 'image/png']:
                    return Response({"detail": "Rasmlar faqat JPG, JPEG, PNG formatida bo'lishi kerak"}, status=400)
                if img.size > 5 * 1024 * 1024:  # 5MB per image
                    return Response({"detail": "Har bir rasm hajmi 5MB dan kichik bo'lishi kerak"}, status=400)
            
            for img in images:
                ItemImage.objects.create(item=item, image=img)
            data = [{"id": str(img.id), "url": request.build_absolute_uri(img.image.url)} for img in item.images.all()]
            return Response(data, status=201)
        # DELETE
        image_id = request.data.get("image_id") or request.query_params.get("image_id")
        if not image_id:
            return Response({"detail": "image_id talab qilinadi"}, status=400)
        try:
            obj = ItemImage.objects.get(id=image_id, item=item)
        except ItemImage.DoesNotExist:
            return Response({"detail": "Rasm topilmadi"}, status=404)
        obj.delete()
        return Response({"detail": "O'chirildi"})

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def categories(self, request):
        items = Category.objects.all().order_by("name").values("id", "name")
        return Response(list(items))

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def units(self, request):
        units = [
            {"value": choice[0], "label": choice[1]}
            for choice in Item.Unit.choices
        ]
        return Response(units)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def meta(self, request):
        cats = Category.objects.all().order_by("name").values("id", "name")
        subs = SubCategory.objects.select_related('category').all().order_by("name").values("id", "name", "category_id", "unit")
        units = [
            {"value": choice[0], "label": choice[1]}
            for choice in Item.Unit.choices
        ]
        statuses = [
            {"value": choice[0], "label": choice[1]}
            for choice in Item.ItemStatus.choices
        ]
        companies = Company.objects.filter(type=Company.CompanyType.SUPPLIER).order_by("name").values("id", "name")
        regions = Company.objects.exclude(region__isnull=True).exclude(region__exact='').values_list('region', flat=True).distinct().order_by('region')
        
        return Response({
            "categories": list(cats),
            "subcategories": list(subs),
            "units": units,
            "statuses": statuses,
            "companies": list(companies),
            "regions": list(regions),
        })

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def categories(self, request):
        cats = Category.objects.all().order_by("name").values("id", "name")
        return Response(list(cats))

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def subcategories(self, request):
        cat_id = request.query_params.get('category')
        qs = SubCategory.objects.all()
        if cat_id:
            qs = qs.filter(category_id=cat_id)
        data = list(qs.order_by('name').values('id','name','category_id','unit'))
        return Response(data)

