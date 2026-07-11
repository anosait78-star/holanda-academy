# دليل إعداد أكاديمية هولندا

## 1. إعداد Supabase

### أ) إنشاء مشروع جديد
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروعاً جديداً
3. انتظر حتى يكتمل الإعداد

### ب) تشغيل قاعدة البيانات
1. افتح **SQL Editor** في لوحة Supabase
2. انسخ محتوى ملف `supabase/schema.sql`
3. الصقه في المحرر واضغط **Run**

### ج) إنشاء Storage Buckets
في **Storage** > **New Bucket**، أنشئ هذه الحاويات (كلها **Public**):
- `logos`
- `hero-videos`
- `programs`
- `coaches`
- `gallery`
- `news`

### د) إنشاء حساب Admin
1. اذهب إلى **Authentication** > **Users**
2. اضغط **Add User**
3. أدخل البريد وكلمة المرور للمسؤول

## 2. إعداد متغيرات البيئة

افتح ملف `.env.local` وضع بيانات مشروعك:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxx...
```

تجد هذه القيم في: **Project Settings** > **API**

## 3. تشغيل المشروع محلياً

```bash
npm install
npm run dev
```

افتح المتصفح على: http://localhost:3000

## 4. النشر على Vercel

```bash
npm i -g vercel
vercel
```

أو اربط المشروع بـ GitHub وانشره تلقائياً من Vercel Dashboard.

**أضف متغيرات البيئة في:** Vercel > Settings > Environment Variables

## 5. لوحة التحكم

- رابط تسجيل الدخول: `/admin/login`
- استخدم البريد وكلمة المرور التي أنشأتها في Supabase

## الصفحات العامة

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | `/` |
| البرامج | `/programs` |
| المدربون | `/coaches` |
| المعرض | `/gallery` |
| الأخبار | `/news` |
| التسجيل | `/registration` |
| اتصل بنا | `/contact` |

## لوحة الإدارة

| القسم | الرابط |
|-------|--------|
| تسجيل الدخول | `/admin/login` |
| الرئيسية | `/admin` |
| البرامج | `/admin/programs` |
| المدربون | `/admin/coaches` |
| المعرض | `/admin/gallery` |
| الأخبار | `/admin/news` |
| التسجيلات | `/admin/registrations` |
| الإعدادات | `/admin/settings` |
