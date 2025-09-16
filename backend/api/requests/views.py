from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from api.models import Request, CompanyMember
from .serializers import RequestSerializer


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.select_related("buyer_company", "category").all().order_by("-created_at")
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        search = params.get("search")
        category = params.get("category")
        region = params.get("region")
        status_param = params.get("status")
        ordering = params.get("ordering")
        
        if search:
            qs = qs.filter(
                Q(description__icontains=search) | 
                Q(category__name__icontains=search) |
                Q(buyer_company__name__icontains=search)
            )
        if category:
            qs = qs.filter(category_id=category)
        if region:
            qs = qs.filter(region__icontains=region)
        if status_param:
            qs = qs.filter(status=status_param)
        if ordering in ["created_at", "-created_at", "deadline_date", "-deadline_date", "budget_to", "-budget_to"]:
            qs = qs.order_by(ordering)
        return qs

    def perform_create(self, serializer):
        buyer_company_id = self.request.data.get("buyer_company")
        if not buyer_company_id:
            raise ValueError("buyer_company talab qilinadi")
        if not CompanyMember.objects.filter(company_id=buyer_company_id, user=self.request.user).exists():
            raise PermissionError("Kompaniyaga a'zo emassiz")
        
        # Qo'shimcha validatsiyalar
        data = self.request.data
        
        # Budget validatsiyasi
        budget_from = data.get('budget_from')
        budget_to = data.get('budget_to')
        if budget_from and budget_to and float(budget_from) >= float(budget_to):
            raise ValueError("budget_from budget_to dan kichik bo'lishi kerak")
        
        # Deadline validatsiyasi
        deadline_date = data.get('deadline_date')
        if deadline_date:
            from datetime import datetime
            try:
                deadline = datetime.strptime(deadline_date, '%Y-%m-%d').date()
                if deadline <= timezone.now().date():
                    raise ValueError("Deadline bugungi kundan keyin bo'lishi kerak")
            except ValueError as e:
                if "time data" in str(e):
                    raise ValueError("Noto'g'ri deadline format")
                raise e
        
        # Quantity validatsiyasi
        quantity = data.get('quantity')
        if quantity and float(quantity) <= 0:
            raise ValueError("Miqdor 0 dan katta bo'lishi kerak")
        
        serializer.save(buyer_company_id=buyer_company_id)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def my(self, request):
        qs = self.get_queryset().filter(buyer_company__members__user=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def close(self, request, pk=None):
        obj = self.get_object()
        if not CompanyMember.objects.filter(company=obj.buyer_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        obj.status = Request.RequestStatus.CLOSED
        obj.save(update_fields=["status"])
        return Response({"detail": "Yopildi"})

    @action(detail=True, methods=["put"], permission_classes=[permissions.IsAuthenticated])
    def cancel(self, request, pk=None):
        obj = self.get_object()
        if not CompanyMember.objects.filter(company=obj.buyer_company, user=request.user).exists():
            return Response({"detail": "Ruxsat yo'q"}, status=403)
        
        if obj.status != Request.RequestStatus.OPEN:
            return Response({"detail": "Faqat ochiq requestlarni bekor qilish mumkin"}, status=400)
        
        obj.status = Request.RequestStatus.CANCELLED
        obj.cancellation_reason = request.data.get("reason", "")
        obj.save(update_fields=["status", "cancellation_reason"])
        return Response({"detail": "Request bekor qilindi"})

