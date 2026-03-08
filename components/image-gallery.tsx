'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom, Controller, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import { Fullscreen, Minimize } from 'lucide-react';

interface ImageGalleryProps {
  images?: string[];
  title: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images = [], title }) => {
  const { dir } = useI18n();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Handle keyboard events for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreen]);
  
  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const element = document.querySelector('.main-image-swiper') as HTMLElement;
      if (element) {
        element.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // If no images are provided, use online placeholders
  const galleryImages = images.length > 0 
    ? images
    : [
        'https://placehold.co/800x600/cccccc/999999?text=Main+Image',
        'https://placehold.co/150x150/cccccc/999999?text=Thumb+1',
        'https://placehold.co/150x150/cccccc/999999?text=Thumb+2',
        'https://placehold.co/150x150/cccccc/999999?text=Thumb+3',
        'https://placehold.co/150x150/cccccc/999999?text=Thumb+4',
        'https://placehold.co/150x150/cccccc/999999?text=Thumb+5'
      ];

  return (
    <div className="p-[16px] rounded-[8px] border border-solid border-[#EEEEEE] bg-white">
      {/* معرض الصور الرئيسي */}
      <div className="mb-4 relative">
        <Swiper
          spaceBetween={10}
          navigation={false}
          thumbs={{ swiper: thumbsSwiper }}
          zoom={true}
          keyboard={{
            enabled: true,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          modules={[Navigation, Thumbs, Zoom, Keyboard]}
          className="main-image-swiper"
        >
          {galleryImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[651px]">
                <div className="swiper-zoom-container">
                  <Image
                    src={image}
                    alt={`${title} ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src =
                        "https://placehold.co/800x600/cccccc/999999?text=Main+Image";
                    }}
                    unoptimized={true}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* عدد الصور */}
        <div className="absolute bottom-4 right-4 bg-[#E9E9E9] text-black text-sm px-3 py-1 rounded-full z-10">
          <span className="slide-counter">
            <span className="current-slide">{activeIndex + 1}</span> /{" "}
            {galleryImages.length}
          </span>
        </div>

        {/* زر الفول سكرين */}
        <div className="absolute bottom-4 left-4 z-10">
          <button
            onClick={toggleFullscreen}
            className="bg-[#E9E9E9] text-black p-2 rounded-full transition-colors"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Fullscreen className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs, Zoom]}
        className="thumbs-swiper mt-4"
        breakpoints={{
          320: {
            slidesPerView: 3,
          },
          640: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 5,
          },
        }}
      >
        {galleryImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[123.80000305175781px] cursor-pointer">
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover rounded cursor-pointer"
                unoptimized={true}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageGallery;