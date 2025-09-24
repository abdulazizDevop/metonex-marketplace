"""
Test utilities and base test classes
"""
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
import json

User = get_user_model()


class BaseAPITestCase(APITestCase):
    """
    Base test case for API tests with authentication
    """
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        
        # Create test users
        self.buyer_user = User.objects.create_user(
            username='buyer_user',
            phone='+998901234567',
            password='testpass123',
            role=User.UserRole.BUYER,
            first_name='Test',
            last_name='Buyer',
            phone_verified=True
        )
        
        self.supplier_user = User.objects.create_user(
            username='supplier_user',
            phone='+998901234568',
            password='testpass123',
            role=User.UserRole.SUPPLIER,
            supplier_type=User.SupplierType.MANUFACTURER,
            first_name='Test',
            last_name='Supplier',
            phone_verified=True
        )
        
        self.admin_user = User.objects.create_user(
            username='admin_user',
            phone='+998901234569',
            password='testpass123',
            role=User.UserRole.BUYER,
            is_staff=True,
            is_superuser=True,
            first_name='Admin',
            last_name='User',
            phone_verified=True
        )
        
        # Get JWT tokens
        self.buyer_token = self.get_token(self.buyer_user)
        self.supplier_token = self.get_token(self.supplier_user)
        self.admin_token = self.get_token(self.admin_user)
    
    def get_token(self, user):
        """Get JWT token for user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)
    
    def authenticate_user(self, user_type='buyer'):
        """Authenticate user for API calls"""
        if user_type == 'buyer':
            self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.buyer_token}')
        elif user_type == 'supplier':
            self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.supplier_token}')
        elif user_type == 'admin':
            self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
    
    def create_test_data(self):
        """Create additional test data"""
        from api.models import Unit, Category, SubCategory, Factory
        
        # Create units
        self.weight_unit = Unit.objects.create(
            name='Tonna',
            symbol='ton',
            unit_type=Unit.UnitType.WEIGHT
        )
        
        self.volume_unit = Unit.objects.create(
            name='Kubik metr',
            symbol='m3',
            unit_type=Unit.UnitType.VOLUME
        )
        
        # Create categories
        self.category = Category.objects.create(
            name='Armatura',
            slug='armatura',
            unit_type=Category.UnitType.WEIGHT,
            default_unit=self.weight_unit
        )
        
        # Create subcategories
        self.subcategory = SubCategory.objects.create(
            name='A500C',
            slug='a500c',
            category=self.category
        )
        
        # Create factory
        self.factory = Factory.objects.create(
            name='Test Factory',
            location='Tashkent'
        )


class BaseModelTestCase(TestCase):
    """
    Base test case for model tests
    """
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='test_user',
            phone='+998901234567',
            password='testpass123',
            role=User.UserRole.BUYER,
            first_name='Test',
            last_name='User'
        )
