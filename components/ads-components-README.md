# كومبوننتات الإعلانات مع API المفضلة والمشاركة

تم إنشاء نظام متكامل لإدارة الإعلانات مع دعم API المفضلة الحقيقي والمشاركة:

## 1. AdCard - كارد الإعلان

كومبوننت لعرض إعلان واحد في شكل كارد مع أيقونات المفضلة والمشاركة.

### الخصائص (Props):
- `ad`: بيانات الإعلان (مطلوب)
- `onClick`: دالة مخصصة للنقر (اختياري)
- `onFavoriteClick`: دالة للتعامل مع المفضلة (اختياري - إذا لم تُمرر سيستخدم API الافتراضي)
- `onShareClick`: دالة للتعامل مع المشاركة (اختياري)

### مثال الاستخدام:

#### استخدام بسيط مع API المفضلة الافتراضي:
```tsx
import { AdCard } from '@/components/ad-card';

const ad = {
  id: "123",
  title: "شقة للإيجار",
  description: "شقة مفروشة 3 غرف",
  image: ["/image.jpg"],
  address: "الرياض",
  price: "2500.00",
  author_name: "أحمد محمد",
  created_at: "2024-01-15T10:30:00Z",
  is_premium: true,
  is_favourited: false
};

// سيستخدم API المفضلة الافتراضي تلقائياً
<AdCard ad={ad} />
```

#### استخدام مع معالج مفضلة مخصص:
```tsx
import { useFavorites } from '@/hooks/use-favorites';

const { toggleFavorite, isLoading } = useFavorites();

const handleCustomFavorite = async (adId, isFavorited) => {
  // منطق إضافي قبل API call
  console.log('معالج مخصص للمفضلة');
  
  const result = await toggleFavorite(adId, isFavorited);
  
  if (result === isFavorited) {
    // منطق إضافي بعد نجاح العملية
    showSuccessToast('تم تحديث المفضلة');
  }
};

<AdCard 
  ad={ad} 
  onFavoriteClick={handleCustomFavorite}
/>
```

## 2. AdsSection - سكشن الإعلانات

كومبوننت لعرض مجموعة من الإعلانات مقسمة حسب الفئات مع دعم المفضلة والمشاركة.

### الخصائص (Props):
- `homeAds`: مصفوفة من فئات الإعلانات (مطلوب)
- `title`: عنوان السكشن (افتراضي: "الإعلانات المميزة")
- `onAdClick`: دالة مخصصة للنقر على الإعلان (اختياري)
- `onFavoriteClick`: دالة للتعامل مع المفضلة (اختياري)
- `onShareClick`: دالة للتعامل مع المشاركة (اختياري)
- `showCategoryHeaders`: إظهار عناوين الفئات (افتراضي: true)
- `useSlider`: استخدام الـ Slider بدلاً من Grid (افتراضي: false)
- `slidesPerView`: عدد الشرائح المرئية في الـ Slider (افتراضي: 4)
- `spaceBetween`: المسافة بين الشرائح (افتراضي: 20)

### أمثلة الاستخدام:

#### الاستخدام الأساسي:
```tsx
import { AdsSection } from '@/components/ads-section';

<AdsSection homeAds={homeAdsData} />
```

#### مع معالجات مخصصة:
```tsx
const handleFavorite = (adId, isFavorited) => {
  // API call لحفظ المفضلة
  favoriteApi.toggleFavorite(adId, isFavorited);
};

const handleShare = (ad) => {
  // منطق مشاركة مخصص
  shareToSocialMedia(ad);
};

<AdsSection 
  homeAds={adsData}
  title="إعلانات مختارة"
  showCategoryHeaders={false}
  useSlider={true}
  slidesPerView={3}
  onAdClick={(adId) => router.push(`/ads/${adId}`)}
  onFavoriteClick={handleFavorite}
  onShareClick={handleShare}
/>
```

## 3. useFavorites Hook - إدارة المفضلة

Hook مخصص لإدارة عمليات المفضلة مع API الخلفي.

### الاستخدام:
```tsx
import { useFavorites } from '@/hooks/use-favorites';

const { toggleFavorite, isLoading, error } = useFavorites();

// استخدام في معالج الأحداث
const handleFavorite = async (adId, newState) => {
  const result = await toggleFavorite(adId, newState);
  // result يحتوي على الحالة الجديدة للمفضلة
};
```

### الخصائص المُرجعة:
- `toggleFavorite(adId, newState)`: دالة لتبديل حالة المفضلة
  - ترجع: `{ success, newState, categoryInfo? }`
- `isLoading`: حالة التحميل
- `error`: رسالة الخطأ إن وجدت
- `isAuthenticated`: حالة المصادقة
- `showLoginPrompt`: دالة لعرض رسالة تسجيل الدخول

## 🔧 معالجة الأخطاء والمصادقة:

### خطأ 403 - غير مصرح:
```
❌ Request failed with status code 403
```

**الأسباب المحتملة:**
- المستخدم غير مسجل دخول
- التوكن غير موجود في localStorage
- التوكن منتهي الصلاحية
- التوكن غير صحيح

**الحلول المطبقة:**
```tsx
// التحقق من المصادقة قبل API call
const isAuthenticated = !!localStorage.getItem('authToken');

if (!isAuthenticated) {
  showLoginPrompt(); // يعرض رسالة ويوجه للتسجيل
  return;
}
```

### معالجة الأخطاء التلقائية:
- **403/401**: إزالة التوكن + توجيه لتسجيل الدخول
- **خطأ شبكة**: رسالة خطأ واضحة
- **خطأ غير معروف**: رسالة عامة مع تفاصيل في console

### اختبار المفضلة:
```tsx
import { TestFavorites } from '@/components/test-favorites';

// كومبوننت لاختبار المفضلة مع محاكاة تسجيل الدخول
<TestFavorites />
```

## 4. API المفضلة

### Endpoint:
```
POST /ads/favourites
Body: { "ad_id": "123" }
Headers: { "Authorization": "Bearer <token>" }
```

### استجابة النجاح:
```json
{
  "success": true,
  "message": "Favourite stored",
  "data": {
    "ad_id": "2992",
    "category_added": true,
    "category": {
      "id": 1755,
      "name": "Cars for Rent",
      "slug": "cars-for-rent"
    },
    "ads_count_in_category": 1
  }
}
```

### في الكود:
```tsx
import { adsApi } from '@/api/ads.api';

// استدعاء مباشر للAPI
const response = await adsApi.toggleFavorite(adId);

if (response.success) {
  console.log(response.message); // "Favourite stored"
  console.log(response.data.category.name); // "Cars for Rent"
  console.log(response.data.ads_count_in_category); // 1
}
```

### معلومات الاستجابة:
- `success`: حالة نجاح العملية
- `message`: رسالة النجاح من الخادم
- `data.category_added`: هل تم إنشاء فئة جديدة
- `data.category.name`: اسم الفئة
- `data.ads_count_in_category`: عدد الإعلانات في الفئة

### متطلبات المصادقة:
- يجب وجود `authToken` في localStorage
- التوكن يُرسل تلقائياً في header Authorization
- في حالة عدم وجود توكن: رسالة تطلب تسجيل الدخول

## الميزات الجديدة:

### 🤍 أيقونة المفضلة مع API حقيقي:
- تظهر في الزاوية العلوية اليسرى من الكارد
- **تتصل بـ API الخلفي** عبر `/ads/favourites`
- تتغير لونها عند الإضافة/الإزالة (أحمر = مفضل، رمادي = غير مفضل)
- تدعم الحالة الافتراضية من `is_favourited`
- **حالة تحميل** مع منع النقر المتكرر
- **معالجة الأخطاء** التلقائية
- منطق افتراضي ذكي مع إمكانية التخصيص

### 📤 أيقونة المشاركة:
- تظهر بجانب أيقونة المفضلة
- تدعم Web Share API للأجهزة المحمولة
- نسخ الرابط للحافظة كبديل
- منطق مشاركة مخصص قابل للتخصيص

### 🎯 التفاعل الذكي:
- منع تفعيل النقر على الكارد عند النقر على الأيقونات
- تأثيرات بصرية عند التمرير والنقر
- دعم tooltips للأيقونات

## أحجام الشبكة:

- `sm`: عمودين كحد أقصى
- `md`: 3 أعمدة كحد أقصى  
- `lg`: 4 أعمدة كحد أقصى (افتراضي)

## المميزات:

✅ قابل لإعادة الاستخدام في أي مكان  
✅ يدعم الإعلانات المميزة  
✅ **API المفضلة الحقيقي مع `/ads/favourites`**  
✅ **Hook مخصص لإدارة المفضلة**  
✅ **حالات تحميل ومعالجة أخطاء**  
✅ أيقونات المفضلة والمشاركة  
✅ منطق افتراضي ذكي للمشاركة  
✅ دعم Web Share API  
✅ تصميم متجاوب  
✅ معالجة النقر المخصصة  
✅ عرض مرن للشبكة  
✅ دعم RTL  
✅ معالجة الحالات الفارغة  

## الاستخدام في المشروع:

تم استخدام هذه الكومبوننتات في:
- صفحة الهوم (`app/home/page.tsx`) - مع API المفضلة الافتراضي
- يمكن استخدامها في صفحات الفئات
- يمكن استخدامها في صفحات البحث
- يمكن استخدامها في صفحة المفضلة
- يمكن استخدامها في أي مكان يحتاج عرض إعلانات

## الملفات المُنشأة:

- `components/ad-card.tsx` - كومبوننت كارد الإعلان
- `components/ads-section.tsx` - كومبوننت سكشن الإعلانات
- `hooks/use-favorites.ts` - Hook إدارة المفضلة
- `api/ads.api.ts` - API المفضلة (تم التحديث)
- `components/ads-examples.tsx` - أمثلة الاستخدام