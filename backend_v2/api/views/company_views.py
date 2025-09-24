"""
Company views - Kompaniyalar uchun views
"""

from django.db.models import Q
from rest_framework.views import APIView
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from ..models import Company, User
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
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Kompaniya yaratish"""
        # Har bir foydalanuvchi faqat bitta kompaniya yarata oladi
        if hasattr(self.request.user, 'company'):
            raise permissions.PermissionDenied("Sizda allaqachon kompaniya mavjud")
        serializer.save()
    
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
