// مساعد للحصول على توكن تسجيل الدخول للاختبار

export const getTestAuthToken = async (email: string, password: string): Promise<string | null> => {
  try {
    console.log('🔐 محاولة تسجيل الدخول للحصول على توكن...');
    
    const response = await fetch('https://fayrouza.sdevelopment.tech/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();
    
    console.log('📥 استجابة تسجيل الدخول:', data);

    if (response.ok && data.token) {
      console.log('✅ تم الحصول على التوكن بنجاح');
      return data.token;
    } else {
      console.error('❌ فشل في تسجيل الدخول:', data.message || 'خطأ غير معروف');
      return null;
    }
  } catch (error) {
    console.error('❌ خطأ في طلب تسجيل الدخول:', error);
    return null;
  }
};

// دالة للتحقق من صحة التوكن
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    console.log('🔍 التحقق من صحة التوكن...');
    
    const response = await fetch('https://fayrouza.sdevelopment.tech/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const isValid = response.ok;
    console.log(isValid ? '✅ التوكن صحيح' : '❌ التوكن غير صحيح');
    
    return isValid;
  } catch (error) {
    console.error('❌ خطأ في التحقق من التوكن:', error);
    return false;
  }
};

// بيانات تجريبية للاختبار (يجب تغييرها)
export const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};