# MetoneX Marketplace Frontend v2

Bu loyiha frontend_v2 papkasidagi HTML va PNG dizayn fayllar asosida yaratilgan zamonaviy React ilovasidir.

## Xususiyatlar

- **React 18** - Zamonaviy React hooklari va komponentlari
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Sahifalar orasida navigatsiya
- **Material Symbols** - Google Material Design ikonlari
- **Responsive Design** - Barcha qurilmalarda ishlaydi
- **Animatsiyalar** - Smooth va professional animatsiyalar

## Dizayn Tizimi

### Ranglar
- **Primary**: `#5E5CE6` (Deep Purple)
- **Secondary**: `#1E90FF` (Blue)
- **Accent**: `#007AFF` (iOS Blue)
- **Success**: `#34C759` (Green)
- **Error**: `#FF3B30` (Red)
- **Gray**: `#8A8A8E` (Silver Gray)

### Fontlar
- **Inter** - Asosiy font oilasi
- **Material Symbols Outlined** - Ikonlar uchun

## Loyiha Tuzilishi

```
frontend_v2/
├── src/
│   ├── components/          # Qayta ishlatiladigan komponentlar
│   │   ├── Layout.jsx      # Asosiy layout
│   │   ├── BuyerLayout.jsx # Buyer uchun layout
│   │   └── BottomNavigation.jsx # Pastki navigatsiya
│   ├── pages/              # Sahifalar
│   │   ├── buyer/          # Buyer sahifalari
│   │   ├── seller/         # Seller sahifalari
│   │   ├── common/         # Umumiy sahifalar
│   │   └── onboarding/     # Onboarding sahifalari
│   ├── App.jsx             # Asosiy App komponenti
│   ├── main.jsx            # Entry point
│   └── index.css           # Global stillar
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind konfiguratsiyasi
└── vite.config.js          # Vite konfiguratsiyasi
```

## O'rnatish

1. Dependencies o'rnating:
```bash
npm install
```

2. Development server ishga tushiring:
```bash
npm run dev
```

3. Production build yarating:
```bash
npm run build
```

## Sahifalar

### Buyer Sahifalari
- `/buyer` - Buyer home screen 1
- `/buyer/home-2` - Buyer home screen 2
- `/buyer/registration` - Buyer ro'yxatdan o'tish
- `/buyer/dashboard-1` - Buyer dashboard 1
- `/buyer/dashboard-2` - Buyer dashboard 2

### Seller Sahifalari
- `/seller` - Seller home screen 1
- `/seller/home-2` - Seller home screen 2
- `/seller/welcome` - Seller welcome sahifasi
- `/seller/profile-1` - Seller profil sahifasi
- `/seller/analytics-summary` - Analytics summary

### Umumiy Sahifalar
- `/payment-confirmed` - To'lov tasdiqlangan
- `/support` - Qo'llab-quvvatlash
- `/offer-acceptance-payment` - Taklif qabul qilingan

## Komponentlar

### Layout Komponentlari
- `Layout` - Asosiy layout (seller uchun)
- `BuyerLayout` - Buyer uchun layout
- `BottomNavigation` - Pastki navigatsiya

### Sahifa Komponentlari
Har bir HTML fayl uchun alohida React komponenti yaratilgan.

## Stil Tizimi

### CSS Classes
- `.btn-primary` - Asosiy tugma
- `.btn-secondary` - Ikkinchi darajali tugma
- `.form-input` - Form input
- `.card` - Karta komponenti
- `.glass` - Shisha effekti

### Animatsiyalar
- `.animate-fade-in` - Fade in animatsiya
- `.animate-slide-up` - Slide up animatsiya
- `.animate-scale-in` - Scale in animatsiya
- `.animate-layered-in` - Layered animatsiya

## Rivojlantirish

### Yangi Sahifa Qo'shish
1. `src/pages/` papkasida yangi komponent yarating
2. `src/App.jsx` da route qo'shing
3. Kerak bo'lsa, yangi stillar qo'shing

### Yangi Komponent Qo'shish
1. `src/components/` papkasida yangi komponent yarating
2. Export qiling va boshqa joylarda ishlating

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License
