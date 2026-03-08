'use client';

import Slider from './Slider/slider';
import { useI18n } from '@/lib/i18n/context';

export function CategoryBanner() {
    const { t, language } = useI18n();

    const slides = [
        {
            id: 1,
            title: language === 'ar' ? 'عروض العيد السنوية' : 'Annual Eid Offers',
            subtitle: language === 'ar' ? 'خصومات تصل إلى 50%' : 'Discounts up to 50%',
            bgColor: 'from-[#3F51B5] to-[#5C6BC0]',
            image: '/Logo.png'
        },
        {
            id: 2,
            title: language === 'ar' ? 'أفضل الصفقات اليوم' : 'Best Deals Today',
            subtitle: language === 'ar' ? 'تصفح أحدث الإعلانات الآن' : 'Browse newest ads now',
            bgColor: 'from-[#00BFA5] to-[#009688]',
            image: '/Logo.png'
        }
    ];

    return (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-md">
            <Slider
                slidesPerView={1}
                slidesPerViewMobile={1}
                spaceBetween={0}
                swiperOptions={{
                    pagination: { clickable: true },
                    autoplay: { delay: 5000 }
                }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className={`w-full h-[200px] md:h-[300px] bg-gradient-to-r ${slide.bgColor} flex items-center justify-between px-8 md:px-20 text-white relative overflow-hidden`}
                    >
                        {/* Background pattern/elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col gap-2">
                            <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold w-fit">
                                {t('bannerBestseller')}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                                {slide.title}
                            </h2>
                            <p className="text-lg md:text-xl text-white/80">
                                {slide.subtitle}
                            </p>
                            <button className="mt-4 bg-white text-[#3F51B5] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all w-fit shadow-lg active:scale-95">
                                {t('bannerShopNow')}
                            </button>
                        </div>

                        <div className="relative z-10 hidden md:block">
                            <div className="w-[180px] h-[180px] bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center p-8 rotate-12 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                                <img src={slide.image} alt="Promo" className="w-full h-full object-contain drop-shadow-2xl" />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
