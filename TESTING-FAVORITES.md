# اختبار وظيفة المفضلة

## المشكلة الحالية:
```
❌ Request failed with status code 403
```

## الحلول المطبقة:

### 1. تحسين تسجيل الطلبات (Logging)
- تسجيل التوكن في كل طلب
- تسجيل headers الصادرة والواردة
- تسجيل تفاصيل الأخطاء

### 2. التحقق من التوكن
```javascript
// في axios-instance.ts
const token = localStorage.getItem('authToken');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
  console.log('🔑 Token added to request:', `${token.substring(0, 20)}...`);
}
```

### 3. كومبوننت الاختبار
استخدم `<TestFavorites />` للاختبار:

#### خيارات تسجيل الدخول:
1. **تسجيل دخول حقيقي**: يستدعي API تسجيل الدخول
2. **إدخال توكن يدوي**: لإدخال توكن صحيح مباشرة

### 4. خطوات الاختبار:

#### الطريقة الأولى - توكن حقيقي:
1. اذهب لصفحة تسجيل الدخول في المتصفح
2. سجل دخول بحساب صحيح
3. افتح Developer Tools → Application → Local Storage
4. انسخ قيمة `authToken`
5. استخدم "إدخال توكن يدوي" في كومبوننت الاختبار

#### الطريقة الثانية - API تسجيل الدخول:
1. استخدم "تسجيل دخول حقيقي"
2. أدخل بيانات حساب صحيح
3. سيتم الحصول على التوكن تلقائياً

### 5. مراقبة الطلبات:
افتح Console وراقب الرسائل:
```
🔑 Token added to request: eyJ0eXAiOiJKV1QiLCJh...
📤 Outgoing Request: { method: 'POST', url: '/ads/favourites', ... }
📥 Incoming Response: { status: 200, data: {...} }
```

### 6. الأخطاء المحتملة:

#### 403 Forbidden:
- التوكن غير صحيح
- التوكن منتهي الصلاحية
- المستخدم غير مصرح له

#### 401 Unauthorized:
- لا يوجد توكن
- التوكن بتنسيق خاطئ

### 7. التحقق من التوكن:
```javascript
// في utils/auth-helper.ts
const isValid = await validateToken(token);
```

## الاستخدام:

```tsx
import { TestFavorites } from '@/components/test-favorites';

// في أي صفحة
<TestFavorites />
```

## ملاحظات مهمة:

1. **تأكد من وجود حساب صحيح** في النظام
2. **استخدم بيانات تسجيل دخول صحيحة**
3. **راقب Console للتفاصيل**
4. **التوكن يُحفظ في localStorage تلقائياً**

## إذا استمر الخطأ 403:

1. تحقق من أن API endpoint صحيح: `/ads/favourites`
2. تحقق من أن الحساب له صلاحية إضافة للمفضلة
3. تحقق من أن التوكن لم تنته صلاحيته
4. تواصل مع مطور الـ Backend للتأكد من الصلاحيات