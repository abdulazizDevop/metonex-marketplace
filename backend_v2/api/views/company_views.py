"""
Company views - Kompaniyalar uchun views
"""

from django.db.models import Q
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
import json
import uuid

from ..models import Company, User, Factory, DealerFactory
from ..serializers import (
    CompanySerializer,
    CompanyProfileSerializer,
    CompanyListSerializer,
    CompanyCreateSerializer,
    CompanyUpdateSerializer
)


class CompanyViewSet(viewsets.ModelViewSet):
    """
    Kompaniyalar uchun ViewSet
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_verified']
    search_fields = ['name', 'inn_stir']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Company.objects.select_related('user').prefetch_related(
            'user__supplier_categories__category',
            'user__dealer_factories__factory'
        )
    
    def get_serializer_class(self):
        """Action bo'yicha serializer tanlash"""
        if self.action == 'list':
            return CompanyListSerializer
        elif self.action == 'create':
            return CompanyCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CompanyUpdateSerializer
        return CompanySerializer
    
    def get_permissions(self):
        """Permission tekshirish"""
        if self.action in ['list', 'retrieve', 'my_company', 'members', 'member_detail']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update', 'create_profile']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Kompaniya yaratish"""
        # Har bir foydalanuvchi faqat bitta kompaniya yarata oladi
        if hasattr(self.request.user, 'company'):
            raise permissions.PermissionDenied("Sizda allaqachon kompaniya mavjud")
        
        # Foydalanuvchini kompaniya egasi sifatida belgilash
        company = serializer.save(user=self.request.user)
        
        # Kompaniya yaratilganda foydalanuvchini faollashtirish
        self.request.user.is_active = True
        self.request.user.save()
        
        # Kompaniya egasini member sifatida qo'shish
        from ..models import CompanyMember
        CompanyMember.objects.create(
            company=company,
            user=self.request.user,
            name=f"{self.request.user.first_name} {self.request.user.last_name}".strip() or self.request.user.phone,
            role=CompanyMember.Role.OWNER,
            phone=self.request.user.phone,
            email=self.request.user.email or ''
        )
        
        return company
    
    def perform_update(self, serializer):
        """Kompaniya yangilash"""
        # Faqat kompaniya egasi yangilay oladi
        if serializer.instance.user != self.request.user:
            raise permissions.PermissionDenied("Siz bu kompaniyani yangilay olmaysiz")
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def my_company(self, request):
        """Joriy foydalanuvchi kompaniyasi"""
        try:
            company = request.user.company
            serializer = CompanyProfileSerializer(company)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({'error': 'Kompaniya topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def create_profile(self, request):
        """Kompaniya profili yaratish"""
        # Foydalanuvchi allaqachon kompaniyaga ega bo'lsa
        if hasattr(request.user, 'company'):
            return Response({'error': 'Siz allaqachon kompaniyaga egasiz'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CompanyCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            company = serializer.save()
            response_serializer = CompanyProfileSerializer(company)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """Kompaniya profili"""
        company = self.get_object()
        serializer = CompanyProfileSerializer(company)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Kompaniyani tasdiqlash"""
        company = self.get_object()
        company.is_verified = True
        company.save()
        return Response({'message': 'Kompaniya tasdiqlandi'})
    
    @action(detail=True, methods=['post'])
    def unverify(self, request, pk=None):
        """Kompaniya tasdiqini bekor qilish"""
        company = self.get_object()
        company.is_verified = False
        company.save()
        return Response({'message': 'Kompaniya tasdiqi bekor qilindi'})
    
    @action(detail=False, methods=['get'])
    def verified(self, request):
        """Tasdiqlangan kompaniyalar"""
        companies = self.get_queryset().filter(is_verified=True)
        serializer = CompanyListSerializer(companies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def unverified(self, request):
        """Tasdiqlanmagan kompaniyalar"""
        companies = self.get_queryset().filter(is_verified=False)
        serializer = CompanyListSerializer(companies, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'post'])
    def members(self, request):
        """Kompaniya a'zolarini boshqarish"""
        try:
            company = request.user.company
        except Company.DoesNotExist:
            return Response({'error': 'Kompaniya topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            # Kompaniya a'zolarini olish
            members = company.team_members or []
            return Response({
                'company_id': company.id,
                'company_name': company.name,
                'members': members
            })
        
        elif request.method == 'POST':
            # Yangi a'zo qo'shish
            member_data = request.data
            required_fields = ['name', 'position']
            
            for field in required_fields:
                if field not in member_data:
                    return Response(
                        {'error': f'{field} maydoni majburiy'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Mavjud a'zolarni olish
            current_members = company.team_members or []
            
            # Yangi a'zoni qo'shish
            new_member = {
                'id': len(current_members) + 1,
                'name': member_data['name'],
                'position': member_data['position'],
                'phone': member_data.get('phone', ''),
                'email': member_data.get('email', ''),
                'created_at': timezone.now().isoformat()
            }
            
            current_members.append(new_member)
            company.team_members = current_members
            company.save()
            
            return Response({
                'message': 'A\'zo muvaffaqiyatli qo\'shildi',
                'member': new_member
            }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['put', 'delete'], url_path='members/(?P<member_id>[^/.]+)')
    def member_detail(self, request, member_id=None):
        """Kompaniya a'zosini yangilash yoki o'chirish"""
        try:
            company = request.user.company
        except Company.DoesNotExist:
            return Response({'error': 'Kompaniya topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        
        # Mavjud a'zolarni olish
        current_members = company.team_members or []
        
        # A'zoni topish
        member_index = None
        for i, member in enumerate(current_members):
            if str(member.get('id', '')) == str(member_id):
                member_index = i
                break
        
        if member_index is None:
            return Response({'error': 'A\'zo topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'PUT':
            # A'zoni yangilash
            member_data = request.data
            current_members[member_index].update({
                'name': member_data.get('name', current_members[member_index]['name']),
                'position': member_data.get('position', current_members[member_index]['position']),
                'phone': member_data.get('phone', current_members[member_index]['phone']),
                'email': member_data.get('email', current_members[member_index]['email']),
                'updated_at': timezone.now().isoformat()
            })
            
            company.team_members = current_members
            company.save()
            
            return Response({
                'message': 'A\'zo muvaffaqiyatli yangilandi',
                'member': current_members[member_index]
            })
        
        elif request.method == 'DELETE':
            # A'zoni o'chirish
            deleted_member = current_members.pop(member_index)
            company.team_members = current_members
            company.save()
            
            return Response({
                'message': 'A\'zo muvaffaqiyatli o\'chirildi',
                'deleted_member': deleted_member
            })
    @action(detail=False, methods=['get'])
    def factories(self, request):
        """Foydalanuvchining zavodlarini olish"""
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar zavodlarni ko\'ra oladi'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        user_factories = Factory.objects.filter(
            dealers_factories__dealer=request.user
        ).distinct()
        
        factory_data = []
        for factory in user_factories:
            factory_data.append({
                'id': factory.id,
                'name': factory.name,
                'location': factory.location,
                'contact_info': factory.contact_info,
                'website': factory.website,
                'description': factory.description
            })
        
        return Response({
            'count': len(factory_data),
            'results': factory_data
        })


class CompanyProfileView(APIView):
    """
    Kompaniya profili uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CompanyProfileSerializer
    
    def get(self, request):
        """Kompaniya profili ma'lumotlarini olish"""
        try:
            # Refresh user to get latest company relationship
            user = User.objects.get(pk=request.user.pk)
            company = user.company
            serializer = CompanyProfileSerializer(company)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({'error': 'Kompaniya topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        """Kompaniya profili yangilash"""
        try:
            company = request.user.company
            serializer = CompanyUpdateSerializer(
                company, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                response_serializer = CompanyProfileSerializer(company)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist:
            return Response({'error': 'Kompaniya topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def dealer_factories(self, request):
        """Dealer zavodlarini saqlash"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication kerak'}, 
                           status=status.HTTP_401_UNAUTHORIZED)
        
        if request.user.role != User.UserRole.SUPPLIER:
            return Response({'error': 'Faqat sotuvchilar qo\'shishga ruxsati bor'}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        if request.user.supplier_type != User.SupplierType.DEALER:
            return Response({'error': 'Faqat dealer zavodlarini qo\'sha oladi'}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        factories_data = request.data.get('factories', [])
        if not factories_data:
            return Response({'error': 'Zavodlar matn ro\'yxati kerak'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Eski dealer factory ma'lumotlarini o'chirish
            DealerFactory.objects.filter(dealer=request.user).delete()
            
            # Yangi zavodlarni qo'shish
            created_factories = []
            for factory_name in factories_data:
                if factory_name and factory_name.strip():
                    # Factory yaratish yoki olish
                    factory, created = Factory.objects.get_or_create(
                        name=factory_name.strip(),
                        defaults={
                            'location': '',  # Bo'sh qoldirish mumkin
                            'contact_info': '',
                            'website': '',
                            'description': ''
                        }
                    )
                    
                    # DealerFactory bog'lanishini yaratish
                    dealer_factory, df_created = DealerFactory.objects.get_or_create(
                        dealer=request.user,
                        factory=factory
                    )
                    
                    created_factories.append({
                        'id': factory.id,
                        'name': factory.name,
                        'location': factory.location,
                        'created': created or df_created
                    })
            
            return Response({
                'message': f'{len(created_factories)} ta zavod qo\'shildi',
                'factories': created_factories
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Zavod qo\'shishda xatolik: {str(e)}'}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CompanyListView(viewsets.ReadOnlyModelViewSet):
    """
    Kompaniyalar ro'yxati uchun ViewSet
    """
    queryset = Company.objects.all()
    serializer_class = CompanyListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_verified']
    search_fields = ['name', 'inn_stir']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Queryset optimizatsiyasi"""
        return Company.objects.select_related('user')


class CompanyCreateView(APIView):
    """
    Kompaniya yaratish uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CompanyCreateSerializer
    
    def post(self, request):
        """Kompaniya yaratish"""
        # Foydalanuvchi allaqachon kompaniyaga ega bo'lsa
        if hasattr(request.user, 'company'):
            return Response({'error': 'Siz allaqachon kompaniyaga egasiz'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CompanyCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            company = serializer.save()
            response_serializer = CompanyProfileSerializer(company)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyUpdateView(APIView):
    """
    Kompaniya yangilash uchun APIView
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CompanyUpdateSerializer
    
    def put(self, request):
        """Kompaniya yangilash"""
        try:
            company = request.user.company
            serializer = CompanyUpdateSerializer(
                company, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                response_serializer = CompanyProfileSerializer(company)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist:
            return Response({'error': 'Kompaniya topilmadi'}, 
                           status=status.HTTP_404_NOT_FOUND)
