import { useState } from 'react';
import { adsApi } from '@/api/ads.api';

interface UseFavoritesReturn {
  toggleFavorite: (adId: string, currentState: boolean) => Promise<{
    success: boolean;
    newState: boolean;
    categoryInfo?: {
      name: string;
      adsCount: number;
      categoryAdded: boolean;
    };
  }>;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  showLoginPrompt: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface UseFavoritesOptions {
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function useFavorites(options?: UseFavoritesOptions): UseFavoritesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = options || {};

  // Check if user is authenticated
  const isAuthenticated = typeof window !== 'undefined' && 
    typeof localStorage !== 'undefined' && 
    !!localStorage.getItem('authToken');

  const showLoginPrompt = () => {
    const message = 'يجب تسجيل الدخول أولاً لإضافة الإعلانات للمفضلة. هل تريد الانتقال لصفحة تسجيل الدخول؟';
    
    if (showToast) {
      showToast('يجب تسجيل الدخول أولاً للمفضلة', 'error');
    }
    
    const shouldRedirect = confirm(message);
    if (shouldRedirect && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const toggleFavorite = async (adId: string, currentState: boolean): Promise<{
    success: boolean;
    newState: boolean;
    categoryInfo?: {
      name: string;
      adsCount: number;
      categoryAdded: boolean;
    };
  }> => {
    // Check authentication first
    if (!isAuthenticated) {
      console.warn('⚠️ المستخدم غير مسجل دخول - لا يمكن إضافة للمفضلة');
      setError('يجب تسجيل الدخول أولاً لإضافة الإعلانات للمفضلة');
      showLoginPrompt();
      return { success: false, newState: !currentState }; // إرجاع الحالة السابقة
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`=== محاولة ${currentState ? 'إضافة' : 'إزالة'} الإعلان ${adId} ${currentState ? 'إلى' : 'من'} المفضلة ===`);
      
      const response = await adsApi.toggleFavorite(adId);
      
      if (response.success) {
        // استخدام رسالة النجاح من API
        const successMessage = response.message || `تم ${currentState ? 'إضافة' : 'إزالة'} الإعلان ${currentState ? 'إلى' : 'من'} المفضلة بنجاح`;
        
        // إضافة معلومات إضافية عن الفئة إذا تم إضافتها
        let detailedMessage = successMessage;
        if (response.data.category_added && currentState) {
          detailedMessage += ` في فئة "${response.data.category.name}"`;
        }
        
        console.log(`✅ ${detailedMessage}`);
        console.log(`📊 عدد الإعلانات في الفئة: ${response.data.ads_count_in_category}`);
        
        if (showToast) {
          showToast(detailedMessage, 'success');
        }
        
        setIsLoading(false);
        
        return {
          success: true,
          newState: currentState,
          categoryInfo: {
            name: response.data.category.name,
            adsCount: response.data.ads_count_in_category,
            categoryAdded: response.data.category_added
          }
        };
      } else {
        throw new Error(response.message || 'فشل في تحديث المفضلة');
      }
    } catch (error: any) {
      console.error('❌ خطأ في API المفضلة:', error);
      
      let errorMessage = 'حدث خطأ في تحديث المفضلة';
      
      if (error.response?.status === 403) {
        errorMessage = 'غير مصرح لك بهذا الإجراء. قد تحتاج لتسجيل الدخول مرة أخرى';
        
        // عرض تفاصيل إضافية للخطأ 403
        console.error('تفاصيل خطأ 403:', {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
          responseData: error.response?.data
        });
        
      } else if (error.response?.status === 401) {
        errorMessage = 'انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى';
        // إزالة التوكن المنتهي الصلاحية
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        showLoginPrompt();
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      if (showToast) {
        showToast(errorMessage, 'error');
      }
      
      setIsLoading(false);
      
      // إرجاع الحالة السابقة في حالة الخطأ
      return { success: false, newState: !currentState };
    }
  };

  return {
    toggleFavorite,
    isLoading,
    error,
    isAuthenticated,
    showLoginPrompt,
    showToast
  };
}