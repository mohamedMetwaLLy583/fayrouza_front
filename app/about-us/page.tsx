'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useI18n } from '@/lib/i18n/context';
import { CategoriesProvider } from '@/contexts/categories-context';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/api/home.api';
import Loader from '@/components/Loader';
import { Info } from 'lucide-react';

export default function AboutUsPage() {
    const { t, dir } = useI18n();
    const [categories, setCategories] = useState<any[]>([]);

    const { data: homeData, isLoading } = useQuery({
        queryKey: ['homePageData'],
        queryFn: () => homeApi.getHomePageData(),
        staleTime: 5 * 10 * 1000,
    });

    useEffect(() => {
        if (homeData && homeData.data) {
            setCategories(homeData.data.categories);
        }
    }, [homeData]);

    if (isLoading) {
        return (
            <CategoriesProvider categories={[]} loading={true} error={null}>
                <Loader />
            </CategoriesProvider>
        );
    }

    return (
        <CategoriesProvider categories={categories} loading={false} error={null}>
            <div className="min-h-screen flex flex-col" dir={dir}>
                <Navbar />
                <main className="flex-grow main_container py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <Info size={32} />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {t('footerAboutUs')}
                            </h1>
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                            <section className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                                    {t('footerCompanyInfo')}
                                </h2>
                                <p>
                                    {t('footerCompanyDescription')}
                                </p>
                            </section>

                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-blue-50 p-6 rounded-xl">
                                    <h3 className="text-xl font-bold text-blue-900 mb-3">رؤيتنا</h3>
                                    <p className="text-blue-800">
                                        أن نكون المنصة الأكثر موثوقية وسهولة للاستخدام في المنطقة، حيث يلتقي البائعون والمشترون في بيئة آمنة وفعالة.
                                    </p>
                                </div>
                                <div className="bg-indigo-50 p-6 rounded-xl">
                                    <h3 className="text-xl font-bold text-indigo-900 mb-3">ميزتنا</h3>
                                    <p className="text-indigo-800">
                                        نحن نؤمن بالبساطة والشفافية. نوفر لك الأدوات اللازمة لعرض خدماتك أو البحث عن ما تحتاجه بأقل مجهود وبأسرع وقت.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </CategoriesProvider>
    );
}
