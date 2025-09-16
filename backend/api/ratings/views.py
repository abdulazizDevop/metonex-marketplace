from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Rating, Order, CompanyMember, Company
from .serializers import RatingSerializer


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.select_related("order", "rater_company", "rated_company").all().order_by("-created_at")
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        # faqat o'zi rater bo'lgan yoki o'zi kompaniyasiga berilgan baholarni ko'rsin
        return qs.filter(rater_company__members__user=self.request.user) | qs.filter(rated_company__members__user=self.request.user)

    def perform_create(self, serializer):
        order_id = self.request.data.get("order")
        if not order_id:
            raise ValueError("order talab qilinadi")
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            raise ValueError("Buyurtma topilmadi")
        # buyer baholaydi supplierni
        if not CompanyMember.objects.filter(company=order.buyer_company, user=self.request.user).exists():
            raise PermissionError("Ruxsat yo'q")
        if order.status != Order.OrderStatus.COMPLETED:
            raise PermissionError("Faqat yakunlangan buyurtma uchun baho beriladi")
        if Rating.objects.filter(order=order, rater_company=order.buyer_company).exists():
            raise PermissionError("Bu buyurtma uchun baho allaqachon berilgan")
        
        # Qo'shimcha validatsiyalar
        data = self.request.data
        
        # Agar frontend'dan bitta rating kelsa, uni barcha maydonlarga qo'yamiz
        rating = data.get('rating')
        if rating:
            try:
                rating_int = int(rating)
                if rating_int < 1 or rating_int > 5:
                    raise ValueError("Baho 1 dan 5 gacha bo'lishi kerak")
                # Bitta rating kelsa, uni barcha maydonlarga qo'yamiz
                data['quality_rating'] = rating_int
                data['delivery_speed'] = rating_int
                data['communication'] = rating_int
                data['price_fairness'] = rating_int
                data['reliability'] = rating_int
            except ValueError as e:
                if "invalid literal" in str(e):
                    raise ValueError("Noto'g'ri baho formati")
                raise e
        
        # Comment validatsiyasi
        comment = data.get('comment')
        if comment and len(comment) > 1000:
            raise ValueError("Izoh juda uzun")
        
        # Overall score hisoblash
        ratings = [
            data.get('quality_rating', 1),
            data.get('delivery_speed', 1),
            data.get('communication', 1),
            data.get('price_fairness', 1),
            data.get('reliability', 1)
        ]
        overall_score = sum(ratings) / len(ratings)
        data['overall_score'] = round(overall_score, 1)
        
        serializer.save(rater_company=order.buyer_company, rated_company=order.supplier_company)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def company(self, request, company_id=None):
        # Kompaniyaga berilgan barcha rating'larni olish
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response({"detail": "Kompaniya topilmadi"}, status=404)
        
        ratings = self.get_queryset().filter(rated_company=company)
        serializer = self.get_serializer(ratings, many=True)
        
        # Average rating hisoblashNoti
        if ratings.exists():
            avg_rating = sum(r.overall_score for r in ratings) / ratings.count()
            total_ratings = ratings.count()
        else:
            avg_rating = 0
            total_ratings = 0
        
        return Response({
            "ratings": serializer.data,
            "average_rating": round(avg_rating, 2),
            "total_ratings": total_ratings
        })

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def order(self, request, order_id=None):
        # Order uchun rating olish
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"detail": "Buyurtma topilmadi"}, status=404)
        
        # Check if user has access to this order
        is_buyer = CompanyMember.objects.filter(company=order.buyer_company, user=request.user).exists()
        is_supplier = CompanyMember.objects.filter(company=order.supplier_company, user=request.user).exists()
        
        if not (is_buyer or is_supplier):
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        
        rating = self.get_queryset().filter(order=order).first()
        if rating:
            serializer = self.get_serializer(rating)
            return Response(serializer.data)
        else:
            return Response({"detail": "Rating topilmadi"}, status=404)
