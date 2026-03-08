'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useI18n } from '@/lib/i18n/context';
import { CategoriesProvider } from '@/contexts/categories-context';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/api/home.api';
import Loader from '@/components/Loader';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function FaqPage() {
    const { t, dir } = useI18n();
    const [categories, setCategories] = useState<any[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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

    const faqs = dir === 'rtl' ? [
        {
            q: "كيف يمكنني إضافة إعلان؟",
            a: "يمكنك إضافة إعلان بالضغط على زر 'أضف إعلان' في الشريط العلوي بعد تسجيل الدخول، ثم ملء بيانات الخدمة أو المنتج."
        },
        {
            q: "هل التسجيل مجاني؟",
            a: "نعم، التسجيل في فيروزه مجاني تماماً لجميع المستخدمين."
        },
        {
            q: "كيف أتواصل مع المعلن؟",
            a: "يمكنك التواصل عبر الهاتف أو الواتساب أو البريد الإلكتروني المذكور في صفحة تفاصيل الإعلان."
        },
        {
            q: "ما هو الإعلان المميز؟",
            a: "الإعلان المميز يظهر في مقدمة النتائج ويحصل على مشاهدات أكثر وتفاعل أسرع من المستخدمين."
        }
    ] : [
        {
            q: "How can I add an advertisement?",
            a: "You can add an ad by clicking the 'Add Advertisement' button in the navbar after logging in, then filling in the service or product details."
        },
        {
            q: "Is registration free?",
            a: "Yes, registration on Fayrouzeh is completely free for all users."
        },
        {
            q: "How do I contact an advertiser?",
            a: "You can contact them via phone, WhatsApp, or email as listed on the ad details page."
        },
        {
            q: "What is a featured advertisement?",
            a: "A featured ad appears at the top of search results and receives more views and faster engagement from users."
        }
    ];

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
                    <div className="max-w-3xl mx-auto">
                        <div className="flex flex-col items-center mb-12">
                            <div className="p-4 bg-purple-100 rounded-full text-purple-600 mb-4">
                                <HelpCircle size={48} />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {t('footerFaq')}
                            </h1>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-blue-300"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
                                    >
                                        <span className="text-lg font-bold text-gray-900">{faq.q}</span>
                                        {openIndex === index ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-gray-400" />}
                                    </button>
                                    {openIndex === index && (
                                        <div className="px-6 pb-6 text-gray-600 border-t border-gray-50 pt-4 animate-in fade-in slide-in-from-top-2">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-blue-50 rounded-2xl text-center">
                            <h3 className="text-xl font-bold text-blue-900 mb-2">
                                {dir === 'rtl' ? 'لم تجد إجابة لسؤالك؟' : 'Didn\'t find your answer?'}
                            </h3>
                            <p className="text-blue-800 mb-6">
                                {dir === 'rtl' ? 'نحن هنا لمساعدتك! تواصل معنا مباشرة.' : 'We\'re here to help! Contact us directly.'}
                            </p>
                            <Link
                                href="/contact-us"
                                className="inline-block bg-[#3F51B5] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#303f9f] transition-colors"
                            >
                                {t('footerContactUs')}
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </CategoriesProvider>
    );
}
