from rest_framework import serializers
from api.models import Rating


class RatingSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField(read_only=True)
    rater_company_name = serializers.CharField(source='rater_company.name', read_only=True)
    rated_company_name = serializers.CharField(source='rated_company.name', read_only=True)
    
    class Meta:
        model = Rating
        fields = [
            "id",
            "order",
            "rater_company",
            "rater_company_name",
            "rated_company",
            "rated_company_name",
            "rating",
            "quality_rating",
            "delivery_speed",
            "communication",
            "price_fairness",
            "reliability",
            "overall_score",
            "comment",
            "project_type",
            "order_volume",
            "created_at",
        ]
        read_only_fields = ["id", "overall_score", "created_at", "rater_company", "rated_company"]
    
    def get_rating(self, obj):
        # Frontend uchun umumiy rating (overall_score)
        return obj.overall_score

