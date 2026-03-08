'use client';

import { useI18n } from '@/lib/i18n/context';
import { Button } from './ui/button';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarCategory {
    id: string;
    name: string;
    ads_count?: number;
    children?: SidebarCategory[];
}

interface CategorySidebarProps {
    currentCategory?: string;
    subcategories: SidebarCategory[];
    onFilterChange?: (filters: any) => void;
}

export function CategorySidebar({ currentCategory, subcategories, onFilterChange }: CategorySidebarProps) {
    const { t, dir, language } = useI18n();
    const router = useRouter();
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(true);
    const [isCityOpen, setIsCityOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedCities, setSelectedCities] = useState<string[]>([]);

    const handleCityToggle = (city: string) => {
        const newCities = selectedCities.includes(city)
            ? selectedCities.filter(c => c !== city)
            : [...selectedCities, city];
        setSelectedCities(newCities);
    };

    const handleApplyFilters = () => {
        onFilterChange?.({
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            cities: selectedCities
        });
    };

    return (
        <aside className="w-full lg:w-[300px] flex-shrink-0 space-y-6" dir={dir}>
            {/* Categories Filter */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                    onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
                    className="w-full flex items-center justify-between p-4 font-bold text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                    <span>{t('homePageCategories')}</span>
                    {isSubcategoryOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {isSubcategoryOpen && (
                    <div className="p-4 space-y-2">
                        {subcategories.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => router.push(`/category/${encodeURIComponent(sub.name)}`)}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all ${currentCategory === sub.name
                                    ? 'bg-[#3F51B5]/10 text-[#3F51B5] font-bold'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span>{sub.name}</span>
                                {sub.ads_count !== undefined && (
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                        {t('adsCountLabel', { count: sub.ads_count })}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* City Filter */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                    onClick={() => setIsCityOpen(!isCityOpen)}
                    className="w-full flex items-center justify-between p-4 font-bold text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                    <span>{t('filterCity')}</span>
                    {isCityOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {isCityOpen && (
                    <div className="p-4 space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('filterSearchCity')}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3F51B5] focus:border-transparent transition-all outline-none"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>

                        <div className="max-h-[200px] overflow-y-auto space-y-1 custom-scrollbar">
                            {/* Dummy cities for now, ideally fetched from API */}
                            {['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'].map((city) => (
                                <label key={city} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCities.includes(city)}
                                        onChange={() => handleCityToggle(city)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#3F51B5] focus:ring-[#3F51B5]"
                                    />
                                    <span className="text-sm text-gray-700">{city}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                    className="w-full flex items-center justify-between p-4 font-bold text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                    <span>{t('filterPriceRange')}</span>
                    {isPriceOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {isPriceOpen && (
                    <div className="p-4 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">{t('filterFrom')}</label>
                                <input
                                    type="number"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3F51B5]"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">{t('filterTo')}</label>
                                <input
                                    type="number"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3F51B5]"
                                />
                            </div>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3F51B5]"
                        />

                        <Button
                            onClick={handleApplyFilters}
                            className="w-full bg-[#3F51B5] hover:bg-[#303f9f] text-white py-2 rounded-lg transition-all font-bold"
                        >
                            {t('filterApply')}
                        </Button>
                    </div>
                )}
            </div>
        </aside>
    );
}
