# MetOneX Backend v2

MetOneX platform uchun yangi backend tizimi - microservices arxitektura asosida qurilgan.

## 🚀 Texnik Stack

- **Framework**: Django 5.2.6
- **API**: Django REST Framework 3.16.1
- **Authentication**: JWT (Simple JWT)
- **Database**: PostgreSQL (Production), SQLite (Development)
- **Cache**: Redis
- **Background Tasks**: Celery
- **Documentation**: OpenAPI/Swagger (DRF Spectacular)

## 📋 Talablar

- Python 3.11+
- PostgreSQL 13+ (production uchun)
- Redis (optional)

## 🛠 O'rnatish

### 1. Repository ni klonlash
```bash
git clone <repository-url>
cd metone_marketplace/backend_v2
```

### 2. Virtual environment yaratish
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# yoki
venv\Scripts\activate     # Windows
```

### 3. Paketlarni o'rnatish
```bash
pip install -r requirements.txt
```

### 4. Environment variables sozlash
```bash
cp env_example.txt .env
# .env faylini tahrirlang
```

### 5. Database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Superuser yaratish
```bash
python manage.py createsuperuser
```

### 7. Development server ishga tushirish
```bash
python manage.py runserver
```

## 🔧 Environment Variables

Asosiy environment variables:

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3  # Development
# DATABASE_URL=postgresql://user:pass@localhost:5432/db  # Production

# SMS Service
ESKIZ_EMAIL=your-email@example.com
ESKIZ_PASSWORD=your-password

# Payment Service
PAYME_MERCHANT_ID=your-merchant-id
PAYME_SECRET_KEY=your-secret-key
```

## 📚 API Documentation

Development server ishga tushgandan so'ng:
- **Swagger UI**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **Admin Panel**: http://localhost:8000/admin/

## 🏗 Arxitektura

### Modellar
- **User**: Custom user model (phone-based authentication)
- **VerificationCode**: SMS verification
- **UserSession**: Session management

### API Endpoints
- `/api/v1/auth/` - Authentication
- `/api/v1/users/` - User management
- `/api/v1/sessions/` - Session management

## 🧪 Testing

```bash
# Barcha testlarni ishga tushirish
python manage.py test

# Coverage bilan
pytest --cov=api
```

## 📦 Deployment

### Production sozlamalari
1. `.env` faylida `DEBUG=False` qiling
2. PostgreSQL database sozlang
3. Redis server ishga tushiring
4. Static files yig'ing: `python manage.py collectstatic`
5. WSGI server (Gunicorn) ishga tushiring

### Docker (optional)
```bash
docker-compose up -d
```

## 🔒 Xavfsizlik

- JWT token authentication
- CORS sozlamalari
- Rate limiting
- Input validation
- SQL injection himoyasi
- XSS himoyasi

## 📊 Monitoring

- Sentry integration
- Structured logging
- Performance metrics
- Error tracking

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating
3. O'zgarishlarni commit qiling
4. Pull request yuboring

## 📄 License

Bu loyiha MetOneX kompaniyasi uchun maxsus yaratilgan.

## 📞 Support

Savollar uchun: support@metonex.com
