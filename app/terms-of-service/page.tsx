'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useI18n } from '@/lib/i18n/context';
import { CategoriesProvider } from '@/contexts/categories-context';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/api/home.api';
import Loader from '@/components/Loader';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
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
                                <FileText size={32} />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {t('footerTermsOfService')}
                            </h1>
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                            <section className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                                <p>
                                    باستخدامك لمنصة فيروزه، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية.
                                </p>
                                <h3 className="text-xl font-bold mt-6 mb-4">1. شروط الاستخدام</h3>
                                <p>
                                    يجب أن تكون قد بلغت السن القانوني لاستخدام خدمتنا. أنت مسؤول عن الحفاظ على سرية معلومات حسابك.
                                </p>
                                <h3 className="text-xl font-bold mt-6 mb-4">2. المحتوى والإعلانات</h3>
                                <p>
                                    أنت المسؤول الوحيد عن الإعلانات التي تنشرها. نمنع نشر أي محتوى مخالف للقانون أو مضلل أو ينتهك حقوق الآخرين.
                                </p>
                                <h3 className="text-xl font-bold mt-6 mb-4">3. إخلاء المسؤولية</h3>
                                <p>
                                    فيروزه هي منصة إعلانية فقط، ولا نتحمل المسؤولية عن أي معاملات تتم بين المستخدمين. ننصح دائماً بالحذر وإجراء المعاملات في أماكن عامة.
                                </p>
                            </section>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </CategoriesProvider>
    );
}
