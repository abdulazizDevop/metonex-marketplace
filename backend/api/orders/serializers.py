from rest_framework import serializers
from api.models import Order


class OrderSerializer(serializers.ModelSerializer):
    buyer_phone = serializers.SerializerMethodField(read_only=True)
    supplier_phone = serializers.SerializerMethodField(read_only=True)
    buyer_company_name = serializers.SerializerMethodField(read_only=True)
    supplier_company_name = serializers.SerializerMethodField(read_only=True)
    request_description = serializers.SerializerMethodField(read_only=True)
    payment_document_url = serializers.SerializerMethodField(read_only=True)
    ttn_document_url = serializers.SerializerMethodField(read_only=True)
    delivery_photos_urls = serializers.SerializerMethodField(read_only=True)
    buyer_company = serializers.SerializerMethodField(read_only=True)
    supplier_company = serializers.SerializerMethodField(read_only=True)
    request = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            "id",
            "request",
            "offer",
            "buyer_company",
            "supplier_company",
            "buyer_company_name",
            "supplier_company_name",
            "request_description",
            "total_amount",
            "payment_terms",
            "status",
            "payment_document",
            "payment_document_url",
            "payment_confirmed_at",
            "ttn_document",
            "ttn_document_url",
            "delivery_photos",
            "delivery_photos_urls",
            "created_at",
            "started_at",
            "completed_at",
            "cancelled_at",
            "cancellation_reason",
            "buyer_phone",
            "supplier_phone",
        ]
        read_only_fields = ["id", "created_at", "payment_confirmed_at"]

    def _get_company_primary_phone(self, company):
        try:
            from api.models import CompanyMember
            owner = CompanyMember.objects.select_related("user").filter(company=company, role=CompanyMember.Role.OWNER).first()
            if owner and owner.user and owner.user.phone:
                return owner.user.phone
            any_member = CompanyMember.objects.select_related("user").filter(company=company).first()
            return any_member.user.phone if any_member and any_member.user else None
        except Exception:
            return None

    def get_buyer_phone(self, obj: Order):
        return self._get_company_primary_phone(obj.buyer_company)

    def get_supplier_phone(self, obj: Order):
        return self._get_company_primary_phone(obj.supplier_company)

    def get_payment_document_url(self, obj):
        if obj.payment_document:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.payment_document.url)
            return obj.payment_document.url
        return None

    def get_ttn_document_url(self, obj):
        if obj.ttn_document:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.ttn_document.url)
            return obj.ttn_document.url
        return None

    def get_delivery_photos_urls(self, obj):
        if obj.delivery_photos:
            request = self.context.get('request')
            urls = []
            for photo in obj.delivery_photos:
                if request:
                    # To'g'ridan-to'g'ri URL yaratamiz
                    base_url = request.build_absolute_uri('/').rstrip('/')
                    urls.append(f"{base_url}/files/orders/delivery_photos/{photo}")
                else:
                    urls.append(f"/files/orders/delivery_photos/{photo}")
            return urls
        return []

    def get_buyer_company_name(self, obj):
        return obj.buyer_company.name if obj.buyer_company else None

    def get_supplier_company_name(self, obj):
        return obj.supplier_company.name if obj.supplier_company else None

    def get_request_description(self, obj):
        return obj.request.description if obj.request else None

    def get_buyer_company(self, obj):
        if obj.buyer_company:
            return {
                'id': obj.buyer_company.id,
                'name': obj.buyer_company.name,
                'region': obj.buyer_company.region,
                'verified': obj.buyer_company.verified,
                'bank_details': obj.buyer_company.bank_details if hasattr(obj.buyer_company, 'bank_details') else None,
                'members': [
                    {
                        'user': member.user.id,
                        'role': member.role
                    } for member in obj.buyer_company.members.all()
                ]
            }
        return None

    def get_supplier_company(self, obj):
        if obj.supplier_company:
            return {
                'id': obj.supplier_company.id,
                'name': obj.supplier_company.name,
                'region': obj.supplier_company.region,
                'verified': obj.supplier_company.verified,
                'bank_details': obj.supplier_company.bank_details if hasattr(obj.supplier_company, 'bank_details') else None,
                'members': [
                    {
                        'user': member.user.id,
                        'role': member.role
                    } for member in obj.supplier_company.members.all()
                ]
            }
        return None

    def get_request(self, obj):
        if obj.request:
            return {
                'id': obj.request.id,
                'description': obj.request.description,
                'category': {
                    'id': obj.request.category.id,
                    'name': obj.request.category.name
                } if obj.request.category else None,
                'quantity': obj.request.quantity,
                'unit': obj.request.unit,
                'budget_from': obj.request.budget_from,
                'budget_to': obj.request.budget_to,
                'region': obj.request.region,
                'delivery_address': obj.request.delivery_address,
                'deadline_date': obj.request.deadline_date,
                'status': obj.request.status,
                'payment_type': obj.request.payment_type
            }
        return None



