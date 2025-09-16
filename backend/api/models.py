from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
import uuid
from datetime import timedelta
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal, ROUND_HALF_UP
from django.utils.text import slugify


def default_request_expires_at():
    return timezone.now() + timedelta(days=1)

def default_offer_expires_at():
    return timezone.now() + timedelta(days=1)


class User(AbstractUser):
    class UserType(models.TextChoices):
        SELLER = "sotuvchi", "sotuvchi"
        BUYER = "sotib_oluvchi", "sotib_oluvchi"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=UserType.choices)
    image = models.ImageField(upload_to="users/images/", blank=True, null=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return f"{self.name} ({self.phone}) ({self.type})"


class Company(models.Model):
    class CompanyType(models.TextChoices):
        BUYER = "sotib_oluvchi", "sotib_oluvchi"
        SUPPLIER = "sotuvchi", "sotuvchi"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=20, choices=CompanyType.choices)
    inn = models.CharField(max_length=20, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    verified = models.BooleanField(default=True)
    def _documents_upload_path(self, filename: str) -> str:
        safe_name = slugify(self.name or "company")
        return f"companies/{safe_name}/documents/{filename}"

    def _certificate_upload_path(self, filename: str) -> str:
        safe_name = slugify(self.name or "company")
        return f"companies/{safe_name}/certificates/{filename}"

    documents = models.FileField(upload_to=_documents_upload_path, blank=True, null=True)
    def _logo_upload_path(self, filename: str) -> str:
        safe_name = slugify(self.name or "company")
        return f"companies/{safe_name}/logo/{filename}"
    logo = models.ImageField(upload_to=_logo_upload_path, blank=True, null=True)
    sertificate = models.ImageField(upload_to=_certificate_upload_path, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.type})"


class CompanyCertificate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="certificates")

    def _upload_path(self, filename: str) -> str:
        safe_name = slugify(self.company.name or "company")
        return f"companies/{safe_name}/certificates/{filename}"

    image = models.ImageField(upload_to=_upload_path)
    created_at = models.DateTimeField(auto_now_add=True)

class CompanyMember(models.Model):
    class Role(models.TextChoices):
        OWNER = "egasi", "egasi"
        MEMBER = "xodim", "xodim"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="company_memberships")
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.MEMBER)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ("company", "user")

    def __str__(self) -> str:
        return f"{self.user.name} @ {self.company.name} ({self.role})"


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f"{self.name}"


class SubCategory(models.Model):
    class Unit(models.TextChoices):
        TONNA = "tonna", "tonna"
        M3 = "m3", "m3"
        DONA = "dona", "dona"
        KILOGRAM = "kg", "kg"
        QOP = "qop", "qop"
        QUTIQ = "quti", "quti"
        METR = "m", "m"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
    name = models.CharField(max_length=100)
    unit = models.CharField(max_length=20, blank=True, null=True, choices=Unit.choices, help_text="Sub kategoriya uchun default birlik")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("category", "name")

    def __str__(self) -> str:
        return f"{self.category.name} / {self.name}"

class Item(models.Model):
    class ItemStatus(models.TextChoices):
        AVAILABLE = "mavjud", "mavjud"
        UNAVAILABLE = "mavjud_emas", "mavjud_emas"
        SOLD = "sotildi", "sotildi"

    class Unit(models.TextChoices):
        TONNA = "tonna", "tonna"
        M3 = "m3", "m3"
        DONA = "dona", "dona"
        KILOGRAM = "kg", "kg"
        QOP = "qop", "qop"
        QUTIQ = "quti", "quti"
        METR = "m", "m"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="items")
    subcategory = models.ForeignKey('SubCategory', on_delete=models.SET_NULL, related_name='items', null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="items")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="items")
    status = models.CharField(max_length=50, choices=ItemStatus.choices, default=ItemStatus.AVAILABLE)
    description = models.TextField()
    quantity = models.IntegerField()
    unit = models.CharField(max_length=50, choices=Unit.choices, default=Unit.TONNA)
    price = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f"{self.name} ({self.category.name}) ({self.company.name}) ({self.user.name})"


class ItemImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="images")

    def _image_upload_path(self, filename: str) -> str:
        return f"items/{self.item.id}/images/{filename}"

    image = models.ImageField(upload_to=_image_upload_path)
    created_at = models.DateTimeField(auto_now_add=True)


class Request(models.Model):
    class RequestStatus(models.TextChoices):
        OPEN = "ochiq", "ochiq"
        CLOSED = "yopilgan", "yopilgan"
        CANCELLED = "bekor_qilindi", "bekor_qilindi"
        EXPIRED = "muddati_tugadi", "muddati_tugadi"

    class PaymentType(models.TextChoices):
        CASH = "naqd_pul", "naqd_pul"
        BANK = "bank", "bank"
        CREDIT = "kredit", "kredit"
        OTHER = "boshqa", "boshqa"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer_company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="buyer_requests")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="requests")
    description = models.TextField()
    quantity = models.IntegerField()
    unit = models.CharField(max_length=50, choices=Item.Unit.choices)
    payment_type = models.CharField(max_length=50, choices=PaymentType.choices, default=PaymentType.CASH)
    budget_from = models.BigIntegerField(null=True, blank=True)
    budget_to = models.BigIntegerField(null=True, blank=True)
    region = models.CharField(max_length=100)
    delivery_address = models.TextField()
    deadline_date = models.DateField()
    status = models.CharField(max_length=50, choices=RequestStatus.choices, default='ochiq')
    cancellation_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_request_expires_at)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f"{self.buyer_company.name} ({self.category.name}) ({self.region}) ({self.status})"

    class Meta:
        indexes = [
            models.Index(fields=["category", "region", "status"], name="idx_req_cat_reg_stat"),
        ]


# -- Verification codes for phone sign-up
class VerificationCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["phone", "created_at"], name="idx_vc_phone_time"),
        ]

    def is_valid_now(self) -> bool:
        return self.used_at is None and timezone.now() < self.expires_at


class Offer(models.Model):
    class OfferStatus(models.TextChoices):
        PENDING = "kutilmoqda", "kutilmoqda"
        ACCEPTED = "qabul_qilindi", "qabul_qilindi"
        REJECTED = "rad_etildi", "rad_etildi"
        CANCELLED = "bekor_qilindi", "bekor_qilindi"
        EXPIRED = "muddati_tugadi", "muddati_tugadi"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="offers")
    supplier_company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="offers")
    price = models.BigIntegerField()
    currency = models.CharField(max_length=3, default="UZS")
    eta_days = models.IntegerField()  # delivery time in days
    delivery_included = models.BooleanField(default=False)
    
    # Qo'shimcha fieldlar
    warranty_period = models.IntegerField(default=0, help_text="Kafolat muddati (oy)")  # Kafolat muddati
    special_conditions = models.TextField(blank=True, null=True, help_text="Maxsus shartlar")  # Maxsus shartlar
    
    # Eski fieldlar (olib tashlash uchun)
    comment = models.TextField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=OfferStatus.choices, default='kutilmoqda')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_offer_expires_at)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["request", "status"], name="idx_off_req_stat"),
        ]

    def __str__(self) -> str:
        return f"{self.supplier_company.name} ({self.request.category.name}) ({self.price}) ({self.status})"


class Order(models.Model):
    class OrderStatus(models.TextChoices):
        OPEN = "ochilgan", "ochilgan"
        WAITING_PAYMENT = "to_lov_kutilmoqda", "to'lov kutilmoqda"
        PAID = "to_lov_qilindi", "to'lov qilindi"
        IN_PROGRESS = "yeg_ilmoqda", "yeg'ilmoqda"
        ON_THE_WAY = "yo_lda", "yo'lda"
        DELIVERED = "yetib_bordi", "yetib bordi"
        CASH_PAYMENT_WAITING = "naqd_tolov_kutilmoqda", "naqd to'lov kutilmoqda"
        CASH_PAYMENT_CONFIRMED = "naqd_tolov_qabul_qilindi", "naqd to'lov qabul qilindi"
        COMPLETED = "yakunlandi", "yakunlandi"
        CANCELLED = "bekor_qilindi", "bekor qilindi"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="orders")
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name="orders", null=True, blank=True)
    buyer_company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="buyer_orders")
    supplier_company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="supplier_orders")
    total_amount = models.BigIntegerField()
    payment_terms = models.CharField(max_length=200, blank=True, null=True)  # To'lov shartlari
    status = models.CharField(max_length=50, choices=OrderStatus.choices, default=OrderStatus.OPEN)
    
    # To'lov hujjatlari
    payment_document = models.FileField(upload_to='orders/payments/', blank=True, null=True)
    payment_confirmed_at = models.DateTimeField(blank=True, null=True)
    
    # Yetkazib berish hujjatlari
    ttn_document = models.FileField(upload_to='orders/ttn/', blank=True, null=True)
    delivery_photos = models.JSONField(default=list, blank=True)  # Yetkazib berish rasmlari
    
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    cancelled_at = models.DateTimeField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["buyer_company", "supplier_company", "status"], name="idx_ord_comp_stat"),
        ]


class Rating(models.Model):
    class OrderVolume(models.TextChoices):
        SMALL = "kichik", "kichik"
        MEDIUM = "orta", "orta"
        LARGE = "katta", "katta"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="ratings")
    rater_company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="ratings_given")
    rated_company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="ratings_received")

    quality_rating = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    delivery_speed = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    communication = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    price_fairness = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    reliability = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])

    overall_score = models.DecimalField(max_digits=3, decimal_places=1, default=1)
    comment = models.TextField(blank=True, null=True)
    project_type = models.CharField(max_length=100, blank=True, null=True)
    order_volume = models.CharField(max_length=50, choices=OrderVolume.choices, default=OrderVolume.SMALL)

    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ("order", "rater_company", "rated_company")

    def save(self, *args, **kwargs):
        ratings = [
            self.quality_rating,
            self.delivery_speed,
            self.communication,
            self.price_fairness,
            self.reliability,
        ]
        avg = sum(ratings) / 5
        self.overall_score = Decimal(str(avg)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
        super().save(*args, **kwargs)
    
    def __str__(self) -> str:
        return f"{self.rater_company.name} ({self.rated_company.name}) ({self.overall_score})"


class ItemDeletionReason(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=200)
    company_id = models.UUIDField()
    user_name = models.CharField(max_length=100)
    user_phone = models.CharField(max_length=20)
    user_id = models.UUIDField()
    subject = models.TextField(help_text="Mahsulotni o'chirish sababi")
    deleted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-deleted_at']

    def __str__(self) -> str:
        return f"{self.company_name} - {self.subject[:50]}..."


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        PROFILE_UPDATED = "profile_updated", "profile_updated"
        PASSWORD_CHANGED = "password_changed", "password_changed"
        COMPANY_PROFILE_UPDATED = "company_profile_updated", "company_profile_updated"
        CERTIFICATE_ADDED = "certificate_added", "certificate_added"
        CERTIFICATE_REMOVED = "certificate_removed", "certificate_removed"
        MEMBER_ADDED = "member_added", "member_added"
        MEMBER_REMOVED = "member_removed", "member_removed"
        ITEM_CREATED = "item_created", "item_created"
        ITEM_UPDATED = "item_updated", "item_updated"
        ITEM_DELETED = "item_deleted", "item_deleted"
        NEW_REQUEST = "new_request", "new_request"
        NEW_OFFER = "new_offer", "new_offer"
        OFFER_ACCEPTED = "offer_accepted", "offer_accepted"
        OFFER_REJECTED = "offer_rejected", "offer_rejected"
        ORDER_CREATED = "order_created", "order_created"
        ORDER_UPDATED = "order_updated", "order_updated"
        ORDER_COMPLETED = "order_completed", "order_completed"
        ORDER_PAYMENT_CONFIRMED = "order_payment_confirmed", "order_payment_confirmed"
        ORDER_PRODUCTION_STARTED = "order_production_started", "order_production_started"
        ORDER_SHIPPED = "order_shipped", "order_shipped"
        ORDER_DELIVERED = "order_delivered", "order_delivered"
        ORDER_CANCELLED = "order_cancelled", "order_cancelled"
        RATING_REQUEST = "rating_request", "rating_request"
        RATING_RECEIVED = "rating_received", "rating_received"
        INFO = "info", "info"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    recipient_company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    type = models.CharField(max_length=50, choices=NotificationType.choices)
    message = models.TextField()
    related_request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    related_order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    read_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        user_name = self.recipient_user.name if self.recipient_user else "No User"
        company_name = self.recipient_company.name if self.recipient_company else "No Company"
        return f"{user_name} ({company_name}) ({self.type})"

    class Meta:
        indexes = [
            models.Index(fields=["recipient_user", "read_at"], name="idx_notif_rec_read"),
        ]

