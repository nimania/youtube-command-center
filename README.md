# YouTube Command Center

داشبورد شخصی و فارسی تحلیل کانال یوتیوب `@nimaafsharnaderi`؛ ساخته‌شده به‌صورت یک وب‌اپ استاتیک برای GitHub Pages.

## قابلیت‌ها

- نمای کلی بازدید، زمان تماشا، مشترک خالص و میانگین مشاهده
- مقایسهٔ ۷، ۲۸ و ۹۰ روزه
- تحلیل جداگانهٔ Shorts و ویدئوهای بلند
- رتبه‌بندی ویدئوها و سرعت عملکرد ۲۴ ساعت نخست
- مقایسهٔ مجموعه‌های محتوایی مانند «جان کلام» و «صنعت غذا»
- تحلیل منابع ورودی، جغرافیا، دستگاه و مخاطبان بازگشتی
- گزارش مدیریتی فارسی و خروجی چاپ/PDF
- حالت نمایشی کامل پیش از اتصال API
- اتصال مستقیم و خصوصی به YouTube Analytics با OAuth 2.0

## اجرای محلی

این پروژه فرایند build ندارد. یک وب‌سرور ساده کافی است:

```bash
python3 -m http.server 8080
```

سپس `http://localhost:8080` را باز کنید.

## انتشار روی GitHub Pages

1. به `Settings → Pages` بروید.
2. در بخش **Build and deployment**، گزینهٔ **Deploy from a branch** را انتخاب کنید.
3. Branch را روی `main` و پوشه را روی `/ (root)` بگذارید.
4. آدرس نهایی پروژه به شکل زیر خواهد بود:

   `https://nimania.github.io/youtube-command-center/`

## اتصال دادهٔ واقعی یوتیوب

### ۱. ساخت پروژه در Google Cloud

1. یک پروژه در [Google Cloud Console](https://console.cloud.google.com/) بسازید.
2. این دو API را فعال کنید:
   - YouTube Analytics API
   - YouTube Data API v3
3. صفحهٔ OAuth consent را تنظیم کنید.
4. اگر اپ در حالت Testing است، ایمیل مالک کانال را به Test users اضافه کنید.

### ۲. ساخت OAuth Client

1. به `APIs & Services → Credentials` بروید.
2. یک OAuth Client ID از نوع **Web application** بسازید.
3. این Originها را اضافه کنید:

   - `http://localhost:8080`
   - `https://nimania.github.io`

> برای OAuth سمت مرورگر فقط Origin وارد می‌شود؛ مسیر کامل پروژه لازم نیست.

### ۳. ثبت Client ID

مقدار Client ID را در `config.js` قرار دهید:

```js
window.YT_DASHBOARD_CONFIG = {
  googleClientId: "YOUR_CLIENT_ID.apps.googleusercontent.com",
  channelHandle: "@nimaafsharnaderi",
  locale: "fa-IR",
  timezone: "Asia/Tehran"
};
```

Client ID رمز محسوب نمی‌شود و می‌تواند در کد فرانت‌اند دیده شود. این پروژه هیچ Client Secret یا Refresh Token را در مخزن ذخیره نمی‌کند. Access Token فقط در حافظهٔ همان نشست مرورگر استفاده می‌شود.

## حریم خصوصی

- دادهٔ خام YouTube Analytics در GitHub ذخیره نمی‌شود.
- هیچ رمز یا توکن دائمی در کد وجود ندارد.
- دسترسی فقط با حساب گوگلی ممکن است که به کانال مجوز دارد.
- برای قطع دسترسی، نشست مرورگر را ببندید یا مجوز برنامه را از حساب گوگل لغو کنید.

## ساختار پروژه

```text
index.html   رابط و ساختار صفحات
styles.css  طراحی واکنش‌گرا و نسخهٔ چاپ
app.js      دادهٔ نمایشی، تحلیل‌ها، نمودارها و اتصال API
config.js   تنظیمات غیرمحرمانهٔ پروژه
.nojekyll   انتشار مستقیم و بدون Jekyll
```

## وضعیت

نسخهٔ فعلی رابط کامل و Pages-ready است. برای فعال‌شدن دادهٔ واقعی فقط تنظیم Google OAuth و قراردادن Client ID باقی می‌ماند.
