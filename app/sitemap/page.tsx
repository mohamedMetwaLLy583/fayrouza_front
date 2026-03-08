'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useI18n } from '@/lib/i18n/context';
import { CategoriesProvider } from '@/contexts/categories-context';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/api/home.api';
import Loader from '@/components/Loader';
import { Map, LayoutGrid, FileText, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function SitemapPage() {
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

    const siteLinks = [
        { name: t('footerHome'), href: '/home', icon: LayoutGrid },
        { name: t('footerAboutUs'), href: '/about-us', icon: FileText },
        { name: t('footerContactUs'), href: '/contact-us', icon: Smartphone },
        { name: t('footerFaq'), href: '/faq', icon: FileText },
        { name: t('footerPrivacyPolicy'), href: '/privacy-policy', icon: FileText },
        { name: t('footerTermsOfService'), href: '/terms-of-service', icon: FileText },
    ];

    return (
        <CategoriesProvider categories={categories} loading={false} error={null}>
            <div className="min-h-screen flex flex-col" dir={dir}>
                <Navbar />
                <main className="flex-grow main_container py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                <Map size={32} />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {t('footerSitemap')}
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Main Pages */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                                    {dir === 'rtl' ? 'الصفحات الرئيسية' : 'Main Pages'}
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {siteLinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.href}
                                            className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
                                        >
                                            <link.icon className="text-gray-400 group-hover:text-blue-500" size={20} />
                                            <span className="font-medium text-gray-700 group-hover:text-blue-700">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Categories */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                                    {t('footerCategories')}
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/category/${encodeURIComponent(category.name)}`}
                                            className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
                                        >
                                            <LayoutGrid className="text-gray-400 group-hover:text-blue-500" size={20} />
                                            <span className="font-medium text-gray-700 group-hover:text-blue-700">{category.name}</span>
                                        </Link>
                                    ))}
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
