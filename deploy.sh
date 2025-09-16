#!/bin/bash

echo "🚀 MetOneX Frontend Deployment Starting..."

# Frontend build
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Nginx reload
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend is now live at: http://178.128.177.129"
