'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface SlideData {
    id: number;
    image: string;
    title?: string;
}

const dummySlides: SlideData[] = [
    { id: 1, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200' },
    { id: 2, image: 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?q=80&w=1200' },
    { id: 3, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200' },
];

export const CategorySlider = () => {
    return (
        <div className="relative w-full group overflow-hidden rounded-2xl mb-8 shadow-md">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                className="w-full h-[180px] sm:h-[240px] md:h-[320px]"
            >
                {dummySlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            <Image
                                src={slide.image}
                                alt={slide.title || "Category Advertisement"}
                                fill
                                priority
                                className="object-cover"
                            />
                            {/* Subtle overlay for better text contrast if we had title */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons to match assets/slider.svg style */}
                <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center border border-gray-100 shadow-lg transition-all transform hover:scale-105 opacity-0 group-hover:opacity-100 focus:outline-none">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center border border-gray-100 shadow-lg transition-all transform hover:scale-105 opacity-0 group-hover:opacity-100 focus:outline-none">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </Swiper>

            {/* Premium UI indicator from asset slider.svg (the bottom rects/dots) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>
                <span className="w-2 h-2 rounded-full bg-white/50 shadow-sm"></span>
                <span className="w-2 h-2 rounded-full bg-white/50 shadow-sm"></span>
            </div>
        </div>
    );
};
