# MetOneX Marketplace

Full-stack marketplace application built with Django and React.

## Features

- User authentication and authorization
- Company management
- Item catalog with categories
- Request and offer system
- Order management
- Rating and review system
- Real-time notifications
- File upload and management

## Tech Stack

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- Gunicorn

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios

## Installation

### Backend Setup

1. Create virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run development server:
```bash
npm run dev
```

## Deployment

### Server Requirements
- Ubuntu 22.04
- Python 3.11
- Node.js 20+
- PostgreSQL 14+
- Redis 6+
- Nginx

### Deployment Steps

1. Clone repository:
```bash
git clone <repository-url>
cd metone_marketplace
```

2. Run deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

3. Configure Nginx:
```bash
sudo cp nginx-metonex.conf /etc/nginx/sites-available/metonex
sudo ln -sf /etc/nginx/sites-available/metonex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## API Documentation

API documentation is available at `/api/docs/` when running the development server.

## Database Access

### Local Development
- Use Django admin panel at `/admin/`
- Or connect with pgAdmin using local PostgreSQL

### Production

#### Backend (PythonAnywhere)
- URL: https://metonex.pythonanywhere.com
- Database: SQLite3 (free account)
- Admin: https://metonex.pythonanywhere.com/metone/

#### Frontend (DigitalOcean)
- URL: http://178.128.177.129
- Server: Ubuntu 22.04 LTS
- Web Server: Nginx

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
