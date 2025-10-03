from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator, FileExtensionValidator
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    """
    MetOneX platform uchun asosiy foydalanuvchi modeli
    """
    class UserRole(models.TextChoices):
        BUYER = 'buyer', 'Sotib oluvchi'
        SUPPLIER = 'supplier', 'Sotuvchi'
    
    class SupplierType(models.TextChoices):
        MANUFACTURER = 'manufacturer', 'Ishlab chiqaruvchi'
        DEALER = 'dealer', 'Diler'

    # Qisqa ID - UUID o'rniga AutoField
    id = models.AutoField(primary_key=True)
    
    # Asosiy ma'lumotlar
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    phone = models.CharField(
        max_length=20, 
        unique=True,
        validators=[RegexValidator(
            r'^\+998\d{9}$',
            message='Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'
        )]
    )
    phone_verified = models.BooleanField(default=False)
    
    # Role va type
    role = models.CharField(
        max_length=20, 
        choices=UserRole.choices,
        help_text='Foydalanuvchi roli'
    )
    supplier_type = models.CharField(
        max_length=20, 
        choices=SupplierType.choices,
        null=True, 
        blank=True,
        help_text='Faqat sotuvchilar uchun'
    )
    
    # Profil ma'lumotlari
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    avatar = models.ImageField(
        upload_to='users/avatars/', 
        null=True, 
        blank=True
    )
    
    # Push notification
    device_token = models.CharField(max_length=255, blank=True, verbose_name='Device Token')
    
    # Status va vaqt
    is_active = models.BooleanField(default=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True, protocol='both')
    last_login_at = models.DateTimeField(null=True, blank=True, verbose_name='Oxirgi kirish vaqti')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'
        verbose_name = 'Foydalanuvchi'
        verbose_name_plural = 'Foydalanuvchilar'
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['role']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.phone})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.phone

    def is_supplier(self):
        return self.role == self.UserRole.SUPPLIER

    def is_buyer(self):
        return self.role == self.UserRole.BUYER

    def is_manufacturer(self):
        return self.supplier_type == self.SupplierType.MANUFACTURER

    def is_dealer(self):
        return self.supplier_type == self.SupplierType.DEALER


class Company(models.Model):
    """
    Kompaniya profili - texnik talablarga mos
    """
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company')
    
    # Asosiy ma'lumotlar
    name = models.CharField(max_length=255, verbose_name='Kompaniya nomi')
    legal_address = models.TextField(blank=True, verbose_name='Yuridik manzil')
    inn_stir = models.CharField(max_length=50, blank=True, verbose_name='INN/STIR')
    
    # Bank ma'lumotlari
    bank_details = models.JSONField(default=dict, blank=True, verbose_name='Bank ma\'lumotlari')
    accountant_contact = models.JSONField(default=dict, blank=True, verbose_name='Buxgalter aloqasi')
    
    # Aloqa
    telegram_owner = models.CharField(max_length=100, blank=True, verbose_name='Telegram egasi')
    
    # Verification
    is_verified = models.BooleanField(default=False, verbose_name='Tasdiqlangan')
    verification_documents = models.JSONField(default=list, blank=True, verbose_name='Tasdiqlash hujjatlari')
    
    # Team members
    team_members = models.JSONField(default=list, blank=True, verbose_name='Jamoa a\'zolari')
    
    # Vaqt
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'companies'
        verbose_name = 'Kompaniya'
        verbose_name_plural = 'Kompaniyalar'

    def __str__(self):
        return self.name


class CompanyMember(models.Model):
    """
    Kompaniya a'zolari - alohida model
    """
    class Role(models.TextChoices):
        OWNER = 'owner', 'Egasi'
        ADMIN = 'admin', 'Administrator'
        MANAGER = 'manager', 'Menejer'
        EMPLOYEE = 'employee', 'Xodim'
        ACCOUNTANT = 'accountant', 'Buxgalter'

    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='company_memberships', null=True, blank=True)
    
    # Member ma'lumotlari
    name = models.CharField(max_length=255, verbose_name='Ism')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.EMPLOYEE, verbose_name='Rol')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Telefon raqami')
    telegram_username = models.CharField(max_length=100, blank=True, verbose_name='Telegram username')
    email = models.EmailField(blank=True, verbose_name='Email')
    
    # Qo'shimcha ma'lumotlar
    is_active = models.BooleanField(default=True, verbose_name='Faol')
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name='Qo\'shilgan vaqt')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Yangilangan vaqt')

    class Meta:
        db_table = 'company_members'
        verbose_name = 'Kompaniya a\'zosi'
        verbose_name_plural = 'Kompaniya a\'zolari'
        unique_together = ['company', 'user']  # Bir user bir kompaniyada faqat bitta role

    def __str__(self):
        return f"{self.name} - {self.company.name} ({self.get_role_display()})"


class Unit(models.Model):
    """
    O'lchov birliklari - admin paneldan boshqariladi
    """
    class UnitType(models.TextChoices):
        WEIGHT = 'weight', 'Og\'irlik'
        VOLUME = 'volume', 'Hajm'
        PIECE = 'piece', 'Dona'
        LENGTH = 'length', 'Uzunlik'
        AREA = 'area', 'Maydon'

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True, verbose_name='Birlik nomi')
    symbol = models.CharField(max_length=10, verbose_name='Belgisi', help_text='Masalan: ton, m3, pcs, m')
    unit_type = models.CharField(
        max_length=20, 
        choices=UnitType.choices,
        verbose_name='Birlik turi'
    )
    is_active = models.BooleanField(default=True, verbose_name='Faol')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'units'
        verbose_name = 'O\'lchov birligi'
        verbose_name_plural = 'O\'lchov birliklari'
        ordering = ['unit_type', 'name']

    def __str__(self):
        return f"{self.name} ({self.symbol})"
    
    @classmethod
    def get_units_by_type(cls, unit_type):
        """Birlik turi bo'yicha birliklarni qaytarish"""
        return cls.objects.filter(unit_type=unit_type, is_active=True)
    
    @classmethod
    def get_weight_units(cls):
        """Og'irlik birliklarini qaytarish"""
        return cls.get_units_by_type(cls.UnitType.WEIGHT)
    
    @classmethod
    def get_volume_units(cls):
        """Hajm birliklarini qaytarish"""
        return cls.get_units_by_type(cls.UnitType.VOLUME)
    
    @classmethod
    def get_piece_units(cls):
        """Dona birliklarini qaytarish"""
        return cls.get_units_by_type(cls.UnitType.PIECE)
    
    @classmethod
    def get_length_units(cls):
        """Uzunlik birliklarini qaytarish"""
        return cls.get_units_by_type(cls.UnitType.LENGTH)
    
    @classmethod
    def get_area_units(cls):
        """Maydon birliklarini qaytarish"""
        return cls.get_units_by_type(cls.UnitType.AREA)


class Category(models.Model):
    """
    Mahsulot kategoriyalari
    """
    class UnitType(models.TextChoices):
        WEIGHT = 'weight', 'Og\'irlik'
        VOLUME = 'volume', 'Hajm'
        PIECE = 'piece', 'Dona'
        LENGTH = 'length', 'Uzunlik'
        AREA = 'area', 'Maydon'

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, verbose_name='Kategoriya nomi')
    slug = models.SlugField(max_length=100, unique=True, verbose_name='Slug')
    unit_type = models.CharField(
        max_length=20, 
        choices=UnitType.choices,
        verbose_name='Birlik turi'
    )
    default_unit = models.ForeignKey(
        Unit, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='default_categories',
        verbose_name='Standart birlik'
    )

    is_active = models.BooleanField(default=True, verbose_name='Faol')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Kategoriya'
        verbose_name_plural = 'Kategoriyalar'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_available_units(self):
        """Kategoriya uchun mavjud birliklarni qaytarish"""
        return Unit.objects.filter(unit_type=self.unit_type, is_active=True)
    
    def get_default_unit(self):
        """Kategoriya uchun standart birlikni qaytarish"""
        if self.default_unit:
            return self.default_unit
        # Agar default_unit yo'q bo'lsa, birinchi mavjud birlikni qaytarish
        available_units = self.get_available_units()
        return available_units.first() if available_units.exists() else None


class SubCategory(models.Model):
    """
    Mahsulot sub-kategoriyalari
    """
    id = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100, verbose_name='Sub-kategoriya nomi')
    slug = models.SlugField(max_length=100, verbose_name='Slug')
    is_active = models.BooleanField(default=True, verbose_name='Faol')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subcategories'
        verbose_name = 'Sub-kategoriya'
        verbose_name_plural = 'Sub-kategoriyalar'
        unique_together = ['category', 'slug']
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.category.name} - {self.name}"

    def get_available_units(self):
        """Sub-kategoriya uchun mavjud birliklarni qaytarish"""
        return self.category.get_available_units()
    
    def get_default_unit(self):
        """Sub-kategoriya uchun standart birlikni qaytarish"""
        return self.category.get_default_unit()


class SupplierCategory(models.Model):
    """
    Sotuvchi va kategoriya bog'lanishi
    """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='supplier_categories')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='suppliers')

    class Meta:
        db_table = 'supplier_categories'
        unique_together = ['user', 'category']
        verbose_name = 'Sotuvchi kategoriyasi'
        verbose_name_plural = 'Sotuvchi kategoriyalari'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.category.name}"


class Factory(models.Model):
    """
    Zavodlar (dilerlar uchun)
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, verbose_name='Zavod nomi')
    location = models.CharField(max_length=255, blank=True, verbose_name='Manzil')
    contact_info = models.TextField(blank=True, verbose_name='Aloqa ma\'lumotlari')
    website = models.URLField(blank=True, verbose_name='Veb-sayt')
    description = models.TextField(blank=True, verbose_name='Tavsif')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'factories'
        verbose_name = 'Zavod'
        verbose_name_plural = 'Zavodlar'

    def __str__(self):
        return self.name


class DealerFactory(models.Model):
    """
    Diler va zavod bog'lanishi
    """
    id = models.AutoField(primary_key=True)
    dealer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dealer_factories')
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='dealers')

    class Meta:
        db_table = 'dealer_factories'
        unique_together = ['dealer', 'factory']
        verbose_name = 'Diler zavod'
        verbose_name_plural = 'Diler zavodlar'

    def __str__(self):
        return f"{self.dealer.get_full_name()} - {self.factory.name}"


class Product(models.Model):
    """
    Mahsulotlar katalogi - TZ ga mos ravishda
    """
    id = models.AutoField(primary_key=True)
    supplier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    factory = models.ForeignKey(Factory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    
    # Mahsulot ma'lumotlari
    brand = models.CharField(max_length=100, verbose_name='Brend')
    grade = models.CharField(max_length=100, verbose_name='Marka')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='products')
    
    # Narx va miqdor
    base_price = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Asosiy narx')
    currency = models.CharField(max_length=3, default='UZS', verbose_name='Valyuta')
    min_order_quantity = models.DecimalField(max_digits=20, decimal_places=2, default=1, verbose_name='Minimal buyurtma')
    # Yetkazib berish joylari
    delivery_locations = models.JSONField(default=list, help_text='Yetkazib berish joylari ro\'yxati')
    
    # Media fayllar
    photos = models.JSONField(default=list, help_text='Rasmlar URL ro\'yxati')
    certificates = models.JSONField(default=list, help_text='Sertifikatlar URL ro\'yxati')
    
    # Qo'shimcha ma'lumotlar
    specifications = models.JSONField(default=dict, blank=True, verbose_name='Texnik xususiyatlar')
    material = models.CharField(max_length=100, blank=True, verbose_name='Material turi')
    origin_country = models.CharField(max_length=100, blank=True, verbose_name='Ishlab chiqarish davlati')
    warranty_period = models.IntegerField(default=0, verbose_name='Kafolat muddati (oy)')
    
    # Analytics
    view_count = models.IntegerField(default=0, verbose_name='Ko\'rishlar soni')
    rating = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name='Reyting')
    review_count = models.IntegerField(default=0, verbose_name='Sharhlar soni')
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, verbose_name='Taniqli mahsulot')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        verbose_name = 'Mahsulot'
        verbose_name_plural = 'Mahsulotlar'
        indexes = [
            models.Index(fields=['supplier', 'is_active']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return f"{self.brand} {self.grade} ({self.category.name})"

    def get_main_photo(self):
        """Asosiy rasmni olish"""
        return self.photos[0] if self.photos else None

    def is_dealer_product(self):
        """Diler mahsulotimi tekshirish"""
        return self.factory is not None


class VerificationCode(models.Model):
    """
    Telefon raqami tasdiqlash uchun kodlar
    """
    id = models.AutoField(primary_key=True)
    phone = models.CharField(max_length=20)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    attempts = models.IntegerField(default=0)

    class Meta:
        db_table = 'verification_codes'
        verbose_name = 'Tasdiqlash kodi'
        verbose_name_plural = 'Tasdiqlash kodlari'
        indexes = [
            models.Index(fields=['phone', 'created_at']),
            models.Index(fields=['expires_at']),
        ]

    def is_valid(self):
        """Kod hali ham amal qiladimi tekshirish"""
        return (
            self.used_at is None and 
            timezone.now() < self.expires_at and
            self.attempts < 3
        )

    def mark_as_used(self):
        """Kodni ishlatilgan deb belgilash"""
        self.used_at = timezone.now()
        self.save()

    def increment_attempts(self):
        """Urinishlar sonini oshirish"""
        self.attempts += 1
        self.save()

    def __str__(self):
        return f"{self.phone} - {self.code}"


class UserSession(models.Model):
    """
    Foydalanuvchi sessiyalari
    """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    device_info = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(protocol='both')
    user_agent = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_sessions'
        verbose_name = 'Foydalanuvchi sessiyasi'
        verbose_name_plural = 'Foydalanuvchi sessiyalari'
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['last_activity']),
        ]


class RFQ(models.Model):
    """
    Request for Quote - Sotib oluvchi so'rovi
    """
    class RFQStatus(models.TextChoices):
        ACTIVE = 'active', 'Faol'
        COMPLETED = 'completed', 'Yakunlangan'
        CANCELLED = 'cancelled', 'Bekor qilingan'
        EXPIRED = 'expired', 'Muddati tugagan'

    class PaymentMethod(models.TextChoices):
        BANK = 'bank', 'Bank'
        CASH = 'cash', 'Naqd pul'

    id = models.AutoField(primary_key=True)
    
    # Asosiy bog'lanishlar
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rfqs')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='rfqs')
    subcategory = models.ForeignKey(
        SubCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='rfqs',
        verbose_name='Sub-kategoriya'
    )
    
    # Mahsulot ma'lumotlari
    brand = models.CharField(max_length=100, blank=True, verbose_name='Brend')
    grade = models.CharField(max_length=100, blank=True, verbose_name='Sifat')
    sizes = models.JSONField(default=list, blank=True, verbose_name='O\'lchamlar')
    volume = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Hajm')
    unit = models.ForeignKey(
        Unit, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='rfqs',
        verbose_name='Birlik'
    )
    
    # Yetkazib berish
    delivery_location = models.CharField(max_length=255, verbose_name='Yetkazib berish joyi')
    delivery_date = models.DateField(verbose_name='Yetkazib berish sanasi')
    
    # To'lov
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, verbose_name='To\'lov usuli')
    
    # Status
    status = models.CharField(max_length=20, choices=RFQStatus.choices, default=RFQStatus.ACTIVE, verbose_name='Holat')
    
    # Vaqt
    expires_at = models.DateTimeField(verbose_name='Muddati')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rfqs'
        verbose_name = 'So\'rov'
        verbose_name_plural = 'So\'rovlar'
        indexes = [
            models.Index(fields=['buyer', 'status']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['subcategory', 'status']),
            models.Index(fields=['delivery_date']),
            models.Index(fields=['expires_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.buyer.get_full_name()} - {self.category.name} ({self.volume} {self.unit.name if self.unit else 'N/A'})"

    def is_expired(self):
        """RFQ muddati tugaganmi tekshirish"""
        return timezone.now() > self.expires_at

    def can_receive_offers(self):
        """RFQ takliflar qabul qila oladimi"""
        return self.status == self.RFQStatus.ACTIVE and not self.is_expired()

    def clean(self):
        """Validatsiya"""
        from django.core.exceptions import ValidationError
        
        # Unit kategoriya bilan mos kelishi kerak
        if self.unit and self.category:
            if self.unit.unit_type != self.category.unit_type:
                raise ValidationError({
                    'unit': f'Birlik kategoriya turiga mos kelmaydi. Kategoriya: {self.category.unit_type}, Birlik: {self.unit.unit_type}'
                })
        
        # Sub-kategoriya kategoriya bilan mos kelishi kerak
        if self.subcategory and self.category:
            if self.subcategory.category != self.category:
                raise ValidationError({
                    'subcategory': 'Sub-kategoriya kategoriya bilan mos kelmaydi'
                })



class Offer(models.Model):
    """
    Sotuvchining taklifi
    """
    class OfferStatus(models.TextChoices):
        PENDING = 'pending', 'Kutilmoqda'
        ACCEPTED = 'accepted', 'Qabul qilingan'
        REJECTED = 'rejected', 'Rad etilgan'
        COUNTER_OFFERED = 'counter_offered', 'Qarshi taklif'

    id = models.AutoField(primary_key=True)
    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE, related_name='offers')
    supplier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='offers')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='offers')
    
    # Taklif ma'lumotlari
    price_per_unit = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Birlik narxi')
    total_amount = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Jami summa')
    
    # Yetkazib berish shartlari
    delivery_terms = models.CharField(max_length=255, verbose_name='Yetkazib berish shartlari')
    delivery_date = models.DateField(verbose_name='Yetkazib berish sanasi')
    
    # Status
    status = models.CharField(max_length=20, choices=OfferStatus.choices, default=OfferStatus.PENDING)
    rejection_reason = models.TextField(blank=True, verbose_name='Rad etish sababi')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'offers'
        verbose_name = 'Taklif'
        verbose_name_plural = 'Takliflar'
        indexes = [
            models.Index(fields=['rfq']),
            models.Index(fields=['supplier']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.supplier.get_full_name()} - {self.rfq} ({self.price_per_unit})"

    def accept(self):
        """Taklifni qabul qilish"""
        self.status = self.OfferStatus.ACCEPTED
        self.save()

    def reject(self, reason=''):
        """Taklifni rad etish"""
        self.status = self.OfferStatus.REJECTED
        self.rejection_reason = reason
        self.save()
    
    def can_be_accepted(self):
        """Taklif qabul qilinadimi tekshirish"""
        return self.status == self.OfferStatus.PENDING


class CounterOffer(models.Model):
    """
    Qarshi takliflar
    """
    class CounterOfferStatus(models.TextChoices):
        PENDING = 'pending', 'Kutilmoqda'
        ACCEPTED = 'accepted', 'Qabul qilingan'
        REJECTED = 'rejected', 'Rad etilgan'

    id = models.AutoField(primary_key=True)
    original_offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='counter_offers')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='counter_offers_sent')
    
    # Qarshi taklif ma'lumotlari
    price_per_unit = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, verbose_name='Birlik narxi')
    volume = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, verbose_name='Hajm')
    delivery_date = models.DateField(null=True, blank=True, verbose_name='Yetkazib berish sanasi')
    comment = models.TextField(blank=True, verbose_name='Izoh')

    # Status
    status = models.CharField(max_length=20, choices=CounterOfferStatus.choices, default=CounterOfferStatus.PENDING)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'counter_offers'
        verbose_name = 'Qarshi taklif'
        verbose_name_plural = 'Qarshi takliflar'
        indexes = [
            models.Index(fields=['original_offer']),
            models.Index(fields=['sender']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.sender.get_full_name()} - {self.original_offer}"


class Order(models.Model):
    """
    Buyurtma - taklif qabul qilingandan keyin yaratiladi
    """
    class OrderStatus(models.TextChoices):
        CREATED = 'created', 'Yaratilgan'
        AWAITING_PAYMENT = 'awaiting_payment', 'To\'lov kutilmoqda'
        PAYMENT_CONFIRMED = 'payment_confirmed', 'To\'lov tasdiqlangan'
        IN_PREPARATION = 'in_preparation', 'Tayyorlanmoqda'
        READY_FOR_DELIVERY = 'ready_for_delivery', 'Yetkazib berishga tayyor'
        IN_TRANSIT = 'in_transit', 'Yo\'lda'
        DELIVERED = 'delivered', 'Yetkazib berilgan'
        CONFIRMED = 'confirmed', 'Tasdiqlangan'
        COMPLETED = 'completed', 'Yakunlangan'
        CANCELLED = 'cancelled', 'Bekor qilingan'

    id = models.AutoField(primary_key=True)
    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE, related_name='orders')
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='orders')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer_orders')
    supplier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='supplier_orders')
    
    # Moliyaviy ma'lumotlar
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Jami summa')
    currency = models.CharField(max_length=3, default='UZS', verbose_name='Valyuta')
    payment_method = models.CharField(max_length=20, verbose_name='To\'lov usuli')
    
    # Status
    status = models.CharField(max_length=30, choices=OrderStatus.choices, default=OrderStatus.CREATED)
    
    # Hujjatlar - manual yuklash uchun (Document modeli orqali)
    contract_document = models.ForeignKey(
        'Document', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='contract_orders',
        verbose_name='Shartnoma hujjati',
        limit_choices_to={'document_type': 'contract'}
    )
    invoice_document = models.ForeignKey(
        'Document', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='invoice_orders',
        verbose_name='Hisob-faktura hujjati',
        limit_choices_to={'document_type': 'invoice'}
    )
    ttn_document = models.ForeignKey(
        'Document', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='ttn_orders',
        verbose_name='TTN hujjati',
        limit_choices_to={'document_type': 'ttn'}
    )
    payment_proof_document = models.ForeignKey(
        'Document', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='payment_proof_orders',
        verbose_name='To\'lov hujjati',
        limit_choices_to={'document_type': 'payment_proof'}
    )
    
    # To'lov tasdiqlash
    payment_confirmed_by_seller = models.BooleanField(
        default=False, 
        verbose_name='Sotuvchi tomonidan to\'lov tasdiqlangan'
    )
    payment_confirmed_at = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name='To\'lov tasdiqlangan vaqt'
    )
    
    # Yetkazib berish
    delivery_date = models.DateField(verbose_name='Yetkazib berish sanasi')
    delivery_address = models.TextField(blank=True, verbose_name='Yetkazib berish manzili')
    delivery_contact = models.JSONField(default=dict, blank=True, verbose_name='Yetkazib berish kontaktlari')
    tracking_number = models.CharField(max_length=100, blank=True, verbose_name='Kuzatish raqami')
    
    # Vaqt
    estimated_delivery_date = models.DateField(null=True, blank=True, verbose_name='Taxminiy yetkazib berish sanasi')
    actual_delivery_date = models.DateField(null=True, blank=True, verbose_name='Haqiqiy yetkazib berish sanasi')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        verbose_name = 'Buyurtma'
        verbose_name_plural = 'Buyurtmalar'
        indexes = [
            models.Index(fields=['buyer']),
            models.Index(fields=['supplier']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Order {self.id} - {self.buyer.get_full_name()} to {self.supplier.get_full_name()}"

    def can_be_cancelled(self):
        """Bekor qilinadimi tekshirish"""
        return self.status in [
            self.OrderStatus.CREATED,
            self.OrderStatus.AWAITING_PAYMENT
        ]

    def get_payment_status(self):
        """To'lov holatini olish"""
        if self.status in [self.OrderStatus.PAYMENT_CONFIRMED, self.OrderStatus.IN_PREPARATION]:
            return 'paid'
        elif self.status == self.OrderStatus.AWAITING_PAYMENT:
            return 'pending'
        else:
            return 'not_required'
    
    def can_seller_confirm_payment(self):
        """Sotuvchi to'lovni tasdiqlashi mumkinmi"""
        return (self.status == self.OrderStatus.AWAITING_PAYMENT and 
                not self.payment_confirmed_by_seller)
    
    def can_buyer_upload_payment_proof(self):
        """Buyer to'lov hujjatini yuklashi mumkinmi"""
        return (self.status == self.OrderStatus.AWAITING_PAYMENT and 
                not self.payment_proof_document)
    
    def can_seller_upload_ttn(self):
        """Sotuvchi TTN yuklashi mumkinmi"""
        return self.status in [
            self.OrderStatus.READY_FOR_DELIVERY, 
            self.OrderStatus.IN_PREPARATION
        ]
    
    @property
    def order_number(self):
        """Buyurtma raqami: ORD-{id}"""
        return f"ORD-{self.id}"
    
    @property
    def offers_count(self):
        """RFQ'ga kelgan takliflar soni"""
        return self.rfq.offers.count() if self.rfq else 0
    
    @property
    def lowest_price(self):
        """Eng arzon taklif narxi"""
        if not self.rfq:
            return None
        lowest_offer = self.rfq.offers.order_by('price_per_unit').first()
        return lowest_offer.price_per_unit if lowest_offer else None
    
    @property
    def fastest_delivery(self):
        """Eng tez yetkazib berish (kunlarda)"""
        if not self.rfq:
            return None
        fastest_offer = self.rfq.offers.order_by('delivery_days').first()
        return fastest_offer.delivery_days if fastest_offer else None
    
    @property
    def has_new_offers(self):
        """Yangi takliflar bor-yo'qligi (oxirgi 24 soat ichida)"""
        if not self.rfq:
            return False
        from django.utils import timezone
        yesterday = timezone.now() - timezone.timedelta(days=1)
        return self.rfq.offers.filter(created_at__gte=yesterday).exists()


class OrderDocument(models.Model):
    """
    Buyurtma hujjatlari (eski model - backward compatibility uchun)
    """
    class DocumentType(models.TextChoices):
        CONTRACT = 'contract', 'Shartnoma'
        INVOICE = 'invoice', 'Hisob-faktura'
        TTN = 'ttn', 'TTN'
        RECEIPT = 'receipt', 'Qabul qilish hujjati'

    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='documents')
    
    document_type = models.CharField(max_length=50, choices=DocumentType.choices, verbose_name='Hujjat turi')
    file_url = models.URLField(verbose_name='Fayl URL')
    
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_documents')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_documents'
        verbose_name = 'Buyurtma hujjati'
        verbose_name_plural = 'Buyurtma hujjatlari'
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['document_type']),
        ]

    def __str__(self):
        return f"{self.order} - {self.get_document_type_display()}"


class OrderStatusHistory(models.Model):
    """
    Buyurtma holati tarixi
    """
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    
    status = models.CharField(max_length=30, verbose_name='Holat')
    comment = models.TextField(blank=True, verbose_name='Izoh')
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_status_changes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_status_history'
        verbose_name = 'Buyurtma holati tarixi'
        verbose_name_plural = 'Buyurtma holati tarixi'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.order} - {self.status} ({self.created_at})"


class Payment(models.Model):
    """
    To'lovlar tizimi
    """
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Kutilmoqda'
        RECEIVED = 'received', 'Qabul qilingan'
        HELD_IN_ESCROW = 'held_in_escrow', 'Escrow da ushlab turilmoqda'
        RELEASED = 'released', 'Ozod qilingan'
        REFUNDED = 'refunded', 'Qaytarilgan'

    class PaymentMethod(models.TextChoices):
        BANK = 'bank', 'Bank'
        CASH = 'cash', 'Naqd pul'

    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    
    # To'lov ma'lumotlari
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Summa')
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, verbose_name='To\'lov usuli')
    
    # Status
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    
    # To'lov tasdiqlash
    payment_proof_url = models.URLField(blank=True, verbose_name='To\'lov tasdiqlash hujjati URL')
    
    # Escrow ma'lumotlari
    escrow_reference = models.CharField(max_length=100, blank=True, verbose_name='Escrow havolasi')
    
    # Qo'shimcha ma'lumotlar
    transaction_id = models.CharField(max_length=100, blank=True, verbose_name='Tranzaksiya ID')
    gateway_response = models.JSONField(default=dict, blank=True, verbose_name='Gateway javobi')
    fee_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='Komissiya summasi')
    currency = models.CharField(max_length=3, default='UZS', verbose_name='Valyuta')
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=4, default=1, verbose_name='Valyuta kursi')
    
    # Vaqt
    processed_at = models.DateTimeField(null=True, blank=True, verbose_name='Qayta ishlangan vaqt')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments'
        verbose_name = 'To\'lov'
        verbose_name_plural = 'To\'lovlar'
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['status']),
            models.Index(fields=['payment_method']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Payment {self.id} - {self.amount} ({self.status})"

    def is_escrow_payment(self):
        """Escrow to'lovimi tekshirish"""
        return self.payment_method == self.PaymentMethod.BANK

    def can_be_released(self):
        """Ozod qilinadimi tekshirish"""
        return (
            self.status == self.PaymentStatus.HELD_IN_ESCROW and
            self.order.status in ['delivered', 'confirmed']
        )


class Notification(models.Model):
    """
    Notification tizimi - eski backend bilan mos keladi
    """
    class NotificationType(models.TextChoices):
        # User notifications
        PROFILE_UPDATED = "profile_updated", "Profil yangilandi"
        PASSWORD_CHANGED = "password_changed", "Parol o'zgartirildi"
        
        # Company notifications
        COMPANY_PROFILE_UPDATED = "company_profile_updated", "Kompaniya profili yangilandi"
        CERTIFICATE_ADDED = "certificate_added", "Sertifikat qo'shildi"
        MEMBER_ADDED = "member_added", "A'zo qo'shildi"
        
        # Product notifications
        PRODUCT_CREATED = "product_created", "Mahsulot yaratildi"
        PRODUCT_UPDATED = "product_updated", "Mahsulot yangilandi"
        
        # RFQ notifications
        NEW_RFQ = "new_rfq", "Yangi so'rov"
        RFQ_EXPIRED = "rfq_expired", "So'rov muddati tugadi"
        
        # Offer notifications
        NEW_OFFER = "new_offer", "Yangi taklif"
        OFFER_ACCEPTED = "offer_accepted", "Taklif qabul qilindi"
        OFFER_REJECTED = "offer_rejected", "Taklif rad etildi"
        
        # Order notifications
        ORDER_CREATED = "order_created", "Buyurtma yaratildi"
        ORDER_UPDATED = "order_updated", "Buyurtma yangilandi"
        ORDER_COMPLETED = "order_completed", "Buyurtma yakunlandi"
        ORDER_CANCELLED = "order_cancelled", "Buyurtma bekor qilindi"
        
        # Payment notifications
        PAYMENT_CONFIRMED = "payment_confirmed", "To'lov tasdiqlandi"
        PAYMENT_FAILED = "payment_failed", "To'lov amalga oshmadi"
        
        # Rating notifications
        RATING_REQUEST = "rating_request", "Baho so'rovi"
        RATING_RECEIVED = "rating_received", "Baho qoldirildi"
        
        # System notifications
        INFO = "info", "Ma'lumot"
        WARNING = "warning", "Ogohlantirish"
        ERROR = "error", "Xatolik"

    class DeliveryMethod(models.TextChoices):
        DATABASE_ONLY = "database_only", "Faqat database"
        PUSH_ONLY = "push_only", "Faqat push"
        SMS_ONLY = "sms_only", "Faqat SMS"
        PUSH_SMS = "push_sms", "Push + SMS"
        ALL = "all", "Barcha usullar"

    id = models.AutoField(primary_key=True)
    
    # Recipients
    recipient_user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="notifications",
        null=True, 
        blank=True
    )
    
    # Notification details
    type = models.CharField(max_length=50, choices=NotificationType.choices)
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Delivery settings
    delivery_method = models.CharField(
        max_length=20, 
        choices=DeliveryMethod.choices,
        default=DeliveryMethod.DATABASE_ONLY
    )
    
    # Related objects (keyingi qadamda qo'shamiz)
    related_rfq_id = models.IntegerField(null=True, blank=True)
    related_offer_id = models.IntegerField(null=True, blank=True)
    related_order_id = models.IntegerField(null=True, blank=True)
    
    # Status
    read_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notifications'
        verbose_name = 'Xabar'
        verbose_name_plural = 'Xabarlar'
        indexes = [
            models.Index(fields=['recipient_user', 'read_at']),
            models.Index(fields=['type', 'created_at']),
            models.Index(fields=['delivery_method', 'sent_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.recipient_user.phone if self.recipient_user else 'No User'}"

    def mark_as_read(self):
        """Notificationni o'qilgan deb belgilash"""
        if not self.read_at:
            self.read_at = timezone.now()
            self.save(update_fields=['read_at'])

    def mark_as_sent(self):
        """Notificationni yuborilgan deb belgilash"""
        if not self.sent_at:
            self.sent_at = timezone.now()
            self.save(update_fields=['sent_at'])

    def mark_as_failed(self, error_message=""):
        """Notificationni muvaffaqiyatsiz deb belgilash"""
        self.failed_at = timezone.now()
        self.error_message = error_message
        self.save(update_fields=['failed_at', 'error_message'])

    def is_read(self):
        """Notification o'qilganmi tekshirish"""
        return self.read_at is not None

    def is_sent(self):
        """Notification yuborilganmi tekshirish"""
        return self.sent_at is not None

    def is_failed(self):
        """Notification muvaffaqiyatsizmi tekshirish"""
        return self.failed_at is not None


def document_upload_path(instance, filename):
    """
    Moslashuvchan fayl yuklash yo'li
    Format: documents/{company_name}/{year}/{document_type}/{filename}
    """
    import re
    ext = filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    
    # Company name or user ID for path
    if instance.company:
        # Clean company name for file path
        company_name = re.sub(r'[^\w\s-]', '', instance.company.name).strip()
        company_name = re.sub(r'[-\s]+', '_', company_name)
        path_prefix = company_name
    else:
        path_prefix = f"user_{instance.user.id}"
    
    year = timezone.now().strftime('%Y')
    document_type = instance.document_type or 'other'
    
    return f"documents/{path_prefix}/{year}/{document_type}/{unique_filename}"


class Document(models.Model):
    """
    Universal Document model - moslashuvchan hujjat tizimi
    Didox integratsiya uchun ham tayyor
    """
    class DocumentType(models.TextChoices):
        # Kompaniya hujjatlari
        COMPANY_LICENSE = 'company_license', 'Kompaniya litsenziyasi'
        TAX_CERTIFICATE = 'tax_certificate', 'Soliq guvohnomasi'
        BANK_STATEMENT = 'bank_statement', 'Bank ma\'lumotnomasi'
        
        # Buyurtma hujjatlari
        CONTRACT = 'contract', 'Shartnoma'
        INVOICE = 'invoice', 'Hisob-faktura'
        TTN = 'ttn', 'TTN (Transport hujjati)'
        RECEIPT = 'receipt', 'Qabul qilish hujjati'
        PAYMENT_PROOF = 'payment_proof', 'To\'lov hujjati'
        
        # Mahsulot hujjatlari
        CERTIFICATE = 'certificate', 'Sertifikat'
        SPECIFICATION = 'specification', 'Texnik xususiyatlar'
        WARRANTY = 'warranty', 'Kafolat hujjati'
        
        # Didox integration types
        DIDOX_CONTRACT = 'didox_contract', 'Didox Shartnoma'
        DIDOX_INVOICE = 'didox_invoice', 'Didox Hisob-faktura'
        DIDOX_STATEMENT = 'didox_statement', 'Didox Ma\'lumotnoma'
        
        # Boshqa
        OTHER = 'other', 'Boshqa hujjat'

    class DocumentStatus(models.TextChoices):
        PENDING = 'pending', 'Kutilmoqda'
        PROCESSING = 'processing', 'Qayta ishlanmoqda'
        VERIFIED = 'verified', 'Tasdiqlangan'
        REJECTED = 'rejected', 'Rad etilgan'
        EXPIRED = 'expired', 'Muddati tugagan'

    class DocumentSource(models.TextChoices):
        MANUAL_UPLOAD = 'manual_upload', 'Qo\'lda yuklangan'
        AUTO_GENERATED = 'auto_generated', 'Avtomatik yaratilgan'
        DIDOX_INTEGRATION = 'didox_integration', 'Didox integratsiya'
        API_IMPORT = 'api_import', 'API orqali import'

    id = models.AutoField(primary_key=True)
    
    # Asosiy bog'lanishlar
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    order = models.ForeignKey(
        'Order', 
        on_delete=models.CASCADE,
        related_name='new_documents',
        null=True, 
        blank=True,
        help_text='Buyurtma bilan bog\'liq hujjatlar uchun'
    )
    company = models.ForeignKey(
        'Company',
        on_delete=models.CASCADE,
        related_name='documents',
        null=True,
        blank=True,
        help_text='Kompaniya hujjatlari uchun'
    )
    
    # Hujjat ma'lumotlari
    document_type = models.CharField(
        max_length=50, 
        choices=DocumentType.choices,
        verbose_name='Hujjat turi'
    )
    title = models.CharField(
        max_length=255,
        verbose_name='Hujjat nomi',
        help_text='Foydalanuvchi tomonidan berilgan nom'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Tavsif',
        help_text='Hujjat haqida qo\'shimcha ma\'lumot'
    )
    
    # Fayl ma'lumotlari
    file = models.FileField(
        upload_to=document_upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']
            )
        ],
        verbose_name='Fayl'
    )
    file_name = models.CharField(
        max_length=255,
        verbose_name='Asl fayl nomi'
    )
    file_size = models.BigIntegerField(
        verbose_name='Fayl hajmi (bytes)'
    )
    content_type = models.CharField(
        max_length=100,
        verbose_name='Fayl turi'
    )
    
    # Status va verificatsiya
    status = models.CharField(
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.PENDING,
        verbose_name='Holat'
    )
    source = models.CharField(
        max_length=30,
        choices=DocumentSource.choices,
        default=DocumentSource.MANUAL_UPLOAD,
        verbose_name='Manba'
    )
    
    # Didox integration fields
    didox_document_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Didox hujjat ID',
        help_text='Didox tizimidagi hujjat identifikatori'
    )
    didox_metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Didox metadata',
        help_text='Didox dan kelgan qo\'shimcha ma\'lumotlar'
    )
    
    # Verificatsiya ma'lumotlari
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_documents',
        verbose_name='Tasdiqlagan shaxs'
    )
    verified_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Tasdiqlash vaqti'
    )
    rejection_reason = models.TextField(
        blank=True,
        verbose_name='Rad etish sababi'
    )
    
    # Muddatlar
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Amal qilish muddati'
    )
    
    # Qo'shimcha metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Qo\'shimcha ma\'lumotlar',
        help_text='Flexible data storage for future integrations'
    )
    
    # Vaqt belgilari
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'documents'
        verbose_name = 'Hujjat'
        verbose_name_plural = 'Hujjatlar'
        indexes = [
            models.Index(fields=['user', 'document_type']),
            models.Index(fields=['order', 'document_type']),
            models.Index(fields=['company', 'document_type']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['didox_document_id']),
            models.Index(fields=['expires_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.get_document_type_display()}"

    def save(self, *args, **kwargs):
        """Custom save method"""
        if self.file:
            self.file_name = self.file.name
            self.file_size = self.file.size
            # Content type will be set by the view
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        """Hujjat muddati tugaganmi tekshirish"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False

    @property
    def file_extension(self):
        """Fayl kengaytmasini olish"""
        if self.file_name:
            return self.file_name.split('.')[-1].lower()
        return None

    @property
    def is_image(self):
        """Rasm faylimi tekshirish"""
        image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        return self.file_extension in image_extensions

    @property
    def is_pdf(self):
        """PDF faylimi tekshirish"""
        return self.file_extension == 'pdf'

    @property
    def human_readable_size(self):
        """Fayl hajmini o'qish oson formatda qaytarish"""
        if self.file_size < 1024:
            return f"{self.file_size} B"
        elif self.file_size < 1024 * 1024:
            return f"{self.file_size / 1024:.1f} KB"
        else:
            return f"{self.file_size / (1024 * 1024):.1f} MB"

    def can_be_deleted_by(self, user):
        """Foydalanuvchi hujjatni o'chira oladimi"""
        return (
            self.user == user or 
            user.is_staff or 
            (self.order and (self.order.buyer == user or self.order.supplier == user))
        )

    def can_be_viewed_by(self, user):
        """Foydalanuvchi hujjatni ko'ra oladimi"""
        return (
            self.user == user or 
            user.is_staff or 
            (self.order and (self.order.buyer == user or self.order.supplier == user)) or
            (self.company and self.company.user == user)
        )

    def mark_as_verified(self, verified_by_user, commit=True):
        """Hujjatni tasdiqlangan deb belgilash"""
        self.status = self.DocumentStatus.VERIFIED
        self.verified_by = verified_by_user
        self.verified_at = timezone.now()
        if commit:
            self.save(update_fields=['status', 'verified_by', 'verified_at'])

    def mark_as_rejected(self, reason, rejected_by_user, commit=True):
        """Hujjatni rad etilgan deb belgilash"""
        self.status = self.DocumentStatus.REJECTED
        self.rejection_reason = reason
        self.verified_by = rejected_by_user
        self.verified_at = timezone.now()
        if commit:
            self.save(update_fields=['status', 'rejection_reason', 'verified_by', 'verified_at'])


class DocumentShare(models.Model):
    """
    Hujjatlarni boshqa foydalanuvchilar bilan ulashish
    """
    class ShareType(models.TextChoices):
        VIEW_ONLY = 'view_only', 'Faqat ko\'rish'
        DOWNLOAD = 'download', 'Yuklab olish'
        COMMENT = 'comment', 'Izoh qoldirish'

    id = models.AutoField(primary_key=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='shares')
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_documents')
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents_shared')
    
    share_type = models.CharField(
        max_length=20,
        choices=ShareType.choices,
        default=ShareType.VIEW_ONLY
    )
    
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Ulashish muddati'
    )
    
    is_active = models.BooleanField(default=True)
    accessed_at = models.DateTimeField(null=True, blank=True)
    access_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'document_shares'
        verbose_name = 'Hujjat ulashish'
        verbose_name_plural = 'Hujjat ulashishlar'
        unique_together = ['document', 'shared_with']

    def __str__(self):
        return f"{self.document.title} shared with {self.shared_with.get_full_name()}"

    @property
    def is_expired(self):
        """Ulashish muddati tugaganmi"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False

    def mark_accessed(self):
        """Kirish vaqtini belgilash"""
        self.accessed_at = timezone.now()
        self.access_count += 1
        self.save(update_fields=['accessed_at', 'access_count'])