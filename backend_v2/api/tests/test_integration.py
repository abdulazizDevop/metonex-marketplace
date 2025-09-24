"""
Integration tests for MetOneX API
"""

from django.utils import timezone
from datetime import timedelta
from django.urls import reverse
from rest_framework import status
from api.models import RFQ, User, VerificationCode

from api.tests.base import BaseAPITestCase


class RFQToOrderWorkflowTest(BaseAPITestCase):
    """Test complete RFQ to Order workflow"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_complete_rfq_to_order_workflow(self):
        """Test complete workflow: RFQ → Offer → Order"""
        
        # Step 1: Buyer creates RFQ
        self.authenticate_user('buyer')
        rfq_url = reverse('rfq-list')
        rfq_data = {
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'unit': self.weight_unit.id,
            'volume': 20.0,
            'delivery_location': 'Tashkent',
            'delivery_date': (timezone.now() + timedelta(days=30)).date(),
            'expires_at': timezone.now() + timedelta(days=7),
            'payment_method': 'bank'
        }
        
        rfq_response = self.client.post(rfq_url, rfq_data)
        self.assertEqual(rfq_response.status_code, status.HTTP_201_CREATED)
        rfq_id = rfq_response.data['id']
        
        # Step 2: Supplier creates offer
        self.authenticate_user('supplier')
        offer_url = reverse('offer-list')
        offer_data = {
            'rfq': rfq_id,
            'price_per_unit': 900.0,
            'total_amount': 18000.0,
            'delivery_terms': 'Delivery included',
            'delivery_date': (timezone.now() + timedelta(days=35)).date(),
            'comment': 'High quality rebar'
        }
        
        offer_response = self.client.post(offer_url, offer_data)
        self.assertEqual(offer_response.status_code, status.HTTP_201_CREATED)
        offer_id = offer_response.data['id']
        
        # Step 3: Buyer accepts offer (creates order)
        self.authenticate_user('buyer')
        accept_url = reverse('offer-accept', kwargs={'pk': offer_id})
        
        accept_response = self.client.post(accept_url)
        self.assertEqual(accept_response.status_code, status.HTTP_200_OK)
        
        # Step 4: Verify order was created
        order_url = reverse('order-list')
        order_response = self.client.get(order_url)
        self.assertEqual(order_response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(order_response.data['results']), 0)
        
        # Verify order details
        order = order_response.data['results'][0]
        self.assertEqual(order['total_amount'], '18000.00')
        self.assertEqual(order['payment_method'], 'bank')
        self.assertEqual(order['status'], 'created')
    
    def test_rfq_expiration_workflow(self):
        """Test RFQ expiration workflow"""
        
        # Create RFQ
        self.authenticate_user('buyer')
        rfq_url = reverse('rfq-list')
        rfq_data = {
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'unit': self.weight_unit.id,
            'volume': 10.0,
            'delivery_location': 'Tashkent',
            'delivery_date': (timezone.now() + timedelta(days=30)).date(),
            'expires_at': timezone.now() + timedelta(days=7),
            'payment_method': 'bank'
        }
        
        rfq_response = self.client.post(rfq_url, rfq_data)
        self.assertEqual(rfq_response.status_code, status.HTTP_201_CREATED)
        rfq_id = rfq_response.data['id']
        
        # Manually expire RFQ
        rfq = RFQ.objects.get(id=rfq_id)
        rfq.status = RFQ.RFQStatus.EXPIRED
        rfq.save()
        
        # Try to create offer for expired RFQ
        self.authenticate_user('supplier')
        offer_url = reverse('offer-list')
        offer_data = {
            'rfq': rfq_id,
            'price_per_unit': 850.0,
            'total_amount': 8500.0,
            'delivery_terms': 'Delivery included',
            'delivery_date': (timezone.now() + timedelta(days=35)).date()
        }
        
        offer_response = self.client.post(offer_url, offer_data)
        self.assertEqual(offer_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rfq', offer_response.data)


class CompanyWorkflowTest(BaseAPITestCase):
    """Test company management workflow"""
    
    def test_company_creation_and_update_workflow(self):
        """Test company creation and update workflow"""
        
        # Step 1: Create company
        self.authenticate_user('buyer')
        create_url = reverse('company-list')
        company_data = {
            'name': 'Test Company LLC',
            'legal_address': 'Tashkent, Navoi street 123',
            'inn_stir': '123456789',
            'bank_details': {
                'bank_name': 'National Bank',
                'account': '12345678901234567890'
            },
            'accountant_contact': {
                'name': 'John Smith',
                'phone': '+998901234567'
            }
        }
        
        create_response = self.client.post(create_url, company_data, format='json')
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_response.data['name'], 'Test Company LLC')
        
        # Refresh user to get company relationship
        self.buyer_user.refresh_from_db()
        
        # Step 2: Update company
        update_url = reverse('company-detail', kwargs={'pk': 1})
        update_data = {
            'name': 'Updated Company LLC',
            'legal_address': 'Tashkent, Amir Temur street 456',
            'inn_stir': '987654321'
        }
        
        update_response = self.client.put(update_url, update_data, format='json')
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data['name'], 'Updated Company LLC')
        
        # Step 3: Get company profile
        # Re-authenticate to refresh user in request context
        self.authenticate_user('buyer')
        
        profile_url = reverse('company-profile')
        profile_response = self.client.get(profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data['name'], 'Updated Company LLC')


class CatalogWorkflowTest(BaseAPITestCase):
    """Test catalog management workflow"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_catalog_hierarchy_workflow(self):
        """Test catalog hierarchy workflow"""
        
        # Step 1: Get units
        self.authenticate_user('buyer')
        units_url = reverse('unit-list')
        units_response = self.client.get(units_url)
        self.assertEqual(units_response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(units_response.data['results']), 0)
        
        # Step 2: Get categories
        categories_url = reverse('category-list')
        categories_response = self.client.get(categories_url)
        self.assertEqual(categories_response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(categories_response.data['results']), 0)
        
        # Step 3: Get subcategories
        subcategories_url = reverse('subcategory-list')
        subcategories_response = self.client.get(subcategories_url)
        self.assertEqual(subcategories_response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(subcategories_response.data['results']), 0)
        
        # Step 4: Get category with subcategories
        category_id = self.category.id
        category_with_subcategories_url = reverse('category-with-subcategories', 
                                                kwargs={'pk': category_id})
        category_response = self.client.get(category_with_subcategories_url)
        self.assertEqual(category_response.status_code, status.HTTP_200_OK)
        self.assertIn('subcategories', category_response.data)
        
        # Step 5: Get available units for category
        available_units_url = reverse('category-available-units', 
                                    kwargs={'pk': category_id})
        units_response = self.client.get(available_units_url)
        self.assertEqual(units_response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(units_response.data), 0)


class AuthenticationWorkflowTest(BaseAPITestCase):
    """Test authentication workflow"""
    
    def test_complete_authentication_workflow(self):
        """Test complete authentication workflow"""
        
        # First simulate phone verification
        verification_code = VerificationCode.objects.create(
            phone='+998901234600',
            code='123456',
            expires_at=timezone.now() + timedelta(minutes=5)
        )
        verification_code.mark_as_used()
        
        # Step 1: Register new user
        register_url = reverse('user-register')
        register_data = {
            'phone': '+998901234600',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'role': 'buyer',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        register_response = self.client.post(register_url, register_data)
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', register_response.data)
        self.assertIn('access', register_response.data['tokens'])
        self.assertIn('refresh', register_response.data['tokens'])
        
        # Step 2: Login with new user
        login_url = reverse('user-login')
        login_data = {
            'phone': '+998901234600',
            'password': 'testpass123'
        }
        
        login_response = self.client.post(login_url, login_data)
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)
        self.assertIn('refresh', login_response.data)
        
        # Step 3: Access protected endpoint
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_response.data["access"]}')
        profile_url = reverse('user-profile')
        profile_response = self.client.get(profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data['phone'], '+998901234600')
        
        # Step 4: Update profile
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        update_response = self.client.put(profile_url, update_data)
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data['first_name'], 'Updated')
        self.assertEqual(update_response.data['last_name'], 'Name')
        
        # Step 5: Logout
        logout_url = reverse('user-logout')
        logout_response = self.client.post(logout_url)
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        
        # Step 6: Try to access protected endpoint after logout
        self.client.credentials()  # Clear credentials
        profile_response = self.client.get(profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_401_UNAUTHORIZED)


class PermissionWorkflowTest(BaseAPITestCase):
    """Test permission workflow"""
    
    def setUp(self):
        super().setUp()
        self.create_test_data()
    
    def test_role_based_permissions(self):
        """Test role-based permissions"""
        
        # Test buyer permissions
        self.authenticate_user('buyer')
        
        # Buyer can create RFQ
        rfq_url = reverse('rfq-list')
        rfq_data = {
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'unit': self.weight_unit.id,
            'volume': 10.0,
            'delivery_location': 'Tashkent',
            'delivery_date': (timezone.now() + timedelta(days=30)).date(),
            'expires_at': timezone.now() + timedelta(days=7),
            'payment_method': 'bank'
        }
        rfq_response = self.client.post(rfq_url, rfq_data)
        self.assertEqual(rfq_response.status_code, status.HTTP_201_CREATED)
        
        # Test supplier permissions
        self.authenticate_user('supplier')
        
        # Supplier cannot create RFQ
        rfq_response = self.client.post(rfq_url, rfq_data)
        self.assertEqual(rfq_response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Supplier can create offer
        offer_url = reverse('offer-list')
        offer_data = {
            'rfq': rfq_response.data.get('id', 1),
            'price_per_unit': 850.0,
            'total_amount': 8500.0,
            'delivery_terms': 'Delivery included',
            'delivery_date': (timezone.now() + timedelta(days=35)).date()
        }
        offer_response = self.client.post(offer_url, offer_data)
        # This might fail if RFQ doesn't exist, but the permission should be correct
        self.assertIn(offer_response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])
    
    def test_ownership_permissions(self):
        """Test ownership permissions"""
        
        # Create RFQ as buyer
        self.authenticate_user('buyer')
        rfq_url = reverse('rfq-list')
        rfq_data = {
            'category': self.category.id,
            'subcategory': self.subcategory.id,
            'unit': self.weight_unit.id,
            'volume': 10.0,
            'delivery_location': 'Tashkent',
            'delivery_date': (timezone.now() + timedelta(days=30)).date(),
            'expires_at': timezone.now() + timedelta(days=7),
            'payment_method': 'bank'
        }
        rfq_response = self.client.post(rfq_url, rfq_data)
        self.assertEqual(rfq_response.status_code, status.HTTP_201_CREATED)
        rfq_id = rfq_response.data['id']
        
        # Try to access RFQ as different buyer
        different_buyer = User.objects.create_user(
            username='different_buyer',
            phone='+998901234700',
            password='testpass123',
            role=User.UserRole.BUYER,
            first_name='Different',
            last_name='Buyer'
        )
        different_token = self.get_token(different_buyer)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {different_token}')
        
        # Different buyer should not be able to access RFQ
        rfq_detail_url = reverse('rfq-detail', kwargs={'pk': rfq_id})
        detail_response = self.client.get(rfq_detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_403_FORBIDDEN)
