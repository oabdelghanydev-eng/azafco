# AZAFCO International - ازافكو العالمية
## موقع شركة ازافكو العالمية للاستثمار والتنمية

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-Private-red)

---

## 📋 نظرة عامة | Overview

موقع رسمي لشركة **ازافكو العالمية للاستثمار والتنمية** - شركة مصرية رائدة متخصصة في تعبئة وتصدير الأسماك الطازجة إلى أكثر من 15 دولة حول العالم منذ عام 2008.

**AZAFCO International** is an Egyptian company specialized in packaging and exporting premium fresh fish to over 15 countries worldwide since 2008.

---

## 🚀 المميزات | Features

- ✅ **دعم ثنائي اللغة** (العربية RTL والإنجليزية LTR)
- ✅ **تصميم متجاوب** يعمل على جميع الأجهزة
- ✅ **SEO محسّن** مع Structured Data (JSON-LD)
- ✅ **رسوم متحركة سلسة** باستخدام Framer Motion
- ✅ **Google Analytics** مدمج
- ✅ **نموذج تواصل** عبر WhatsApp
- ✅ **خريطة Google Maps** تفاعلية

---

## 🛠️ التقنيات المستخدمة | Tech Stack

| التقنية | الوصف |
|---------|-------|
| **Next.js 14** | إطار عمل React للإنتاج |
| **TypeScript** | لغة برمجة مع أنواع ثابتة |
| **Tailwind CSS** | إطار CSS للتصميم السريع |
| **Framer Motion** | مكتبة الرسوم المتحركة |
| **React Icons** | أيقونات متعددة |
| **Swiper** | عروض شرائح متقدمة |

---

## 📁 هيكل المشروع | Project Structure

```
azafco-website/
├── 📂 app/                 # App Router (Next.js 14)
│   ├── [locale]/           # Dynamic locale routing
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx        # Homepage (/ -> /ar or /en)
│   │   ├── products/       # Products page
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── markets/        # Markets page
│   │   ├── media/          # Media page
│   │   ├── certificates/   # Certificates page
│   │   └── not-found.tsx   # 404 page
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
│
├── 📂 components/          # React components
│   ├── Layout.tsx          # Header + Footer
│   ├── ProductCard.tsx     # Product card
│   ├── LanguageSwitcher.tsx# Language toggle
│   ├── BackToTop.tsx       # Back to top button
│   ├── ErrorBoundary.tsx   # Error handling
│   └── GoogleAnalytics.tsx # GA tracking
│
├── 📂 data/                # Static data
│   ├── company.ts          # Company info
│   ├── products.ts         # Products list
│   ├── markets.ts          # Markets/countries
│   ├── certificates.ts     # Certificates
│   └── news.ts             # News items
│
├── 📂 locales/             # Translation files
│   ├── ar.json             # Arabic translations
│   └── en.json             # English translations
│
├── 📂 public/              # Static assets
│   ├── 📂 images/          # Website images
│   ├── 📂 items/           # Product images
│   ├── 📂 flags/           # Country flags (SVG)
│   └── 📂 certificates/    # Certificate images
│
├── i18n.ts                 # next-intl configuration
├── middleware.ts           # Locale routing middleware
├── navigation.ts           # Type-safe navigation
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

---

## ⚡ التشغيل المحلي | Local Development

### المتطلبات الأساسية | Prerequisites

- **Node.js** v18.0.0 أو أحدث
- **npm** v9.0.0 أو أحدث (أو yarn/pnpm)
- **Git**

### خطوات التثبيت | Installation Steps

```bash
# 1. استنساخ المشروع | Clone the repository
git clone https://github.com/YOUR_USERNAME/azafco-website.git
cd azafco-website

# 2. تثبيت التبعيات | Install dependencies
npm install

# 3. إنشاء ملف البيئة | Create environment file
cp .env.example .env.local

# 4. تشغيل خادم التطوير | Start development server
npm run dev
```

الموقع سيعمل على: **http://localhost:3000**

### أوامر أخرى | Other Commands

```bash
# بناء للإنتاج | Build for production
npm run build

# تشغيل نسخة الإنتاج | Start production server
npm start

# فحص الكود | Lint code
npm run lint

# فحص الأنواع | Type check
npx tsc --noEmit
```

---

## 🔐 متغيرات البيئة | Environment Variables

أنشئ ملف `.env.local` في جذر المشروع:

```env
# Google Analytics Measurement ID
NEXT_PUBLIC_GA_ID=G-KKH7RD7SRV

# (اختياري) مفاتيح أخرى
# NEXT_PUBLIC_API_URL=https://api.azafco.com.eg
```

> ⚠️ **تحذير**: لا ترفع ملف `.env.local` على GitHub! هو مضاف تلقائياً في `.gitignore`

---

## 📤 الرفع على GitHub | Push to GitHub

### 1. إنشاء Repository جديد

1. اذهب إلى [github.com/new](https://github.com/new)
2. اسم المشروع: `azafco-website`
3. اختر **Private** (خاص)
4. **لا تضف** README أو .gitignore (لأنهم موجودين)
5. اضغط **Create repository**

### 2. رفع الكود

```bash
# تهيئة Git (إذا لم يكن مُهيأ)
git init

# إضافة جميع الملفات
git add .

# إنشاء أول commit
git commit -m "🎉 Initial commit: AZAFCO International Website"

# إضافة الـ remote
git remote add origin https://github.com/YOUR_USERNAME/azafco-website.git

# الرفع على الفرع الرئيسي
git push -u origin main
```

### 3. تحديثات مستقبلية

```bash
# إضافة التغييرات
git add .

# إنشاء commit
git commit -m "✨ وصف التغيير"

# الرفع
git push
```

### أنماط رسائل Commit الموصى بها

| الرمز | المعنى | مثال |
|-------|--------|------|
| ✨ | ميزة جديدة | `✨ Add language switcher` |
| 🐛 | إصلاح خطأ | `🐛 Fix mobile menu` |
| 💄 | تحسين UI | `💄 Update footer design` |
| 📝 | توثيق | `📝 Add README` |
| ♻️ | إعادة هيكلة | `♻️ Refactor data files` |
| 🚀 | نشر | `🚀 Deploy v1.0.0` |

---

## 🌐 النشر على Vercel | Deploy to Vercel

### الطريقة 1: النشر التلقائي (الموصى بها)

1. اذهب إلى [vercel.com](https://vercel.com) وسجل دخول بـ GitHub
2. اضغط **"Add New Project"**
3. اختر repository `azafco-website`
4. **إعدادات المشروع:**
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **أضف متغيرات البيئة:**
   - `NEXT_PUBLIC_GA_ID` = `G-KKH7RD7SRV`
6. اضغط **Deploy**

✅ كل push على `main` سينشر تلقائياً!

### الطريقة 2: Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر (preview)
vercel

# النشر للإنتاج
vercel --prod
```

### إعدادات الدومين المخصص | Custom Domain

1. في Vercel Dashboard → Settings → Domains
2. أضف: `azafco.com.eg`
3. أضف: `www.azafco.com.eg`
4. غيّر DNS records عند مزود الدومين:
   ```
   Type: A     Name: @    Value: 76.76.21.21
   Type: CNAME Name: www  Value: cname.vercel-dns.com
   ```

---

## 📊 Google Analytics

التتبع مُفعّل باستخدام **Google Analytics 4**.

- **Measurement ID**: `G-KKH7RD7SRV`
- **لوحة التحكم**: [analytics.google.com](https://analytics.google.com)

### الأحداث المتتبعة تلقائياً:
- Page Views
- Scroll Depth
- Outbound Links
- Site Search

---

## 🔧 الصيانة والتحديثات | Maintenance

### تحديث المنتجات
```typescript
// data/products.ts
export const products = [
  {
    id: 1,
    name: 'اسم المنتج بالعربي',
    nameEn: 'Product Name in English',
    category: 'river' | 'sea',
    image: '/items/product.jpg',
    // ...
  }
]
```

### تحديث الأسواق
```typescript
// data/markets.ts
export const markets = [
  {
    id: 1,
    country: 'الإمارات',
    countryEn: 'UAE',
    flag: '/flags/ae.svg',
    // ...
  }
]
```

### تحديث معلومات الشركة
```typescript
// data/company.ts
export const companyInfo = {
  contact: {
    phone: { display: '+20 100 751 4567', link: 'tel:+201007514567' },
    email: { display: 'business@azafco.com.eg', link: 'mailto:business@azafco.com.eg' },
    // ...
  }
}
```

### إضافة ترجمة جديدة | Adding Translations
```json
// locales/ar.json
{
  "nav": {
    "home": "الرئيسية",
    "products": "المنتجات"
  },
  "new_key": "القيمة بالعربي"
}

// locales/en.json
{
  "nav": {
    "home": "Home",
    "products": "Products"
  },
  "new_key": "English value"
}
```

### إضافة لغة جديدة | Adding New Language
```typescript
// 1. Add locale to i18n.ts
export const locales = ['ar', 'en', 'fr'] as const;
export const localeConfig = {
  // ...existing locales...
  fr: { name: 'French', dir: 'ltr', nativeName: 'Français' },
};

// 2. Create locales/fr.json with translations
```

---

## 🐛 استكشاف الأخطاء | Troubleshooting

### مشكلة: الصفحة لا تُحدّث بعد التعديل
```bash
# حذف الكاش وإعادة التشغيل
rm -rf .next
npm run dev
```

### مشكلة: خطأ في TypeScript
```bash
# فحص الأخطاء
npx tsc --noEmit

# تحديث الأنواع
npm install @types/react@latest @types/node@latest
```

### مشكلة: الصور لا تظهر
- تأكد أن الصور في مجلد `public/`
- استخدم مسارات تبدأ بـ `/` مثل `/images/logo.svg`

### مشكلة: RTL لا يعمل
- تأكد أن `dir={dir}` موجود في Layout
- تأكد أن `useI18n()` يُستخدم بشكل صحيح

---

## 📞 معلومات الاتصال | Contact Info

| | القيمة |
|---|--------|
| **الموقع** | [azafco.com.eg](https://azafco.com.eg) |
| **البريد** | business@azafco.com.eg |
| **الهاتف** | +20 100 751 4567 |
| **واتساب** | +20 100 751 4567 |
| **فيسبوك** | [AZAFCO](https://www.facebook.com/profile.php?id=100063620366349) |

---

## 📄 الترخيص | License

هذا المشروع **خاص** ومملوك لشركة ازافكو العالمية للاستثمار والتنمية.  
جميع الحقوق محفوظة © 2024

---

<div align="center">

**صُنع بـ ❤️ في مصر 🇪🇬**

</div>
