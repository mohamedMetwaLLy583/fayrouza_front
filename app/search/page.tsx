'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/api/home.api';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AdsSection } from '@/components/ads-section';
import Loader from '@/components/Loader';
import { useI18n } from '@/lib/i18n/context';
import { CategoriesProvider } from '@/contexts/categories-context';
import { Suspense, useEffect, useState } from 'react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const { t } = useI18n();
    const [categories, setCategories] = useState<any[]>([]);

    // Fetch home page data for categories (needed by CategoriesProvider and potentially for context)
    const { data: homeData, isLoading: isHomeLoading } = useQuery({
        queryKey: ['homePageData'],
        queryFn: () => homeApi.getHomePageData(),
        staleTime: 5 * 60 * 1000,
    });

    // Fetch search results
    const { data: searchData, isLoading: isSearchLoading, error } = useQuery({
        queryKey: ['searchAds', query],
        queryFn: () => homeApi.searchAds(query || ''),
        enabled: !!query,
    });

    useEffect(() => {
        if (homeData && homeData.data) {
            setCategories(homeData.data.categories);
        }
    }, [homeData]);

    if (isHomeLoading || isSearchLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader />
            </div>
        );
    }

    // Pre-process search results into the format AdsSection expects (HomeAdCategory[])
    const searchAds = searchData?.data?.ads || [];

    const formattedResults = [{
        category_id: 0,
        category_name: t('searchSearchingFor', { query: query || '' }),
        ads_count: searchAds.length,
        ads: searchAds
    }];

    return (
        <CategoriesProvider categories={categories} loading={false} error={null}>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow main_container my-[32px]">
                    <div className="mx-auto">
                        <h1 className="text-[32px] font-bold text-[#333333] mb-[32px]">
                            {t('searchResultsFor', { count: searchAds.length, query: query || '' })}
                        </h1>

                        {error ? (
                            <div className="text-center py-12">
                                <p className="text-red-500">{t('errorLoadingData')}</p>
                            </div>
                        ) : (
                            <AdsSection
                                homeAds={formattedResults}
                                showCategoryHeaders={false}
                                useSlider={false}
                            />
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </CategoriesProvider>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
