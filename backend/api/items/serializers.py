from rest_framework import serializers
from api.models import Item, ItemImage


class ItemSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    images_urls = serializers.SerializerMethodField(read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    company_name = serializers.CharField(source="company.name", read_only=True)
    company_logo = serializers.SerializerMethodField(read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)
    subcategory_name = serializers.CharField(source="subcategory.name", read_only=True, default=None)
    class Meta:
        model = Item
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "subcategory",
            "subcategory_name",
            "company_name",
            "company_logo",
            "user_name",
            "company",
            "user",
            "status",
            "description",
            "quantity",
            "unit",
            "price",
            "images",
            "images_urls",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def get_images_urls(self, obj):
        request = self.context.get("request")
        urls = [img.image.url for img in obj.images.all()]
        if request:
            return [request.build_absolute_uri(u) for u in urls]
        return urls

    def get_company_logo(self, obj):
        if obj.company and obj.company.logo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.company.logo.url)
            return obj.company.logo.url
        return None

    def create(self, validated_data):
        images = validated_data.pop("images", [])
        item = super().create(validated_data)
        for img in images:
            ItemImage.objects.create(item=item, image=img)
        return item

    def update(self, instance, validated_data):
        images = validated_data.pop("images", None)
        # company update taqiqlanadi
        validated_data.pop("company", None)
        item = super().update(instance, validated_data)
        if images is not None:
            for img in images:
                ItemImage.objects.create(item=item, image=img)
        return item

