# DigitalOcean Frontend Setup Guide

## 1. Droplet yaratish
- Ubuntu 22.04 LTS
- Basic plan ($6/month)
- SSH key qo'shish

## 2. Server sozlash
```bash
# Serverga ulanish
ssh root@178.128.177.129

# System update
apt update && apt upgrade -y

# Nginx o'rnatish
apt install nginx -y

# Node.js o'rnatish
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install nodejs -y

# Git o'rnatish
apt install git -y
```

## 3. Frontend yuklash
```bash
# Papka yaratish
mkdir -p /var/www/metonex
cd /var/www/metonex

# Code clone qilish
git clone https://github.com/abdulazizDevop/metonex-marketplace.git .

# Frontend build qilish
cd frontend
npm install
npm run build

# Nginx uchun ruxsat berish
chown -R www-data:www-data /var/www/metonex
chmod -R 755 /var/www/metonex
```

## 4. Nginx sozlash
```bash
# Nginx konfiguratsiyasini nusxalash
cp nginx-frontend.conf /etc/nginx/sites-available/metonex
ln -s /etc/nginx/sites-available/metonex /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Nginx test va restart
nginx -t
systemctl restart nginx
systemctl enable nginx
```

## 5. SSL sertifikat (Let's Encrypt)
```bash
# Certbot o'rnatish
apt install certbot python3-certbot-nginx -y

# SSL sertifikat olish
certbot --nginx -d metonex.uz -d www.metonex.uz

# Auto-renewal
crontab -e
# Qo'shish: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 6. Firewall sozlash
```bash
# UFW o'rnatish
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## 7. Auto-deploy script
```bash
# Deploy script yaratish
nano /var/www/metonex/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/metonex
git pull origin main
cd frontend
npm install
npm run build
systemctl reload nginx
echo "Deployment completed!"
```

```bash
# Script'ga ruxsat berish
chmod +x /var/www/metonex/deploy.sh
```
