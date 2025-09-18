# Eskiz.uz SMS Xizmati Sozlash Qo'llanmasi

## 1. Eskiz.uz Hisob Yaratish

1. [Eskiz.uz](https://eskiz.uz) saytiga kiring
2. Ro'yxatdan o'ting
3. SMS yuborish uchun balans to'ldiring
4. Email va parolni eslab qoling

## 2. PythonAnywhere Serverida Sozlash

### Environment Variables Qo'shish

PythonAnywhere'da environment variables qo'shish uchun:

1. PythonAnywhere hisobingizga kiring
2. "Web" bo'limiga o'ting
3. "Environment variables" bo'limini toping
4. Quyidagi o'zgaruvchilarni qo'shing:

```
ESKIZ_EMAIL=your-email@example.com
ESKIZ_PASSWORD=your-password
ESKIZ_SENDER=4546
```

### Yangi Kutubxonani O'rnatish

```bash
# Console'da
pip3.10 install --user eskiz-sms==0.2.3
```

### Server Qayta Ishga Tushirish

Environment variables qo'shgandan so'ng serveri qayta ishga tushiring.

## 3. Test Qilish

### API Endpoint Test
```bash
# Console'da
curl -X POST https://metonex.pythonanywhere.com/api/v1/auth/send-code/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+998901234567"}'
```

### Python Test
```python
# Console'da Python shell
python3.10
>>> from api.sms_service import sms_service
>>> result = sms_service.send_verification_code("+998901234567", "123456")
>>> print(result)
```

## 4. Xatoliklar

### "SMS xizmati sozlanmagan" Xatosi
- `ESKIZ_EMAIL` va `ESKIZ_PASSWORD` to'g'ri o'rnatilganligini tekshiring
- Environment variables qo'shgandan so'ng serveri reload qiling

### "Noto'g'ri telefon raqam formati" Xatosi
- Telefon raqam `+998XXXXXXXXX` formatida bo'lishi kerak
- 12 ta raqam bo'lishi kerak
- `+998` bilan boshlanishi kerak

### SMS Yuborilmayotgan Muammo
1. **Eskiz.uz hisobini tekshiring**:
   - Balans yetarli
   - SMS yuborish ruxsati bor
   - Email va parol to'g'ri

2. **Network ulanishini tekshiring**:
   - PythonAnywhere'dan eskiz.uz'ga ulanish
   - Firewall sozlamalari

## 5. Eskiz-sms Kutubxonasi

Bu kutubxona quyidagi imkoniyatlarni beradi:

- **Avtomatik token boshqaruvi**: Token avtomatik saqlanadi va yangilanadi
- **Xatolik boshqaruvi**: Xatoliklarni to'g'ri boshqaradi
- **Async qo'llab-quvvatlash**: Asinxron ishlash imkoniyati
- **Environment fayl qo'llab-quvvatlash**: Token .env faylga saqlanadi

## 6. Production Sozlamalari

### Security
1. `DEBUG = False` qiling
2. `ESKIZ_EMAIL` va `ESKIZ_PASSWORD` ni environment variable sifatida sozlang
3. `.env` faylni `.gitignore` ga qo'shing

### Performance
1. Token caching
2. Rate limiting
3. Error handling

### Monitoring
1. SMS yuborish loglari
2. Xatolik tracking
3. Balans monitoring

## 7. Qo'shimcha Ma'lumotlar

- [Eskiz-sms GitHub](https://github.com/malikovss/eskiz-sms)
- [Eskiz.uz API Dokumentatsiyasi](https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest)
- [PyPI paketi](https://pypi.org/project/eskiz-sms/)

## 8. Troubleshooting

### Umumiy Muammolar
1. **Import xatolari**: `eskiz-sms` kutubxonasi o'rnatilmagan
2. **Authentication xatolari**: Email yoki parol noto'g'ri
3. **Network xatolari**: Internet ulanishi yo'q

### Debug Rejimi
```python
# settings.py'da
DEBUG = True
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'api.sms_service': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```
