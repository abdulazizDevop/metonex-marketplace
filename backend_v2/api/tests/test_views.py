"""
View tests for MetOneX API
"""
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from api.models import RFQ, Offer, Order, Company
from api.tests.base import BaseAPITestCase


class AuthenticationViewTest(BaseAPITestCase):
    """Test authentication views"""
    
    def test_user_registration(self):
        """Test user registration"""
        from api.models import VerificationCode
        
        # Avval telefon raqamini tasdiqlash
        phone = '+998901234590'
        verification_code = VerificationCode.objects.create(
            phone=phone,
            code='123456',
            expires_at=timezone.now() + timedelta(minutes=5)
        )
        verification_code.mark_as_used()  # Tasdiqlangan deb belgilash
        
        url = reverse('user-register')
        data = {
            'phone': phone,
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'role': 'buyer',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
    
    def test_user_login(self):
        """Test user login"""
        url = reverse('user-login')
        data = {
            'phone': '+998901234567',
            'password': 'testpass123'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_user_profile(self):
        """Test user profile view"""
        self.authenticate_user('buyer')
        url = reverse('user-profile')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone'], '+998901234567')
        self.assertEqual(response.data['role'], 'buyer')
    
    def test_user_profile_update(self):
        """Test user profile update"""
        self.authenticate_user('buyer')
        url = reverse('user-profile')
        data = {
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
        self.assertEqual(response.data['last_name'], 'Name')


class CatalogViewTest(BaseAPITestCase):
    """Test catalog views"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_unit_list(self):
        """Test unit list view"""
        self.authenticate_user('buyer')
        url = reverse('unit-list')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_category_list(self):
        """Test category list view"""
        self.authenticate_user('buyer')
        url = reverse('category-list')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_subcategory_list(self):
        """Test subcategory list view"""
        self.authenticate_user('buyer')
        url = reverse('subcategory-list')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_factory_list(self):
        """Test factory list view"""
        self.authenticate_user('buyer')
        url = reverse('factory-list')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_category_detail(self):
        """Test category detail view"""
        self.authenticate_user('buyer')
        url = reverse('category-detail', kwargs={'pk': self.category.id})
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Armatura')
        self.assertEqual(response.data['slug'], 'armatura')
    
    def test_category_available_units(self):
        """Test category available units view"""
        self.authenticate_user('buyer')
        url = reverse('category-available-units', kwargs={'pk': self.category.id})
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)


class CompanyViewTest(BaseAPITestCase):
    """Test company views"""
    
    def test_company_profile_get(self):
        """Test company profile get"""
        self.authenticate_user('buyer')
        url = reverse('company-profile')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_company_create(self):
        """Test company creation"""
        self.authenticate_user('buyer')
        url = reverse('company-list')
        data = {
            'name': 'Test Company',
            'legal_address': 'Tashkent, Navoi street 123',
            'inn_stir': '123456789'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Test Company')
    
    def test_company_update(self):
        """Test company update"""
        # First create a company
        company = Company.objects.create(
            user=self.buyer_user,
            name='Test Company',
            legal_address='Tashkent, Navoi street 123',
            inn_stir='123456789'
        )
        
        self.authenticate_user('buyer')
        url = reverse('company-detail', kwargs={'pk': company.pk})
        data = {
            'name': 'Updated Company',
            'legal_address': 'Tashkent, Amir Temur street 456',
            'inn_stir': '987654321'
        }
        
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Company')


class RFQViewTest(BaseAPITestCase):
    """Test RFQ views"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_rfq_list(self):
        """Test RFQ list view"""
        # Create a test RFQ
        RFQ.objects.create(
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
        
        self.authenticate_user('buyer')
        url = reverse('rfq-list')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_rfq_create(self):
        """Test RFQ creation"""
        self.authenticate_user('buyer')
        url = reverse('rfq-list')
        data = {
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'unit': self.weight_unit.id,
            'volume': 15.0,
            'delivery_location': 'Samarkand',
            'delivery_date': (timezone.now() + timedelta(days=30)).date(),
            'expires_at': timezone.now() + timedelta(days=7),
            'payment_method': 'cash'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['volume'], '15.00')
        self.assertEqual(response.data['delivery_location'], 'Samarkand')
    
    def test_rfq_detail(self):
        """Test RFQ detail view"""
        rfq = RFQ.objects.create(
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
        
        self.authenticate_user('buyer')
        url = reverse('rfq-detail', kwargs={'pk': rfq.id})
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['volume'], '10.00')
        self.assertEqual(response.data['delivery_location'], 'Tashkent')
    
    def test_rfq_my_rfqs(self):
        """Test my RFQs view"""
        RFQ.objects.create(
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
        
        self.authenticate_user('buyer')
        url = reverse('rfq-my-rfqs')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)


class OfferViewTest(BaseAPITestCase):
    """Test offer views"""
    
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
    
    def test_offer_create(self):
        """Test offer creation"""
        self.authenticate_user('supplier')
        url = reverse('offer-list')
        data = {
            'rfq': self.rfq.id,
            'price_per_unit': 850.0,
            'total_amount': 8500.0,
            'delivery_terms': 'Delivery included',
            'delivery_date': (timezone.now() + timedelta(days=35)).date(),
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['price_per_unit'], '850.00')
        self.assertEqual(response.data['total_amount'], '8500.00')
    
    def test_offer_list(self):
        """Test offer list view"""
        Offer.objects.create(
            rfq=self.rfq,
            supplier=self.supplier_user,
            price_per_unit=850.0,
            total_amount=8500.0,
            delivery_terms='Delivery included',
            delivery_date=(timezone.now() + timedelta(days=30)).date()
        )
        
        self.authenticate_user('supplier')
        url = reverse('offer-list')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_offer_detail(self):
        """Test offer detail view"""
        offer = Offer.objects.create(
            rfq=self.rfq,
            supplier=self.supplier_user,
            price_per_unit=850.0,
            total_amount=8500.0,
            delivery_terms='Delivery included',
            delivery_date=(timezone.now() + timedelta(days=30)).date()
        )
        
        self.authenticate_user('supplier')
        url = reverse('offer-detail', kwargs={'pk': offer.id})
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['price_per_unit'], '850.00')
        self.assertEqual(response.data['total_amount'], '8500.00')


class OrderViewTest(BaseAPITestCase):
    """Test order views"""
    
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
            delivery_date=(timezone.now() + timedelta(days=30)).date()
        )
    
    def test_order_list(self):
        """Test order list view"""
        Order.objects.create(
            rfq=self.rfq,
            offer=self.offer,
            buyer=self.buyer_user,
            supplier=self.supplier_user,
            total_amount=8500.0,
            payment_method='bank',
            delivery_date=(timezone.now() + timedelta(days=30)).date()
        )
        
        self.authenticate_user('buyer')
        url = reverse('order-list')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_order_detail(self):
        """Test order detail view"""
        order = Order.objects.create(
            rfq=self.rfq,
            offer=self.offer,
            buyer=self.buyer_user,
            supplier=self.supplier_user,
            total_amount=8500.0,
            payment_method='bank',
            delivery_date=(timezone.now() + timedelta(days=30)).date()
        )
        
        self.authenticate_user('buyer')
        url = reverse('order-detail', kwargs={'pk': order.id})
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_amount'], '8500.00')
        self.assertEqual(response.data['payment_method'], 'bank')


class PermissionTest(BaseAPITestCase):
    """Test permission system"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_unauthenticated_access(self):
        """Test unauthenticated access"""
        url = reverse('rfq-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_buyer_can_create_rfq(self):
        """Test buyer can create RFQ"""
        self.authenticate_user('buyer')
        url = reverse('rfq-list')
        data = {
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'unit': self.weight_unit.id,
            'volume': 15.0,
            'delivery_location': 'Samarkand',
            'delivery_date': (timezone.now() + timedelta(days=30)).date(),
            'expires_at': timezone.now() + timedelta(days=7),
            'payment_method': 'cash'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_supplier_cannot_create_rfq(self):
        """Test supplier cannot create RFQ"""
        self.authenticate_user('supplier')
        url = reverse('rfq-list')
        data = {
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'unit': self.weight_unit.id,
            'volume': 15.0,
            'delivery_location': 'Samarkand',
            'delivery_date': (timezone.now() + timedelta(days=30)).date(),
            'expires_at': timezone.now() + timedelta(days=7),
            'payment_method': 'cash'
        }
        
        response = self.client.post(url, data)
        # Supplier cannot create RFQ - validation error in serializer
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Error is in buyer field validation  
        self.assertIn('buyer', response.data)
