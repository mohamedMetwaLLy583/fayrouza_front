"use client";
import React, { ReactNode, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderProps {
  children: ReactNode;
  slidesPerView?: number;
  slidesPerViewMobile?: number;
  spaceBetween?: number;
  className?: string;
  swiperOptions?: SwiperOptions;
  modules?: any[];
  useFadeEffect?: boolean;
}

export default function Slider({
  children,
  slidesPerView = 4,
  slidesPerViewMobile = 1,
  spaceBetween = 20,
  className,
  swiperOptions = {},
  modules = [Pagination, Autoplay],
  useFadeEffect = false,
}: SliderProps) {
  const swiperRef = useRef<any>(null);
  const effect = useFadeEffect ? "fade" : "slide";
  const activeModules = useFadeEffect ? [...modules, EffectFade, Navigation] : [...modules, Navigation];

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        slidesPerView={slidesPerViewMobile}
        spaceBetween={spaceBetween}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          ...(swiperOptions.autoplay as any),
        }}
        loop={swiperOptions.loop ?? true}
        pagination={swiperOptions.pagination ?? false}
        speed={swiperOptions.speed ?? 800}
        effect={effect}
        fadeEffect={useFadeEffect ? { crossFade: true } : undefined}
        modules={activeModules}
        breakpoints={{
          640: { slidesPerView: Math.min(slidesPerView, 2), spaceBetween },
          768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween },
          1024: { slidesPerView, spaceBetween },
          ...swiperOptions.breakpoints,
        }}
        className={`mySwiper ${className || ""}`}
        {...swiperOptions}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            {child}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-center"
        onClick={() => swiperRef.current?.swiper.slidePrev()}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-center"
        onClick={() => swiperRef.current?.swiper.slideNext()}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}