'use client';

import { useI18n } from '@/lib/i18n/context';
import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export function EmptyState() {
  const { t, dir } = useI18n();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[32px] border border-gray-100 shadow-sm" dir={dir}>
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/MOKUP.png" // Fallback to mockup or better a dedicated empty state illustration if available
          alt="No results"
          fill
          className="object-contain opacity-50 grayscale"
        />
        {/* If there's a specific empty state image, we should use it here */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-[#F8F9FE] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-4xl">🛒</span>
            </div>
        </div>
      </div>
      
      <h3 className="text-[28px] font-black text-gray-900 mb-2">
        {t('searchNoResults')}
      </h3>
      <p className="text-gray-500 text-[18px] mb-8 max-w-md">
        {t('searchTryDifferent')}
      </p>
      
      <Button 
        onClick={() => router.push('/home')}
        className="bg-[#3F51B5] hover:bg-[#303f9f] text-white px-10 py-6 rounded-[16px] font-black shadow-lg shadow-[#3F51B5]/20 transition-all hover:scale-[1.05]"
      >
        {t('backToHome')}
      </Button>
    </div>
  );
}
