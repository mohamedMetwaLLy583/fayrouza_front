"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { homeApi, Category, Ad, HomeAdCategory, HomePageApiResponse } from "@/api/home.api";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CategoriesProvider } from "@/contexts/categories-context";
import { CategoryCard } from "@/components/category-card";
import { AdsSection } from "@/components/ads-section";
import { HeroSlider } from "@/components/hero-slider";
import { useI18n } from "@/lib/i18n/context";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { t, dir } = useI18n();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["homePageData"],
    queryFn: () => homeApi.getHomePageData(),
    enabled: authChecked,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  const handleAdClick = (adId: string) => {
    router.push(`/ads/${adId}`);
  };

  const handleShareClick = (ad: Ad) => {
    console.log(t("adCardShareAd") + ":", ad.title);
  };

  if (!authChecked || isLoading) {
    return (
      <CategoriesProvider categories={[]} loading={true} error={null}>
        <Loader />
      </CategoriesProvider>
    );
  }

  if (error || !data || !data.data) {
    return (
      <CategoriesProvider
        categories={[]}
        loading={false}
        error={t("homePageErrorLoading")}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen flex-grow">
            <p>{t("homePageErrorLoading")}</p>
          </div>
          <Footer />
        </div>
      </CategoriesProvider>
    );
  }

  const { categories, home_ads } = data.data;

  return (
    <CategoriesProvider categories={categories} loading={false} error={null}>
      <div className="min-h-screen flex flex-col bg-[#F9FAFB]" dir={dir}>
        <Navbar />
        
        <main className="flex-grow pt-8 pb-16">
          <div className="main_container">
            {/* 1. Hero Slider Section */}
            <HeroSlider sliders={data?.data?.sliders} />

            {/* 2. Categories Section */}
            <section className="mb-16">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-[32px] font-black text-gray-900 leading-tight">
                    {t("homePageCategories")}
                  </h2>
                  <p className="text-gray-500 font-medium mt-1">تصفح حسب الفئات والاهتمامات</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>

            {/* 3. Grouped Ads Sections (Cars, Real Estate, Jobs, etc.) */}
            <div className="space-y-20">
              {home_ads.map((adCategory) => (
                <section key={adCategory.category_id}>
                  <div className="flex justify-between items-center mb-8 px-2">
                    <h3 className="text-[28px] font-[900] text-gray-900">
                      {adCategory.category_name}
                    </h3>
                    <Link 
                      href={`/category/${encodeURIComponent(adCategory.category_name)}`}
                      className="text-[#3F51B5] font-black text-[16px] hover:underline flex items-center gap-1 group"
                    >
                      {t("viewAll")}
                      <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        {dir === 'rtl' ? '←' : '→'}
                      </span>
                    </Link>
                  </div>

                  <AdsSection
                    homeAds={[adCategory]}
                    onAdClick={handleAdClick}
                    onShareClick={handleShareClick}
                    showCategoryHeaders={false} // Hidden as we handle custom header above
                    useSlider={true}
                    slidesPerView={4}
                    spaceBetween={24}
                  />
                </section>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CategoriesProvider>
  );
}

