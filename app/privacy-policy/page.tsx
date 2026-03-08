'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useI18n } from '@/lib/i18n/context';
import { CategoriesProvider } from '@/contexts/categories-context';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/api/home.api';
import Loader from '@/components/Loader';
import { ShieldAlert } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
                            <div className="p-3 bg-green-100 rounded-full text-green-600">
                                <ShieldAlert size={32} />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {t('footerPrivacyPolicy')}
                            </h1>
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                            <section className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                                <p>
                                    نحن في فيروزه نولي أهمية قصوى لخصوصيتك. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدام منصتنا.
                                </p>
                                <h3 className="text-xl font-bold mt-6 mb-4">1. المعلومات التي نجمعها</h3>
                                <p>
                                    نجمع المعلومات التي تقدمها لنا مباشرة، مثل اسمك وبريدك الإلكتروني ورقم هاتفك عند إنشاء حساب أو إضافة إعلان.
                                </p>
                                <h3 className="text-xl font-bold mt-6 mb-4">2. كيف نستخدم معلوماتك</h3>
                                <p>
                                    نستخدم معلوماتك لتقديم خدماتنا، وتسهيل التواصل بين البائع والمشتري، وتحسين منصتنا، وإرسال التحديثات الهامة.
                                </p>
                                <h3 className="text-xl font-bold mt-6 mb-4">3. حماية البيانات</h3>
                                <p>
                                    نحن نطبق إجراءات أمنية صارمة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الإفصاح.
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
