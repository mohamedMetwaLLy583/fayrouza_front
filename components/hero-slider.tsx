'use client';

import Slider from './Slider/slider';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

interface HeroSliderProps {
  sliders?: any[];
}

export function HeroSlider({ sliders }: HeroSliderProps) {
  const { t, dir } = useI18n();

  // Use real sliders or fall back to mock if empty
  const displaySliders = (sliders && sliders.length > 0) ? sliders : [
    {
      id: 1,
      image: '/Frame.png',
      title: 'عروض العيد',
    }
  ];

  return (
    <section className="w-full mb-12">
      <Slider
        slidesPerView={1}
        slidesPerViewMobile={1}
        spaceBetween={0}
        useFadeEffect={true}
        className="hero-slider rounded-[32px] overflow-hidden shadow-2xl"
        swiperOptions={{
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            clickable: true,
            dynamicBullets: true,
          },
          speed: 1000,
        }}
      >
        {displaySliders.map((slide, index) => (
          <div key={slide.id || index} className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px]">
            {/* Background Image */}
            <img
              src={slide.image || '/Frame.png'}
              alt={slide.title || 'Fayrouzeh Slide'}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-8 sm:p-16 lg:p-24">
              <div className={`max-w-2xl ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {/* Dynamic content if available in API */}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
