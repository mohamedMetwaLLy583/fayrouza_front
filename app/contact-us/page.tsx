'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useI18n } from '@/lib/i18n/context';
import { CategoriesProvider } from '@/contexts/categories-context';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/api/home.api';
import Loader from '@/components/Loader';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

export default function ContactUsPage() {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(dir === 'rtl' ? 'تم إرسال رسالتك بنجاح' : 'Message sent successfully');
    };

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
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                            {t('footerContactUs')}
                        </h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contact Info */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{t('phoneLabel')}</h3>
                                        <p className="text-gray-600" dir="ltr">{t('footerPhone')}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{t('emailLabel')}</h3>
                                        <p className="text-gray-600">{t('footerEmail')}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-red-100 rounded-lg text-red-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{dir === 'rtl' ? 'الموقع' : 'Location'}</h3>
                                        <p className="text-gray-600">{t('footerLocation')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">{t('nameLabel')}</label>
                                            <Input placeholder={t('namePlaceholder')} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">{t('emailLabel')}</label>
                                            <Input type="email" placeholder={t('emailPlaceholder')} required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">{dir === 'rtl' ? 'الموضوع' : 'Subject'}</label>
                                        <Input placeholder={dir === 'rtl' ? 'ادخل موضوع الرسالة...' : 'Enter subject...'} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">{dir === 'rtl' ? 'الرسالة' : 'Message'}</label>
                                        <Textarea
                                            placeholder={dir === 'rtl' ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-[#3F51B5] hover:bg-[#303f9f] text-white py-6 text-lg">
                                        <Send size={20} className={dir === 'rtl' ? 'ml-2' : 'mr-2'} />
                                        {dir === 'rtl' ? 'إرسال الرسالة' : 'Send Message'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </CategoriesProvider>
    );
}
