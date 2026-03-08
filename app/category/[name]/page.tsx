'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Grid, List as ListIcon, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { useI18n } from '@/lib/i18n/context';
import { isAuthenticated } from '@/lib/auth-utils';
import { homeApi, Category, Ad, HomeAdCategory } from '@/api/home.api';
import { CategoriesProvider } from '@/contexts/categories-context';
import { CategorySlider } from '@/components/category-slider';
import { FilterSidebar } from '@/components/filter-sidebar';
import { CategorySidebar } from '@/components/category-sidebar';
import { AdCardHorizontal } from '@/components/ad-card-horizontal';
import { AdCard } from '@/components/ad-card';
import { JobCard } from '@/components/job-card';
import { EmptyState } from '@/components/empty-state';
import { HeroSlider } from '@/components/hero-slider';

// SubCategory can be handled by the Category interface since they have the same structure
interface CategoryDetails extends Category {
  description?: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t, dir, language } = useI18n();

  // Get category name from URL params
  const categoryName = params?.name as string;
  const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : '';

  // State to handle client-side authentication check to prevent hydration mismatch
  const [isAuth, setIsAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    cities: [] as string[],
    search: ''
  });

  // Check authentication on client side only
  useEffect(() => {
    setIsAuth(isAuthenticated());
    setAuthChecked(true);
  }, []);

  // Fetch categories for navbar
  const { data: homeData } = useQuery({
    queryKey: ['homePageData'],
    queryFn: () => homeApi.getHomePageData(),
    enabled: isAuth && authChecked,
    staleTime: 5 * 60 * 1000,
  });

  // Use React Query to fetch category details
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['categoryDetails', decodedCategoryName],
    queryFn: () => homeApi.getCategoryDetails(decodedCategoryName),
    enabled: !!decodedCategoryName && isAuth && authChecked,
    staleTime: 5 * 60 * 1000,
  });

  const categoryId = categoryData?.data?.[0]?.id || categoryData?.data?.id;

  const { data: slidersData } = useQuery({
    queryKey: ['categorySliders', categoryId],
    queryFn: () => categoryId ? homeApi.getCategorySliders(categoryId) : Promise.resolve({ data: [] }),
    enabled: !!categoryId && isAuth && authChecked,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch ads for this category using search API
  const { data: adsData, isLoading: adsLoading } = useQuery({
    queryKey: ['categoryAds', decodedCategoryName],
    queryFn: () => homeApi.searchAds(decodedCategoryName),
    enabled: !!decodedCategoryName && isAuth && authChecked,
    staleTime: 5 * 60 * 1000,
  });

  const categories = homeData?.data?.categories || [];
  const handleBackToHome = () => router.push('/home');

  if (!authChecked || categoryLoading || adsLoading) {
    return (
      <CategoriesProvider categories={categories} loading={false} error={null}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center"><Loader /></div>
          <Footer />
        </div>
      </CategoriesProvider>
    );
  }

  if (!isAuth) {
    return (
      <CategoriesProvider categories={[]} loading={false} error={null}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">{t('authenticationRequired')}</h2>
              <Button onClick={() => router.push('/login')} className="bg-[#3F51B5] text-white">
                {t('login')}
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </CategoriesProvider>
    );
  }

  const ads = adsData?.data?.ads || [];
  const subcategories = categoryData?.data?.children || [];

  // Filter ads client-side
  const filteredAds = ads.filter((ad: any) => {
    const priceStr = ad.price?.replace(/[^0-9]/g, '');
    const price = priceStr ? parseInt(priceStr) : 0;

    // Price filter
    if (price < filters.minPrice || price > filters.maxPrice) return false;

    // City filter (if any cities are selected)
    if (filters.cities.length > 0) {
      const cityMatch = filters.cities.some(city =>
        ad.address?.includes(city) || ad.city_name?.includes(city)
      );
      if (!cityMatch) return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = ad.title?.toLowerCase().includes(searchLower);
      const descMatch = ad.description?.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch) return false;
    }

    return true;
  });

  const featuredAds = filteredAds.filter((ad: any) => ad.is_premium);
  const regularAds = filteredAds.filter((ad: any) => !ad.is_premium);

  return (
    <CategoriesProvider categories={categories} loading={false} error={null}>
      <div className="min-h-screen bg-gray-50 flex flex-col" dir={dir}>
        <Navbar />

        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button onClick={handleBackToHome} className="hover:text-[#3F51B5]">{t('home')}</button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{decodedCategoryName}</span>
          </nav>

          {/* Category Specific Sliders */}
          {slidersData?.data && slidersData.data.length > 0 && (
             <HeroSlider sliders={slidersData.data} />
          )}

          {/* Category Slider Section (Rebuilt Part 1) */}
          <CategorySlider />

          {/* Filter Bar (Rebuilt Part 2) */}
          <FilterSidebar
            currentCategory={decodedCategoryName}
            subcategories={subcategories}
            onFilterChange={(newFilters) => {
              setFilters({
                ...filters,
                search: newFilters.search ?? filters.search,
                minPrice: newFilters.minPrice ?? filters.minPrice,
                maxPrice: newFilters.maxPrice ?? filters.maxPrice,
                cities: newFilters.city ? [newFilters.city] : filters.cities
              });
            }}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <CategorySidebar
              currentCategory={decodedCategoryName}
              subcategories={subcategories}
              onFilterChange={(newFilters) => {
                setFilters({
                  ...filters,
                  minPrice: newFilters.minPrice ?? filters.minPrice,
                  maxPrice: newFilters.maxPrice ?? filters.maxPrice,
                  cities: newFilters.cities ?? filters.cities
                });
              }}
            />

            {/* Main Content */}
            <div className="flex-grow">
              {/* Header & Controls */}
              <div className="bg-white p-5 rounded-[20px] shadow-[0px_4px_12px_rgba(0,0,0,0.03)] border border-gray-50 mb-8 flex flex-wrap items-center justify-between gap-5 transition-all">
                <div>
                  <h1 className="text-[24px] font-[900] text-gray-900 flex items-center gap-3">
                    {decodedCategoryName}
                    <span className="text-gray-300 font-bold text-[18px]">/</span>
                    <span className="text-[#3F51B5] font-black text-[18px] bg-[#3F51B5]/[0.05] px-3 py-1 rounded-full border border-[#3F51B5]/10">
                      {filteredAds.length} {t('viewsLabel')}
                    </span>
                  </h1>
                </div>

                <div className="flex items-center gap-5">
                  {/* Sorting */}
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-[#F8F9FE] hover:bg-white hover:border-[#3F51B5]/20 px-5 py-3.5 rounded-[14px] border border-transparent transition-all cursor-pointer group shadow-sm active:scale-[0.98]">
                    <SlidersHorizontal className="w-4.5 h-4.5 text-gray-400 group-hover:text-[#3F51B5] transition-colors" />
                    <span className="group-hover:text-[#3F51B5] transition-colors">{t('sortNewestFirst')}</span>
                    <ChevronDown className="w-4.5 h-4.5 text-gray-400 group-hover:text-[#3F51B5] transition-colors" />
                  </div>

                  {/* View Toggles */}
                  <div className="flex items-center bg-[#F8F9FE] p-1.5 rounded-[16px] shadow-inner border border-gray-100">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2.5 rounded-[12px] transition-all duration-300 ${viewMode === 'grid'
                        ? 'bg-[#3F51B5] text-white shadow-[0px_4px_12px_rgba(63,81,181,0.3)]'
                        : 'text-gray-400 hover:text-gray-600'}`}
                      title="Grid View"
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2.5 rounded-[12px] transition-all duration-300 ${viewMode === 'list'
                        ? 'bg-[#3F51B5] text-white shadow-[0px_4px_12px_rgba(63,81,181,0.3)]'
                        : 'text-gray-400 hover:text-gray-600'}`}
                      title="List View"
                    >
                      <ListIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Ads - Placeholder if none marked premium specifically */}
              {featuredAds.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-[900] text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
                    {t('featuredAds')}
                  </h2>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6' : 'flex flex-col gap-5'}>
                    {featuredAds.map((ad: any) => {
                      const isJob = ad.category_name?.toLowerCase().includes('job') || 
                                   ad.category_name?.includes('وظايف') || 
                                   ad.category_name?.includes('وظائف');
                      
                      return viewMode === 'grid' ? (
                        isJob ? <JobCard key={ad.id} job={ad} /> : <AdCard key={ad.id} ad={ad} />
                      ) : <AdCardHorizontal key={ad.id} ad={ad} />;
                    })}
                  </div>
                </div>
              )}

              {/* Regular Ads */}
              <div>
                <h2 className="text-xl font-[900] text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-[#3F51B5] rounded-full"></span>
                  {t('allAds')}
                </h2>
                {regularAds.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-6 gap-y-8' : 'flex flex-col gap-5'}>
                    {regularAds.map((ad: any) => {
                       const isJob = ad.category_name?.toLowerCase().includes('job') || 
                                    ad.category_name?.includes('وظايف') || 
                                    ad.category_name?.includes('وظائف');

                       return viewMode === 'grid' ? (
                         isJob ? <JobCard key={ad.id} job={ad} /> : <AdCard key={ad.id} ad={ad} />
                       ) : <AdCardHorizontal key={ad.id} ad={ad} />;
                    })}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>

              {/* Pagination Placeholder */}
              {filteredAds.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled className="w-10 h-10 p-0 rounded-lg">1</Button>
                    <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-lg">2</Button>
                    <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-lg">3</Button>
                    <span className="px-2">...</span>
                    <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-lg">10</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CategoriesProvider>
  );
}

// Dummy ChevronDown for the sort button
function ChevronDown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}