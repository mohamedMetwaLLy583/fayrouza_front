'use client';

import { useRouter } from 'next/navigation';
import { Heart, Share2, MapPin, Clock, Eye, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/components/toast-notification';
import { useI18n } from '@/lib/i18n/context';
import Image from 'next/image';
import { Button } from './ui/button';

interface Ad {
  id: string;
  title: string;
  description: string;
  image: string[];
  ad_type: string | null;
  address: string;
  category_name: string;
  author_name: string;
  author_image?: string;
  price: string;
  created_at: string;
  is_premium?: boolean;
  views?: number;
  is_favourited?: boolean;
  type?: number;
}

interface AdCardHorizontalProps {
  ad: Ad;
  onClick?: (adId: string) => void;
  onFavoriteClick?: (adId: string, isFavorited: boolean) => void;
  onShareClick?: (ad: Ad) => void;
}

export function AdCardHorizontal({ ad, onClick, onFavoriteClick, onShareClick }: AdCardHorizontalProps) {
  const router = useRouter();
  const { t, dir, language } = useI18n();
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
    e.stopPropagation();
    if (favoriteLoading) return;
    if (!isAuthenticated) {
      showLoginPrompt();
      return;
    }
    const newFavoriteState = !isFavorited;
    if (onFavoriteClick) {
      onFavoriteClick(ad.id, newFavoriteState);
      setIsFavorited(newFavoriteState);
    } else {
      const result = await toggleFavorite(ad.id, newFavoriteState);
      setIsFavorited(result.newState);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShareClick) {
      onShareClick(ad);
    } else {
      const shareUrl = `${window.location.origin}/ads/${ad.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast(t('adCardCopyLink'), 'success');
      }).catch(() => {
        prompt(t('adCardCopyLinkPrompt'), shareUrl);
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const createdAt = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('adCardToday');
    if (diffDays === 1) return t('adCardOneDayAgo');
    return t('adCardDaysAgo', { days: diffDays });
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex flex-col md:flex-row bg-white border ${ad.is_premium ? 'border-[#FFBB37]/30 bg-[#FFBB37]/[0.02]' : 'border-gray-100'} rounded-[20px] overflow-hidden hover:shadow-[0px_10px_25px_rgba(0,0,0,0.06)] hover:border-[#3F51B5]/20 transition-all duration-500 cursor-pointer mb-5`}
      dir={dir}
    >
      {/* Image Section */}
      <div className="relative w-full md:w-[280px] h-[220px] flex-shrink-0 overflow-hidden">
        {ad.image && ad.image.length > 0 ? (
          <Image
            src={ad.image[0]}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-[#F8F9FE] flex items-center justify-center">
            <Image src="/Logo.png" alt="Placeholder" width={60} height={60} className="opacity-10 grayscale" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {ad.is_premium && (
            <span className="bg-[#FFBB37] text-white text-[10px] sm:text-[11px] font-black px-4 py-1.5 rounded-full shadow-[0px_4px_10px_rgba(255,187,55,0.3)] uppercase tracking-wider">
              {t('adCardPremium')}
            </span>
          )}
          <span className="bg-white/95 backdrop-blur-md text-[#3F51B5] text-[10px] sm:text-[11px] font-black px-4 py-1.5 rounded-full shadow-[0px_4px_10px_rgba(0,0,0,0.05)]">
            {ad.category_name}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute bottom-4 right-4 p-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-90 ${isFavorited ? 'bg-[#FF4B4B] text-white' : 'bg-white/90 text-gray-500 hover:text-[#FF4B4B]'
            }`}
        >
          <Heart className={`w-4.5 h-4.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-grow p-6 flex flex-col justify-between">
        <div className="relative">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-[20px] font-extrabold text-gray-900 leading-tight group-hover:text-[#3F51B5] transition-colors line-clamp-1">
              {ad.title}
            </h3>
            <div className="text-[22px] font-black text-[#3F51B5] whitespace-nowrap tracking-tight bg-[#3F51B5]/[0.03] px-3 py-1 rounded-lg">
              {ad.price} <span className="text-sm font-bold opacity-80">{t('adCardSAR')}</span>
            </div>
          </div>

          <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-2 mb-5 font-medium">
            {ad.description}
          </p>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[13px] text-gray-400 font-semibold">
            <div className="flex items-center gap-2 group/meta">
              <MapPin className="w-4 h-4 text-[#3F51B5]/40 group-hover/meta:text-[#3F51B5] transition-colors" />
              <span className="group-hover/meta:text-gray-600 transition-colors">{ad.address}</span>
            </div>
            <div className="flex items-center gap-2 group/meta">
              <Clock className="w-4 h-4 text-[#3F51B5]/40 group-hover/meta:text-[#3F51B5] transition-colors" />
              <span className="group-hover/meta:text-gray-600 transition-colors">{formatDate(ad.created_at)}</span>
            </div>
            {ad.views !== undefined && (
              <div className="flex items-center gap-2 group/meta">
                <Eye className="w-4 h-4 text-[#3F51B5]/40 group-hover/meta:text-[#3F51B5] transition-colors" />
                <span className="group-hover/meta:text-gray-600 transition-colors">{ad.views} {t('viewsLabel')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3.5 group/author">
            <div className="w-10 h-10 rounded-full bg-[#F8F9FE] p-0.5 border-2 border-transparent group-hover/author:border-[#3F51B5]/20 transition-all duration-300">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  src={ad.author_image || '/Logo.png'}
                  alt={ad.author_name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-gray-800 group-hover/author:text-[#3F51B5] transition-colors">{ad.author_name}</span>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{t('adDetailsAdvertiser')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" className="h-11 px-5 rounded-xl border-gray-100 text-gray-600 font-bold gap-2 hover:bg-[#F8F9FE] hover:border-[#3F51B5]/30 hover:text-[#3F51B5] transition-all duration-300">
              <MessageCircle className="w-4.5 h-4.5" />
              <span className="text-sm">{t('chatButton')}</span>
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-[#3F51B5] hover:bg-[#303f9f] text-white font-bold gap-2 shadow-lg shadow-[#3F51B5]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Phone className="w-4.5 h-4.5" />
              <span className="text-sm">{t('adDetailsCallButton')}</span>
            </Button>
            <button
              onClick={handleShareClick}
              className="p-2.5 text-gray-300 hover:text-[#3F51B5] hover:bg-[#F8F9FE] rounded-xl transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
