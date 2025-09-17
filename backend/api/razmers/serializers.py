from rest_framework import serializers
from ..models import Razmer, SubCategory


class RazmerSerializer(serializers.ModelSerializer):
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    category_name = serializers.CharField(source='subcategory.category.name', read_only=True)
    
    class Meta:
        model = Razmer
        fields = ['id', 'name', 'subcategory', 'subcategory_name', 'category_name', 'category', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class RazmerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Razmer
        fields = ['name', 'category', 'subcategory']
    
    def validate(self, data):
        # Subcategory mavjudligini tekshirish
        subcategory = data.get('subcategory')
        if not subcategory:
            raise serializers.ValidationError("Subcategory majburiy")
        
        # Bir xil subcategory da bir xil nomli razmer bo'lmasligi kerak
        name = data.get('name')
        if Razmer.objects.filter(subcategory=subcategory, name=name).exists():
            raise serializers.ValidationError("Bu subcategory da bunday razmer mavjud")
        
        return data
