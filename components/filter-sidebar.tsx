'use client';

import { useI18n } from '@/lib/i18n/context';
import { Button } from './ui/button';
import { Search, ChevronDown, MapPin, DollarSign, ListFilter } from 'lucide-react';
import { useState } from 'react';

interface FilterSidebarProps {
    currentCategory?: string;
    subcategories: any[];
    onFilterChange?: (filters: any) => void;
}

export function FilterSidebar({ currentCategory, subcategories, onFilterChange }: FilterSidebarProps) {
    const { t, dir } = useI18n();
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedCity, setSelectedCity] = useState('');

    const handleApply = () => {
        onFilterChange?.({
            search: searchQuery,
            minPrice: priceRange.min ? parseInt(priceRange.min) : undefined,
            maxPrice: priceRange.max ? parseInt(priceRange.max) : undefined,
            city: selectedCity
        });
    };

    return (
        <div className="w-full bg-white rounded-[20px] shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 p-5 mb-8" dir={dir}>
            <div className="flex flex-col lg:flex-row items-center gap-5">
                {/* Search Input */}
                <div className="flex-1 relative w-full group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#3F51B5] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('filterSearchPlaceholder')}
                        className="w-full pr-12 pl-4 py-4 bg-[#F8F9FE] border border-transparent rounded-[14px] text-sm focus:bg-white focus:border-[#3F51B5]/20 focus:ring-4 focus:ring-[#3F51B5]/5 transition-all outline-none text-gray-700 placeholder:text-gray-400 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* City Dropdown */}
                <div className="w-full lg:w-48 relative group">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-[#3F51B5] transition-colors" />
                    </div>
                    <select
                        className="w-full pr-12 pl-4 py-4 bg-[#F8F9FE] border border-transparent rounded-[14px] text-sm focus:bg-white focus:border-[#3F51B5]/20 focus:ring-4 focus:ring-[#3F51B5]/5 appearance-none cursor-pointer outline-none text-gray-700 font-medium transition-all"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">{t('filterCity')}</option>
                        {['الرياض', 'جدة', 'الدمام', 'مكة المكرمة'].map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>

                {/* Price Range */}
                <div className="w-full lg:w-72 flex items-center gap-3">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3F51B5]">
                            <span className="text-xs font-bold">SAR</span>
                        </div>
                        <input
                            type="number"
                            placeholder={t('filterMinPrice')}
                            className="w-full pr-12 pl-3 py-4 bg-[#F8F9FE] border border-transparent rounded-[14px] text-sm focus:bg-white focus:border-[#3F51B5]/20 focus:ring-4 focus:ring-[#3F51B5]/5 outline-none text-gray-700 font-medium transition-all"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                    </div>
                    <div className="text-gray-300 font-bold">-</div>
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3F51B5]">
                            <span className="text-xs font-bold">SAR</span>
                        </div>
                        <input
                            type="number"
                            placeholder={t('filterMaxPrice')}
                            className="w-full pr-12 pl-3 py-4 bg-[#F8F9FE] border border-transparent rounded-[14px] text-sm focus:bg-white focus:border-[#3F51B5]/20 focus:ring-4 focus:ring-[#3F51B5]/5 outline-none text-gray-700 font-medium transition-all"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                    </div>
                </div>

                {/* Apply Button */}
                <Button
                    onClick={handleApply}
                    className="w-full lg:w-auto px-10 py-7 bg-[#3F51B5] hover:bg-[#303f9f] text-white rounded-[14px] font-bold flex items-center gap-2 shadow-lg shadow-[#3F51B5]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <ListFilter className="w-5 h-5" />
                    {t('filterApply')}
                </Button>
            </div>
        </div>
    );
}
