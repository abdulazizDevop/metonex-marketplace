"""
Serializer tests for MetOneX API
"""
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from api.models import Category, RFQ, Offer, Order, Unit
from api.serializers import (
    UserSerializer, UserRegistrationSerializer, CompanySerializer,
    UnitSerializer, CategorySerializer, SubCategorySerializer,
    RFQSerializer, RFQCreateSerializer, OfferSerializer, OrderSerializer
)
from api.tests.base import BaseAPITestCase

User = get_user_model()


class UserSerializerTest(BaseAPITestCase):
    """Test User serializers"""
    
    def test_user_serializer(self):
        """Test UserSerializer"""
        serializer = UserSerializer(self.buyer_user)
        data = serializer.data
        
        self.assertEqual(data['phone'], '+998901234567')
        self.assertEqual(data['role'], 'buyer')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'Buyer')
        self.assertIn('created_at', data)
    
    def test_user_registration_serializer(self):
        """Test UserRegistrationSerializer"""
        data = {
            'phone': '+998901234580',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'role': 'buyer',
            'first_name': 'New',
            'last_name': 'User'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        user = serializer.save()
        self.assertEqual(user.phone, '+998901234580')
        self.assertEqual(user.role, User.UserRole.BUYER)
        self.assertEqual(user.first_name, 'New')
        self.assertEqual(user.last_name, 'User')
    
    def test_user_registration_serializer_validation(self):
        """Test UserRegistrationSerializer validation"""
        # Test invalid phone
        data = {
            'phone': 'invalid_phone',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'role': 'buyer',
            'first_name': 'Test',
            'last_name': 'User'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('phone', serializer.errors)
        
        # Test invalid role
        data = {
            'phone': '+998901234581',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'role': 'invalid_role',
            'first_name': 'Test',
            'last_name': 'User'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('role', serializer.errors)


class CompanySerializerTest(BaseAPITestCase):
    """Test Company serializers"""
    
    def setUp(self):
        super().setUp()
        from api.models import Company
        self.company = Company.objects.create(
            user=self.buyer_user,
            name='Test Company',
            legal_address='Tashkent, Navoi street 123',
            inn_stir='123456789'
        )
    
    def test_company_serializer(self):
        """Test CompanySerializer"""
        serializer = CompanySerializer(self.company)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Test Company')
        self.assertEqual(data['legal_address'], 'Tashkent, Navoi street 123')
        self.assertEqual(data['inn_stir'], '123456789')
        self.assertIn('created_at', data)


class UnitSerializerTest(BaseAPITestCase):
    """Test Unit serializers"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_unit_serializer(self):
        """Test UnitSerializer"""
        serializer = UnitSerializer(self.weight_unit)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Tonna')
        self.assertEqual(data['symbol'], 'ton')
        self.assertEqual(data['unit_type'], 'weight')
        self.assertTrue(data['is_active'])
    
    def test_unit_serializer_creation(self):
        """Test UnitSerializer creation"""
        data = {
            'name': 'Kilogramm',
            'symbol': 'kg',
            'unit_type': 'weight'
        }
        serializer = UnitSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        unit = serializer.save()
        self.assertEqual(unit.name, 'Kilogramm')
        self.assertEqual(unit.symbol, 'kg')
        self.assertEqual(unit.unit_type, Unit.UnitType.WEIGHT)


class CategorySerializerTest(BaseAPITestCase):
    """Test Category serializers"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_category_serializer(self):
        """Test CategorySerializer"""
        serializer = CategorySerializer(self.category)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Armatura')
        self.assertEqual(data['slug'], 'armatura')
        self.assertEqual(data['unit_type'], 'weight')
        self.assertEqual(data['default_unit'], self.weight_unit.id)
        self.assertTrue(data['is_active'])
    
    def test_category_serializer_creation(self):
        """Test CategorySerializer creation"""
        data = {
            'name': 'Beton',
            'slug': 'beton',
            'unit_type': 'volume',
            'default_unit': self.volume_unit.id
        }
        serializer = CategorySerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        category = serializer.save()
        self.assertEqual(category.name, 'Beton')
        self.assertEqual(category.slug, 'beton')
        self.assertEqual(category.unit_type, Category.UnitType.VOLUME)


class SubCategorySerializerTest(BaseAPITestCase):
    """Test SubCategory serializers"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_subcategory_serializer(self):
        """Test SubCategorySerializer"""
        serializer = SubCategorySerializer(self.subcategory)
        data = serializer.data
        
        self.assertEqual(data['name'], 'A500C')
        self.assertEqual(data['slug'], 'a500c')
        self.assertEqual(data['category'], self.category.id)
        self.assertTrue(data['is_active'])
    
    def test_subcategory_serializer_creation(self):
        """Test SubCategorySerializer creation"""
        data = {
            'name': 'B500B',
            'slug': 'b500b',
            'category': self.category.id
        }
        serializer = SubCategorySerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        subcategory = serializer.save()
        self.assertEqual(subcategory.name, 'B500B')
        self.assertEqual(subcategory.slug, 'b500b')
        self.assertEqual(subcategory.category, self.category)


class RFQSerializerTest(BaseAPITestCase):
    """Test RFQ serializers"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
        self.rfq = RFQ.objects.create(
            buyer=self.buyer_user,
            category=self.category,
            subcategory=self.subcategory,
            unit=self.weight_unit,
            volume=10.0,
            delivery_location='Tashkent',
            delivery_date='2024-12-31',
            payment_method='bank',
            expires_at=timezone.now() + timedelta(days=7)
        )
    
    def test_rfq_serializer(self):
        """Test RFQSerializer"""
        serializer = RFQSerializer(self.rfq)
        data = serializer.data
        
        self.assertEqual(data['buyer'], self.buyer_user.id)
        self.assertEqual(data['category'], self.category.id)
        self.assertEqual(data['subcategory'], self.subcategory.id)
        self.assertEqual(data['unit'], self.weight_unit.id)
        self.assertEqual(data['volume'], '10.00')
        self.assertEqual(data['delivery_location'], 'Tashkent')
        self.assertEqual(data['payment_method'], 'bank')
        self.assertEqual(data['status'], 'active')
    
    def test_rfq_create_serializer(self):
        """Test RFQCreateSerializer"""
        from datetime import date, timedelta
        future_date = date.today() + timedelta(days=30)
        
        data = {
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'unit': self.weight_unit.id,
            'volume': 15.0,
            'delivery_location': 'Samarkand',
            'delivery_date': future_date.strftime('%Y-%m-%d'),
            'payment_method': 'cash'
        }
        # Mock request context
        from unittest.mock import Mock
        mock_request = Mock()
        mock_request.user = self.buyer_user
        
        serializer = RFQCreateSerializer(data=data, context={'request': mock_request})
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
        self.assertTrue(serializer.is_valid())
        
        rfq = serializer.save(buyer=self.buyer_user)
        self.assertEqual(rfq.buyer, self.buyer_user)
        self.assertEqual(rfq.category, self.category)
        self.assertEqual(rfq.volume, 15.0)
        self.assertEqual(rfq.delivery_location, 'Samarkand')
        self.assertEqual(rfq.payment_method, 'cash')


class OfferSerializerTest(BaseAPITestCase):
    """Test Offer serializers"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
        self.rfq = RFQ.objects.create(
            buyer=self.buyer_user,
            category=self.category,
            subcategory=self.subcategory,
            unit=self.weight_unit,
            volume=10.0,
            delivery_location='Tashkent',
            delivery_date='2024-12-31',
            payment_method='bank',
            expires_at=timezone.now() + timedelta(days=7)
        )
        self.offer = Offer.objects.create(
            rfq=self.rfq,
            supplier=self.supplier_user,
            price_per_unit=850.0,
            total_amount=8500.0,
            delivery_terms='Delivery included',
            delivery_date='2024-12-25'
        )
    
    def test_offer_serializer(self):
        """Test OfferSerializer"""
        serializer = OfferSerializer(self.offer)
        data = serializer.data
        
        self.assertEqual(data['rfq'], self.rfq.id)
        self.assertEqual(data['supplier'], self.supplier_user.id)
        self.assertEqual(data['price_per_unit'], '850.00')
        self.assertEqual(data['total_amount'], '8500.00')
        self.assertEqual(data['delivery_terms'], 'Delivery included')
        self.assertEqual(data['delivery_date'], '2024-12-25')
        self.assertEqual(data['status'], 'pending')


class OrderSerializerTest(BaseAPITestCase):
    """Test Order serializers"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
        self.rfq = RFQ.objects.create(
            buyer=self.buyer_user,
            category=self.category,
            subcategory=self.subcategory,
            unit=self.weight_unit,
            volume=10.0,
            delivery_location='Tashkent',
            delivery_date='2024-12-31',
            payment_method='bank',
            expires_at=timezone.now() + timedelta(days=7)
        )
        self.offer = Offer.objects.create(
            rfq=self.rfq,
            supplier=self.supplier_user,
            price_per_unit=850.0,
            total_amount=8500.0,
            delivery_terms='Delivery included',
            delivery_date='2024-12-25'
        )
        self.order = Order.objects.create(
            rfq=self.rfq,
            offer=self.offer,
            buyer=self.buyer_user,
            supplier=self.supplier_user,
            total_amount=8500.0,
            payment_method='bank',
            delivery_date='2024-12-25'
        )
    
    def test_order_serializer(self):
        """Test OrderSerializer"""
        serializer = OrderSerializer(self.order)
        data = serializer.data
        
        self.assertEqual(data['rfq'], self.rfq.id)
        self.assertEqual(data['offer'], self.offer.id)
        self.assertEqual(data['buyer'], self.buyer_user.id)
        self.assertEqual(data['supplier'], self.supplier_user.id)
        self.assertEqual(data['total_amount'], '8500.00')
        self.assertEqual(data['payment_method'], 'bank')
        self.assertEqual(data['status'], 'created')
