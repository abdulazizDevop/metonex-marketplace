"""
Model tests for MetOneX API
"""
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from api.models import (
    User, Company, Unit, Category, SubCategory, Factory,
    Product, RFQ, Offer, Order, Payment, Notification
)
from api.tests.base import BaseModelTestCase


class UserModelTest(BaseModelTestCase):
    """Test User model"""
    
    def test_user_creation(self):
        """Test user creation"""
        user = User.objects.create_user(
            username='test_user_creation',
            phone='+998901234570',
            password='testpass123',
            role=User.UserRole.BUYER,
            first_name='Test',
            last_name='User'
        )
        
        self.assertEqual(user.phone, '+998901234570')
        self.assertEqual(user.role, User.UserRole.BUYER)
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')
        self.assertTrue(user.check_password('testpass123'))
    
    def test_user_str(self):
        """Test user string representation"""
        self.assertEqual(str(self.user), 'Test User (+998901234567)')
    
    def test_user_full_name(self):
        """Test user full name property"""
        self.assertEqual(self.user.get_full_name(), 'Test User')
    
    def test_supplier_type_validation(self):
        """Test supplier type validation"""
        # Supplier must have supplier_type
        supplier = User.objects.create_user(
            username='supplier_test',
            phone='+998901234571',
            password='testpass123',
            role=User.UserRole.SUPPLIER,
            supplier_type=User.SupplierType.MANUFACTURER
        )
        
        self.assertEqual(supplier.supplier_type, User.SupplierType.MANUFACTURER)


class UnitModelTest(BaseModelTestCase):
    """Test Unit model"""
    
    def setUp(self):
        super().setUp()
        self.unit = Unit.objects.create(
            name='Tonna',
            symbol='ton',
            unit_type=Unit.UnitType.WEIGHT
        )
    
    def test_unit_creation(self):
        """Test unit creation"""
        self.assertEqual(self.unit.name, 'Tonna')
        self.assertEqual(self.unit.symbol, 'ton')
        self.assertEqual(self.unit.unit_type, Unit.UnitType.WEIGHT)
        self.assertTrue(self.unit.is_active)
    
    def test_unit_str(self):
        """Test unit string representation"""
        self.assertEqual(str(self.unit), 'Tonna (ton)')
    
    def test_get_units_by_type(self):
        """Test get units by type method"""
        units = Unit.get_units_by_type(Unit.UnitType.WEIGHT)
        self.assertIn(self.unit, units)


class CategoryModelTest(BaseModelTestCase):
    """Test Category model"""
    
    def setUp(self):
        super().setUp()
        self.unit = Unit.objects.create(
            name='Tonna',
            symbol='ton',
            unit_type=Unit.UnitType.WEIGHT
        )
        self.category = Category.objects.create(
            name='Armatura',
            slug='armatura',
            unit_type=Category.UnitType.WEIGHT,
            default_unit=self.unit
        )
    
    def test_category_creation(self):
        """Test category creation"""
        self.assertEqual(self.category.name, 'Armatura')
        self.assertEqual(self.category.slug, 'armatura')
        self.assertEqual(self.category.unit_type, Category.UnitType.WEIGHT)
        self.assertEqual(self.category.default_unit, self.unit)
    
    def test_category_str(self):
        """Test category string representation"""
        self.assertEqual(str(self.category), 'Armatura')
    
    def test_get_available_units(self):
        """Test get available units method"""
        units = self.category.get_available_units()
        self.assertIn(self.unit, units)
    
    def test_get_default_unit(self):
        """Test get default unit method"""
        default_unit = self.category.get_default_unit()
        self.assertEqual(default_unit, self.unit)


class SubCategoryModelTest(BaseModelTestCase):
    """Test SubCategory model"""
    
    def setUp(self):
        super().setUp()
        self.unit = Unit.objects.create(
            name='Tonna',
            symbol='ton',
            unit_type=Unit.UnitType.WEIGHT
        )
        self.category = Category.objects.create(
            name='Armatura',
            slug='armatura',
            unit_type=Category.UnitType.WEIGHT,
            default_unit=self.unit
        )
        self.subcategory = SubCategory.objects.create(
            name='A500C',
            slug='a500c',
            category=self.category
        )
    
    def test_subcategory_creation(self):
        """Test subcategory creation"""
        self.assertEqual(self.subcategory.name, 'A500C')
        self.assertEqual(self.subcategory.slug, 'a500c')
        self.assertEqual(self.subcategory.category, self.category)
    
    def test_subcategory_str(self):
        """Test subcategory string representation"""
        self.assertEqual(str(self.subcategory), 'Armatura - A500C')
    
    def test_get_available_units(self):
        """Test get available units method"""
        units = self.subcategory.get_available_units()
        self.assertIn(self.unit, units)
    
    def test_get_default_unit(self):
        """Test get default unit method"""
        default_unit = self.subcategory.get_default_unit()
        self.assertEqual(default_unit, self.unit)


class RFQModelTest(BaseModelTestCase):
    """Test RFQ model"""
    
    def setUp(self):
        super().setUp()
        self.unit = Unit.objects.create(
            name='Tonna',
            symbol='ton',
            unit_type=Unit.UnitType.WEIGHT
        )
        self.category = Category.objects.create(
            name='Armatura',
            slug='armatura',
            unit_type=Category.UnitType.WEIGHT,
            default_unit=self.unit
        )
        self.subcategory = SubCategory.objects.create(
            name='A500C',
            slug='a500c',
            category=self.category
        )
        self.rfq = RFQ.objects.create(
            buyer=self.user,
            category=self.category,
            subcategory=self.subcategory,
            unit=self.unit,
            volume=10.0,
            delivery_location='Tashkent',
            delivery_date='2024-12-31',
            payment_method=RFQ.PaymentMethod.BANK,
            expires_at=timezone.now() + timedelta(days=7)
        )
    
    def test_rfq_creation(self):
        """Test RFQ creation"""
        self.assertEqual(self.rfq.buyer, self.user)
        self.assertEqual(self.rfq.category, self.category)
        self.assertEqual(self.rfq.subcategory, self.subcategory)
        self.assertEqual(self.rfq.unit, self.unit)
        self.assertEqual(self.rfq.volume, 10.0)
        self.assertEqual(self.rfq.delivery_location, 'Tashkent')
        self.assertEqual(self.rfq.payment_method, RFQ.PaymentMethod.BANK)
        self.assertEqual(self.rfq.status, RFQ.RFQStatus.ACTIVE)
    
    def test_rfq_str(self):
        """Test RFQ string representation"""
        expected = f"{self.user.get_full_name()} - {self.category.name} ({self.rfq.volume} {self.unit.name if self.unit else 'N/A'})"
        self.assertEqual(str(self.rfq), expected)
    
    def test_can_receive_offers(self):
        """Test can receive offers method"""
        self.assertTrue(self.rfq.can_receive_offers())
        
        # Test expired RFQ
        self.rfq.status = RFQ.RFQStatus.EXPIRED
        self.rfq.save()
        self.assertFalse(self.rfq.can_receive_offers())


class OfferModelTest(BaseModelTestCase):
    """Test Offer model"""
    
    def setUp(self):
        super().setUp()
        self.supplier = User.objects.create_user(
            username='supplier_test',
            phone='+998901234572',
            password='testpass123',
            role=User.UserRole.SUPPLIER,
            supplier_type=User.SupplierType.MANUFACTURER
        )
        
        self.unit = Unit.objects.create(
            name='Tonna',
            symbol='ton',
            unit_type=Unit.UnitType.WEIGHT
        )
        self.category = Category.objects.create(
            name='Armatura',
            slug='armatura',
            unit_type=Category.UnitType.WEIGHT,
            default_unit=self.unit
        )
        self.subcategory = SubCategory.objects.create(
            name='A500C',
            slug='a500c',
            category=self.category
        )
        self.rfq = RFQ.objects.create(
            buyer=self.user,
            category=self.category,
            subcategory=self.subcategory,
            unit=self.unit,
            volume=10.0,
            delivery_location='Tashkent',
            delivery_date='2024-12-31',
            payment_method=RFQ.PaymentMethod.BANK,
            expires_at=timezone.now() + timedelta(days=7)
        )
        self.offer = Offer.objects.create(
            rfq=self.rfq,
            supplier=self.supplier,
            price_per_unit=850.0,
            total_amount=8500.0,
            delivery_terms='Delivery included',
            delivery_date='2024-12-25'
        )
    
    def test_offer_creation(self):
        """Test offer creation"""
        self.assertEqual(self.offer.rfq, self.rfq)
        self.assertEqual(self.offer.supplier, self.supplier)
        self.assertEqual(self.offer.price_per_unit, 850.0)
        self.assertEqual(self.offer.total_amount, 8500.0)
        self.assertEqual(self.offer.delivery_terms, 'Delivery included')
        self.assertEqual(self.offer.status, Offer.OfferStatus.PENDING)
    
    def test_offer_str(self):
        """Test offer string representation"""
        expected = f"{self.supplier.get_full_name()} - {self.rfq} ({self.offer.price_per_unit})"
        self.assertEqual(str(self.offer), expected)
    
    def test_can_be_accepted(self):
        """Test can be accepted method"""
        self.assertTrue(self.offer.can_be_accepted())
        
        # Test accepted offer
        self.offer.status = Offer.OfferStatus.ACCEPTED
        self.offer.save()
        self.assertFalse(self.offer.can_be_accepted())


class OrderModelTest(BaseModelTestCase):
    """Test Order model"""
    
    def setUp(self):
        super().setUp()
        self.supplier = User.objects.create_user(
            username='supplier_test2',
            phone='+998901234573',
            password='testpass123',
            role=User.UserRole.SUPPLIER,
            supplier_type=User.SupplierType.MANUFACTURER
        )
        
        self.unit = Unit.objects.create(
            name='Tonna',
            symbol='ton',
            unit_type=Unit.UnitType.WEIGHT
        )
        self.category = Category.objects.create(
            name='Armatura',
            slug='armatura',
            unit_type=Category.UnitType.WEIGHT,
            default_unit=self.unit
        )
        self.subcategory = SubCategory.objects.create(
            name='A500C',
            slug='a500c',
            category=self.category
        )
        self.rfq = RFQ.objects.create(
            buyer=self.user,
            category=self.category,
            subcategory=self.subcategory,
            unit=self.unit,
            volume=10.0,
            delivery_location='Tashkent',
            delivery_date='2024-12-31',
            payment_method=RFQ.PaymentMethod.BANK,
            expires_at=timezone.now() + timedelta(days=7)
        )
        self.offer = Offer.objects.create(
            rfq=self.rfq,
            supplier=self.supplier,
            price_per_unit=850.0,
            total_amount=8500.0,
            delivery_terms='Delivery included',
            delivery_date='2024-12-25'
        )
        self.order = Order.objects.create(
            rfq=self.rfq,
            offer=self.offer,
            buyer=self.user,
            supplier=self.supplier,
            total_amount=8500.0,
            payment_method='bank',
            delivery_date='2024-12-25'
        )
    
    def test_order_creation(self):
        """Test order creation"""
        self.assertEqual(self.order.rfq, self.rfq)
        self.assertEqual(self.order.offer, self.offer)
        self.assertEqual(self.order.buyer, self.user)
        self.assertEqual(self.order.supplier, self.supplier)
        self.assertEqual(self.order.total_amount, 8500.0)
        self.assertEqual(self.order.payment_method, 'bank')
        self.assertEqual(self.order.status, Order.OrderStatus.CREATED)
    
    def test_order_str(self):
        """Test order string representation"""
        expected = f"Order {self.order.id} - {self.user.get_full_name()} to {self.supplier.get_full_name()}"
        self.assertEqual(str(self.order), expected)
    
    def test_can_be_cancelled(self):
        """Test can be cancelled method"""
        self.assertTrue(self.order.can_be_cancelled())
        
        # Test completed order
        self.order.status = Order.OrderStatus.COMPLETED
        self.order.save()
        self.assertFalse(self.order.can_be_cancelled())
