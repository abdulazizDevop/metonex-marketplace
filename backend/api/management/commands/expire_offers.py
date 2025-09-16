from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Offer


class Command(BaseCommand):
    help = 'Muddati tugagan takliflarni avtomatik ravishda tugatadi'

    def handle(self, *args, **options):
        now = timezone.now()
        
        # Muddati tugagan faol takliflarni topish
        expired_offers = Offer.objects.filter(
            status='kutilmoqda',
            expires_at__lt=now
        )
        
        count = expired_offers.count()
        
        if count > 0:
            # Takliflarni tugatilgan holatga o'tkazish
            expired_offers.update(status='muddati_tugadi')
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'{count} ta taklif muddati tugadi va tugatilgan holatga o\'tkazildi'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('Muddati tugagan takliflar topilmadi')
            )
