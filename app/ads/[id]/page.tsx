'use client';

import React, { useEffect, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CategoriesProvider } from '@/contexts/categories-context';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Calendar, Eye, Phone, Mail, MessageCircle, Clock, Share2, Heart, Bookmark } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { adsApi } from '@/api/ads.api';
import { homeApi } from '@/api/home.api';
import { useFavorites } from '@/hooks/use-favorites';
import { useToast } from '@/components/toast-notification';
import { AdCard } from '@/components/ad-card';
import Slider from '@/components/Slider/slider';
import ImageGallery from '@/components/image-gallery';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import interfaces from API file
import type { AdDetailsApiResponse } from '@/api/ads.api';

export default function AdDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { dir, t } = useI18n();
  const adId = params.id as string;
  const { toggleFavorite, isLoading: favoriteLoading } = useFavorites();
  const { showToast, ToastContainer } = useToast();

  const { data: homeData, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['homePageData'],
    queryFn: homeApi.getHomePageData,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data, isLoading, error } = useQuery<AdDetailsApiResponse>({
    queryKey: ['adDetails', adId],
    queryFn: () => adsApi.getAdDetails(adId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!adId,
  });

  useEffect(() => {
    // Hidden logs for production
  }, [data, error]);

  // استخراج الفئات من البيانات
  const categories = homeData?.data?.categories || [];

  if (isLoading || categoriesLoading) {
    return (
      <CategoriesProvider categories={[]} loading={true} error={null}>
        <Loader />
      </CategoriesProvider>
    );
  }

  if (error) {
    return (
      <CategoriesProvider categories={categories} loading={false} error="Failed to load ad details">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen flex-grow">
            <div className="text-center">
              <p className="text-red-600 mb-4">{t('adDetailsLoadingError')}</p>
              <button
                onClick={() => router.back()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {t('adDetailsBackButton')}
              </button>
            </div>
          </div>
        </div>
      </CategoriesProvider>
    );
  }

  if (!data || !data.data || !data.data.ad) {
    return (
      <CategoriesProvider categories={categories} loading={false} error="No ad data available">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen flex-grow">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{t('adDetailsNotFound')}</p>
              <button
                onClick={() => router.back()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {t('adDetailsBackButton')}
              </button>
            </div>
          </div>
        </div>
      </CategoriesProvider>
    );
  }

  const ad = data.data.ad;

  // وظائف الأيقونات
  const handleFavoriteClick = async () => {
    try {
      await toggleFavorite(ad.id, ad.is_favourited);
      showToast(ad.is_favourited ? t('adDetailsFavoriteRemoved') : t('adDetailsFavoriteAdded'), 'success');
    } catch (error) {
      showToast(t('adDetailsFavoriteError'), 'error');
    }
  };

  const handleShareClick = async () => {
    const shareUrl = `${window.location.origin}/ads/${ad.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: ad.title, url: shareUrl });
        showToast(t('adDetailsShared'), 'success');
      } catch (error) {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast(t('adDetailsLinkCopied'), 'success');
      } catch (error) {
        showToast(t('adDetailsShareError'), 'error');
      }
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(ad.id);
    showToast(t('adDetailsIdCopied') || 'تم نسخ رقم الإعلان', 'success');
  };

  return (
    <CategoriesProvider
      categories={categories}
      loading={false}
      error={categoriesError ? "Failed to load categories" : null}
    >
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />

        {/* Breadcrumb Section */}
        <div className="bg-[#F9FAFB] border-b border-gray-100">
          <div className="main_container py-4 flex items-center justify-start">
            <Breadcrumb>
              <BreadcrumbList className="flex-row">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/home" className="text-gray-400 text-sm font-bold hover:text-[#3F51B5] transition-colors">
                    {t("breadcrumbHome")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-300 mx-2" />
                
                {ad.list_category?.map((category) => (
                  <Fragment key={category.id}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/category/${encodeURIComponent(category.name)}`}
                        className="text-gray-400 text-sm font-bold hover:text-[#3F51B5] transition-colors"
                      >
                        {category.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-gray-300 mx-2" />
                  </Fragment>
                ))}

                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 font-black text-sm">
                    {t("breadcrumbAdDetails") || "تفاصيل الإعلان"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <main className="flex-grow ">
          <div className="main_container">
            {/* Header Actions & Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 py-[26px]">
              <h1 className="text-[28px] font-black text-gray-900 leading-tight">
                {ad.title}
              </h1>
              
              <div className="flex items-center gap-3">
                <button 
                   onClick={() => router.back()}
                   className="p-2.5 rounded-full border border-gray-100 text-gray-400 hover:text-[#3F51B5] hover:border-[#3F51B5]/20 transition-all bg-white"
                >
                  <ChevronLeft className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
                <button 
                   onClick={handleShareClick}
                   className="p-2.5 rounded-full border border-gray-100 text-gray-400 hover:text-[#3F51B5] hover:border-[#3F51B5]/20 transition-all bg-white"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                   onClick={handleFavoriteClick}
                   disabled={favoriteLoading}
                   className={`p-2.5 rounded-full border border-gray-100 transition-all bg-white ${ad.is_favourited ? 'text-[#FF4B4B] border-[#FF4B4B]/20' : 'text-gray-400 hover:text-[#FF4B4B]'}`}
                >
                  <Heart className={`w-5 h-5 ${ad.is_favourited ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2.5 rounded-full border border-gray-100 text-gray-400 hover:text-[#3F51B5] hover:border-[#3F51B5]/20 transition-all bg-white">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* تقسيم الصفحة إلى نصفين */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (Main Content) - RTL: Right Column */}
              <div className="lg:col-span-8 space-y-8">
                {/* Image Gallery */}
                <div className="relative rounded-[32px] overflow-hidden group">
                  <ImageGallery 
                    images={Array.isArray(ad.image) ? ad.image : ad.image ? [ad.image] : []} 
                    title={ad.title} 
                  />
                  
                  {/* Premium Banner */}
                  {ad.is_premium && (
                    <div className="absolute top-6 left-6 z-20 bg-[#FFBB37] text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-black shadow-lg">
                      <span className="text-xl">★</span>
                      <span>إعلان مميز</span>
                    </div>
                  )}
                </div>

                {/* Ad Header Info Summary */}
                <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-6 shadow-sm">
                   <div className="space-y-2">
                      <h2 className="text-[22px] font-black text-gray-900">{ad.title}</h2>
                      <div className="flex items-center gap-6 text-gray-400 text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#3F51B5]/40" />
                          <span>{ad.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#3F51B5]/40" />
                          <span>
                            {new Date(ad.created_at).toLocaleDateString(dir === 'rtl' ? "ar-SA" : "en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Ad Stats / Basic Info Box */}
                <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-8">تفاصيل الإعلان</h3>
                  
                  <div className="bg-[#F9FAFB] rounded-[24px] p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <span className="text-gray-500 font-bold">رقم الإعلان</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-bold text-sm">#{ad.id}</span>
                        <button onClick={handleCopyId} className="text-[#3F51B5]/40 hover:text-[#3F51B5] transition-colors">
                           <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <span className="text-gray-500 font-bold">القسم</span>
                      <span className="text-gray-900 font-black text-left">{ad.list_category?.map(c => c.name).join(' / ') || ad.category_name}</span>
                    </div>

                    {ad.ad_type && !(ad.list_category?.some(c => c.name.includes('وظائف') || c.name.includes('Job'))) && !ad.category_name?.includes('وظائف') && (
                      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <span className="text-gray-500 font-bold">حالة الإعلان</span>
                        <span className="text-gray-900 font-black px-4 py-1.5 bg-[#F9FAFB] border border-gray-200 rounded-full text-sm">{ad.ad_type}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-bold">
                        {(ad.list_category?.some(c => c.name.includes('وظائف') || c.name.includes('Jobs') || c.name.includes('job')) || ad.category_name?.includes('وظائف')) ? 'الراتب' : 'السعر'}
                      </span>
                      <div className="bg-[#FFBB37]/10 text-[#FFBB37] px-6 py-2 rounded-full font-black text-lg border border-[#FFBB37]/20">
                        {ad.price && ad.price !== "0.00" && ad.price !== "0" ? `${ad.price} ${t('adCardSAR')}` : 'غير محدد'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Text */}
                <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-6">{t('adDetailsDescription')}</h3>
                  <div className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                    {ad.description}
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-6">المرفقات</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center justify-between w-full bg-[#F9FAFB] p-4 rounded-2xl border border-gray-50 hover:border-[#3F51B5]/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-50 p-3 rounded-xl">
                          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"></path></svg>
                        </div>
                        <div>
                          <p className="font-black text-gray-900">Mohamed resume.pdf</p>
                          <p className="text-gray-400 text-xs font-bold">2.4 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <button className="p-2 text-gray-400 hover:text-[#3F51B5] transition-colors"><Eye className="w-5 h-5"/></button>
                         <button className="p-2 text-gray-400 hover:text-[#3F51B5] transition-colors"><Clock className="w-5 h-5"/></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Ad Owner Card */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm sticky top-24">
                  <h3 className="text-xl font-black text-gray-900 mb-8">صاحب الإعلان</h3>
                  
                  <div className="flex items-center gap-5 mb-10">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#3F51B5]/10 p-1 bg-white">
                       <div className="w-full h-full rounded-full overflow-hidden relative">
                         <img 
                            src={ad.owner?.author_image || "/Logo.png"} 
                            alt={ad.owner?.author_name || ""} 
                            className="w-full h-full object-cover"
                         />
                       </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900">{ad.owner?.author_name}</h4>
                      <p className="text-gray-400 font-bold text-sm">حساب شخصي</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={() => ad.phone && (window.location.href = `tel:${ad.phone}`)}
                      className="w-full h-14 rounded-2xl bg-[#3F51B5] hover:bg-[#303f9f] text-white font-black text-lg gap-3 shadow-lg shadow-[#3F51B5]/20 flex items-center justify-center border-none"
                    >
                      <Phone className="w-5 h-5 fill-current" />
                      مكالمة
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => ad.whatsapp && window.open(`https://wa.me/${ad.whatsapp}`, '_blank')}
                      className="w-full h-14 rounded-2xl border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/5 font-black text-lg gap-3 flex items-center justify-center bg-transparent"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      واتساب
                    </Button>

                    <Button 
                      variant="outline"
                      onClick={() => ad.email && (window.location.href = `mailto:${ad.email}`)}
                      className="w-full h-14 rounded-2xl border-2 border-gray-100 text-gray-400 hover:bg-gray-50 font-black text-lg gap-3 flex items-center justify-center bg-transparent"
                    >
                      <Mail className="w-5 h-5" />
                      البريد
                    </Button>
                  </div>

                  {/* Promotion Package Mock */}
                  <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-400 text-sm font-bold mb-4">هل ترغب في تمييز إعلانك؟</p>
                    <button onClick={() => router.push('/promote')} className="text-[#3F51B5] font-black hover:underline transition-all bg-transparent border-none p-0 cursor-pointer">
                      اكتشف باقات التميز الجديدة
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Ads Section */}
            {ad.similar_ads && ad.similar_ads.length > 0 && (
              <div className="mt-20">
                <div className="flex justify-between items-end mb-10">
                   <div>
                      <h2 className="text-[32px] font-black text-gray-900 leading-tight">إعلانات مشابهة</h2>
                      <p className="text-gray-500 font-medium mt-1">قد تنال إعجابك هذه العروض أيضاً</p>
                   </div>
                </div>

                <Slider
                  slidesPerView={4}
                  slidesPerViewMobile={1.2}
                  spaceBetween={24}
                  className="similar-ads-slider !pb-12"
                  swiperOptions={{
                    loop: ad.similar_ads.length > 4,
                    autoplay: {
                      delay: 5000,
                      disableOnInteraction: false,
                    },
                    pagination: { clickable: true },
                  }}
                >
                  {ad.similar_ads.map((similarAd: any) => (
                    <AdCard
                      key={similarAd.id}
                      ad={similarAd}
                    />
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </CategoriesProvider>
  );
}