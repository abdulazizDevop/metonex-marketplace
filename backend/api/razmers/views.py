from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Razmer, SubCategory
from .serializers import RazmerSerializer, RazmerCreateSerializer


class RazmerListCreateView(generics.ListCreateAPIView):
    queryset = Razmer.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RazmerCreateSerializer
        return RazmerSerializer
    
    def get_queryset(self):
        queryset = Razmer.objects.select_related('subcategory__category').all()
        
        # Subcategory bo'yicha filter
        subcategory_id = self.request.query_params.get('subcategory')
        if subcategory_id:
            queryset = queryset.filter(subcategory_id=subcategory_id)
        
        # Category bo'yicha filter
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        return queryset.order_by('subcategory__category__name', 'subcategory__name', 'name')


class RazmerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Razmer.objects.all()
    serializer_class = RazmerSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_razmers_by_subcategory(request, subcategory_id):
    """
    Subcategory bo'yicha razmerlarni olish
    """
    try:
        subcategory = get_object_or_404(SubCategory, id=subcategory_id)
        razmers = Razmer.objects.filter(subcategory=subcategory).order_by('name')
        serializer = RazmerSerializer(razmers, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'subcategory': {
                'id': subcategory.id,
                'name': subcategory.name,
                'category_name': subcategory.category.name
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
