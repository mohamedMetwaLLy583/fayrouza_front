import { AdCard } from './ad-card';
import { JobCard } from './job-card';
import Slider from './Slider/slider';

import { Ad, HomeAdCategory } from '@/api/home.api';

interface AdsSectionProps {
  homeAds: HomeAdCategory[];
  title?: string;
  onAdClick?: (adId: string) => void;
  onFavoriteClick?: (adId: string, isFavorited: boolean) => void;
  onShareClick?: (ad: Ad) => void;
  showCategoryHeaders?: boolean;
  useSlider?: boolean;
  slidesPerView?: number;
  spaceBetween?: number;
}

export function AdsSection({ 
  homeAds, 
  onAdClick,
  onFavoriteClick,
  onShareClick,
  showCategoryHeaders = true,
  useSlider = true,
  slidesPerView = 4,
  spaceBetween = 20
}: AdsSectionProps) {
  
  const getGridClasses = () => {
    if (useSlider) return ''; 
    
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
  };

  if (!homeAds || homeAds.length === 0) {
    return (
      <section>
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد إعلانات متاحة حالياً</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="space-y-8">
        {homeAds.map((adCategory) => {
          const isJobCategory = adCategory.category_name.toLowerCase().includes('job') || 
                                adCategory.category_name.includes('وظايف') || 
                                adCategory.category_name.includes('وظائف');

          return (
            <div
              key={adCategory.category_id}
              className=""
            >
              {/* Category Header */}
              {showCategoryHeaders && (
                <div className="flex justify-between items-center mb-[32px]">
                  <h3 className="text-[32px] font-bold text-[#333333] ">
                    {adCategory.category_name}
                  </h3>
                </div>
              )}

              {/* Ads Display - Slider or Grid */}
              {useSlider ? (
                <Slider
                  slidesPerView={slidesPerView}
                  slidesPerViewMobile={1}
                  spaceBetween={spaceBetween}
                  className="ads-slider !pb-12"
                  swiperOptions={{
                    loop: adCategory.ads.length > slidesPerView,
                    autoplay: {
                      delay: 5000,
                      disableOnInteraction: false,
                    },
                    pagination: { clickable: true },
                  }}
                >
                  {adCategory.ads.map((ad) => (
                    isJobCategory ? (
                      <JobCard 
                        key={ad.id} 
                        job={ad} 
                        onClick={onAdClick}
                        onFavoriteClick={onFavoriteClick}
                      />
                    ) : (
                      <AdCard 
                        key={ad.id} 
                        ad={ad} 
                        onClick={onAdClick}
                        onFavoriteClick={onFavoriteClick}
                        onShareClick={onShareClick}
                      />
                    )
                  ))}
                </Slider>
              ) : (
                <div className={getGridClasses()}>
                  {adCategory.ads.map((ad) => (
                    isJobCategory ? (
                      <JobCard 
                        key={ad.id} 
                        job={ad} 
                        onClick={onAdClick}
                        onFavoriteClick={onFavoriteClick}
                      />
                    ) : (
                      <AdCard 
                        key={ad.id} 
                        ad={ad} 
                        onClick={onAdClick}
                        onFavoriteClick={onFavoriteClick}
                        onShareClick={onShareClick}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}