"""
Metadata views - Status va boshqa metadata ma'lumotlari uchun views
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from ..models import Order, RFQ, Offer


class OrderStatusesView(APIView):
    """
    Order statuslari ro'yxati
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Order statuslarini qaytarish"""
        statuses = [
            {
                'value': choice[0],
                'label': choice[1],
                'id': choice[0],
                'name': choice[1]
            }
            for choice in Order.OrderStatus.choices
        ]
        return Response(statuses)


class RFQStatusesView(APIView):
    """
    RFQ statuslari ro'yxati
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """RFQ statuslarini qaytarish"""
        statuses = [
            {
                'value': choice[0],
                'label': choice[1],
                'id': choice[0],
                'name': choice[1]
            }
            for choice in RFQ.RFQStatus.choices
        ]
        return Response(statuses)


class OfferStatusesView(APIView):
    """
    Offer statuslari ro'yxati
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Offer statuslarini qaytarish"""
        statuses = [
            {
                'value': choice[0],
                'label': choice[1],
                'id': choice[0],
                'name': choice[1]
            }
            for choice in Offer.OfferStatus.choices
        ]
        return Response(statuses)


class AllStatusesView(APIView):
    """
    Barcha statuslar bitta endpoint'da
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Barcha statuslarni qaytarish"""
        return Response({
            'order_statuses': [
                {
                    'value': choice[0],
                    'label': choice[1],
                    'id': choice[0],
                    'name': choice[1]
                }
                for choice in Order.OrderStatus.choices
            ],
            'rfq_statuses': [
                {
                    'value': choice[0],
                    'label': choice[1],
                    'id': choice[0],
                    'name': choice[1]
                }
                for choice in RFQ.RFQStatus.choices
            ],
            'offer_statuses': [
                {
                    'value': choice[0],
                    'label': choice[1],
                    'id': choice[0],
                    'name': choice[1]
                }
                for choice in Offer.OfferStatus.choices
            ]
        })
