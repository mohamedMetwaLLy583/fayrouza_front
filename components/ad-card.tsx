'use client';

import { useRouter } from 'next/navigation';
import { Heart, Share2, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/components/toast-notification';
import { useI18n } from '@/lib/i18n/context';
import Image from 'next/image';

import { Ad } from '@/api/home.api';

interface AdCardProps {
  ad: Ad;
  onClick?: (adId: string) => void;
  onFavoriteClick?: (adId: string, isFavorited: boolean) => void;
  onShareClick?: (ad: Ad) => void;
}

export function AdCard({ ad, onClick, onFavoriteClick, onShareClick }: AdCardProps) {
  const router = useRouter();
  const { t } = useI18n();
  // استخدام حالة المفضلة من البيانات الواردة من API
  const [isFavorited, setIsFavorited] = useState(() => ad.is_favourited || false);
  const { showToast, ToastContainer } = useToast();
  const { toggleFavorite, isLoading: favoriteLoading, isAuthenticated, showLoginPrompt } = useFavorites({ showToast });

  const handleClick = () => {
    if (onClick) {
      onClick(ad.id);
    } else {
      router.push(`/ads/${ad.id}`);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // منع تفعيل النقر على الكارد

    if (favoriteLoading) return; // منع النقر المتكرر أثناء التحميل

    // التحقق من المصادقة أولاً
    if (!isAuthenticated) {
      showLoginPrompt();
      return;
    }

    const newFavoriteState = !isFavorited;

    if (onFavoriteClick) {
      // استخدام الدالة المخصصة إذا تم تمريرها
      onFavoriteClick(ad.id, newFavoriteState);
      setIsFavorited(newFavoriteState);
    } else {
      // استخدام hook المفضلة الافتراضي
      const result = await toggleFavorite(ad.id, newFavoriteState);
      setIsFavorited(result.newState);

      // يمكن إضافة منطق إضافي هنا للتعامل مع معلومات الفئة
      if (result.success && result.categoryInfo) {
        console.log(`📁 الفئة: ${result.categoryInfo.name}`);
        console.log(`📊 عدد الإعلانات: ${result.categoryInfo.adsCount}`);
        console.log(`🆕 فئة جديدة: ${result.categoryInfo.categoryAdded ? 'نعم' : 'لا'}`);
      }
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // منع تفعيل النقر على الكارد

    if (onShareClick) {
      onShareClick(ad);
    } else {
      // منطق افتراضي للمشاركة
      const shareUrl = `${window.location.origin}/ads/${ad.id}`;
      const shareText = `${ad.title} - ${ad.price !== "0.00" ? ad.price + ' ' + t('adCardSAR') : t('adCardUndefinedPrice')}`;

      if (navigator.share) {
        // استخدام Web Share API إذا كان متاحاً
        navigator.share({
          title: ad.title,
          text: shareText,
          url: shareUrl,
        }).catch(console.error);
      } else {
        // نسخ الرابط إلى الحافظة
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert(t('adCardCopyLink'));
        }).catch(() => {
          // fallback للمتصفحات القديمة
          prompt(t('adCardCopyLinkPrompt'), shareUrl);
        });
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex flex-col h-full bg-white border ${ad.is_premium ? "border-[#FFBB37]/30 bg-[#FFBB37]/[0.02]" : "border-gray-50"} rounded-[20px] overflow-hidden hover:shadow-[0px_10px_30px_rgba(0,0,0,0.06)] hover:border-[#3F51B5]/20 transition-all duration-500 cursor-pointer relative`}
    >
      {/* Image Section */}      
      <div className="relative w-full h-[220px] shrink-0 overflow-hidden">
        {ad.image && ad.image.length > 0 ? (
          <img
            src={ad.image[0]}
            alt={ad.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-[#F8F9FE] flex items-center justify-center">
            <Image src="/Logo.png" alt="test" width={60} height={60} className="opacity-10 grayscale" />
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {ad.is_premium && (
            <span className="bg-[#FFBB37] text-white text-[10px] font-black px-3.5 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
              {t('adCardPremium')}
            </span>
          )}
          <span className="bg-white/95 backdrop-blur-md text-[#3F51B5] text-[10px] font-black px-3.5 py-1.5 rounded-full shadow-md">
            {ad.category_name || t('adDetailsTableCategory')}
          </span>
        </div>

        {/* Favorite & Share Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavoriteClick}
            disabled={favoriteLoading || !isAuthenticated}
            className={`p-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-90 ${isFavorited
              ? "bg-[#FF4B4B] text-white"
              : "bg-white/95 text-gray-500 hover:text-[#FF4B4B]"
              }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleShareClick}
            className="p-2.5 rounded-xl bg-white/95 text-gray-500 hover:bg-white hover:text-[#3F51B5] transition-all duration-300 shadow-lg"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Price & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="text-[20px] font-black text-[#3F51B5] tracking-tight flex items-center gap-2">
               <span className="text-sm text-gray-400 font-bold">
                 {ad.category_name?.includes('وظائف') || ad.category_name?.includes('Jobs') || ad.category_name?.includes('job') ? 'الراتب: ' : 'السعر: '}
               </span>
               {ad.price && ad.price !== "0.00" && ad.price !== "0" ? (
                 <>
                   {ad.price} <span className="text-xs font-bold opacity-70">{t('adCardSAR')}</span>
                 </>
               ) : (
                 <span className="text-sm text-[#FFBB37]">غير محدد</span>
               )}
            </div>
          </div>
          <h4 className="text-[17px] font-extrabold text-gray-900 leading-tight group-hover:text-[#3F51B5] transition-colors line-clamp-1">
            {ad.title}
          </h4>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-2 font-medium">
          {ad.description}
        </p>

        {/* Metadata */}
        <div className="mt-auto flex flex-wrap items-center gap-y-2 gap-x-4 text-[12px] text-gray-400 font-bold border-t border-gray-50 pt-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#3F51B5]/40" />
            <span className="truncate max-w-[100px]">{ad.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#3F51B5]/40" />
            <span>
              {(() => {
                const createdAt = new Date(ad.created_at);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - createdAt.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 0) return t('adCardToday');
                if (diffDays === 1) return t('adCardOneDayAgo');
                return t('adCardDaysAgo', { days: diffDays });
              })()}
            </span>
          </div>
        </div>

        {/* Author Footer */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src="/Logo.png"
              alt={ad.author_name}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[13px] font-bold text-gray-700 truncate">{ad.author_name}</span>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}