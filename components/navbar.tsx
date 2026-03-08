'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Diamond,
  Bell,
  User,
  Plus,
  Phone,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageCountrySelector } from './language-country-selector';
import { AuthDropdown } from './auth-dropdown';
import { useAuth } from '@/hooks/use-auth';
import { useCategories } from '@/contexts/categories-context';
import { MegaMenu } from './mega-menu';
import Image from "next/image";
import { useI18n } from '@/lib/i18n/context';
import { homeApi } from '@/api/home.api';
import toast from 'react-hot-toast';

// TypeScript interfaces for search results
interface SearchAd {
  id: string;
  title: string;
  description: string;
  image: string[];
  ad_type: string | null;
  address: string;
  category_name: string;
  author_name: string;
  author_image: string;
  price: string;
  lat: string;
  lng: string;
  views: number;
  is_favourited: boolean;
  is_premium: boolean;
  created_at: string;
}

interface SearchResponse {
  status: number;
  data: {
    ads: SearchAd[];
  };
  message: string;
}

export function Navbar() {
  const { categories, loading, error } = useCategories();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchAd[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Live search function with debouncing
  const performLiveSearch = useCallback(async (query: string) => {
    // Don't search for empty or very short queries
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Get authentication token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setIsSearching(true);

      // Use the API function for consistent error handling and token management
      const data: SearchResponse = await homeApi.searchAds(query);

      // Handle successful search
      if (data.status === 200 && data.data && data.data.ads) {
        console.log('=== Live Search Results ===');
        console.log('Query:', query);
        console.log('Results Count:', data.data.ads.length);
        console.log('First Result:', data.data.ads[0]);
        console.log('==========================');

        // Set search results and show dropdown
        setSearchResults(data.data.ads);
        setShowResults(true);

      } else {
        console.log('=== No Live Search Results ===');
        console.log('Response:', data);
        console.log('==============================');

        setSearchResults([]);
        setShowResults(true); // Still show dropdown with "no results" message
      }

    } catch (error: any) {
      console.error('Live search error:', error);

      // Handle specific error cases silently for live search
      if (error?.response?.status === 401) {
        // Don't show error toast for live search, just hide results
        setSearchResults([]);
        setShowResults(false);
      } else {
        // For other errors, show empty results
        setSearchResults([]);
        setShowResults(true);
      }
    } finally {
      setIsSearching(false);
    }
  }, [isAuthenticated]);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for live search
    const timeout = setTimeout(() => {
      performLiveSearch(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    setSearchTimeout(timeout);

    // Cleanup timeout on unmount or query change
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchQuery, performLiveSearch]);

  // Manual search function (for Enter key or search button)
  const performManualSearch = async (query: string) => {
    // Clear any pending live search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Validate search query
    if (!query.trim()) {
      toast.error(t('searchEnterQuery'));
      return;
    }

    // Redirect to search results page
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // Handle search input change (triggers live search)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If user clears the search, hide results immediately
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    }
  };

  // Handle search form submission (Enter key or search button click)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performManualSearch(searchQuery);
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    performManualSearch(searchQuery);
  };

  // Handle clicking on a search result
  const handleResultClick = (ad: SearchAd) => {
    console.log('Clicked on ad:', ad);
    setShowResults(false);
    setSearchQuery('');
    // Navigate to ad details page
    router.push(`/ads/${ad.id}`);
    toast.success(t('searchSelected', { title: ad.title }));
  };

  // Handle input focus (show results if available)
  const handleSearchFocus = () => {
    if (searchResults.length > 0 || (searchQuery.trim().length >= 2 && !isSearching)) {
      setShowResults(true);
    }
  };

  // Handle clicking outside search results to close dropdown
  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on results
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  // Clear search results
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  return (
    <div className="w-full border-b">
      {/* Section 1: Top Bar */}
      <div className="bg-[#F8F8F8] py-[11.5px]">
        <div className="main_container mx-auto px-4 flex justify-between items-center space-x-6">
          <LanguageCountrySelector />
          <div className="flex items-center justify-center gap-[10px]">
            <Button
              variant="ghost"
              className="p-0 h-auto text-[13px] text-[#212121]"
            >
              <User size={16} />
              {t('inviteFriends')}
            </Button>
            {/* <hr/> */}
            <Link
              href="/contact-us"
              className="flex items-center gap-1 text-[13px] text-[#212121] hover:text-[#3F51B5] transition-colors font-medium"
            >
              <Phone size={16} />
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </div>

      {/* Section 2: Main Navbar */}
      <div className="py-[24px] main_container">
        <div className="container mx-auto px-4 flex items-center space-x-4">
          {/* Logo */}
          <div className="flex-shrink-0 ">
            <Image
              src={"/Logo.png"}
              alt="test"
              width={36.468}
              height={48}
              quality={70}
              priority
            />
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={handleSearchButtonClick}
              />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="pl-10 pr-8 w-full rounded-[4px] px-[16px] py-[14px] placeholder:text-[14px]"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                disabled={false}
              />
              {searchQuery && !isSearching && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              )}
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="text-sm text-gray-600 mb-2 px-2">
                      {t('searchResultsFor', { count: searchResults.length, query: searchQuery })}
                      {isSearching && <span className="ml-2">🔍</span>}
                    </div>
                    {searchResults.slice(0, 10).map((ad) => (
                      <div
                        key={ad.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleResultClick(ad)}
                      >
                        {/* Ad Image */}
                        <div className="flex-shrink-0">
                          {ad.image && ad.image.length > 0 ? (
                            <img
                              src={ad.image[0]}
                              alt={ad.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Search className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Ad Details */}
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-gray-900 truncate text-sm">
                            {ad.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {ad.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {ad.category_name}
                            </span>
                            {ad.price && ad.price !== "0.00" && (
                              <span className="text-xs font-semibold text-[#3F51B5]">
                                {ad.price} {t('searchCurrency')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              📍 {ad.address}
                            </span>
                            {ad.is_premium && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                                {t('searchPremium')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {searchResults.length > 10 && (
                      <div className="p-3 border-t border-gray-100 text-center">
                        <button
                          className="text-sm text-[#3F51B5] hover:underline"
                          onClick={() => {
                            setShowResults(false);
                            // TODO: Navigate to full search results page
                            // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                            toast.success(t('searchViewAllSoon'));
                          }}
                        >
                          {t('searchViewAllResults', { count: searchResults.length })}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {isSearching ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mb-2"></div>
                        <p className="text-sm">{t('searchSearchingFor', { query: searchQuery })}</p>
                      </div>
                    ) : searchQuery.trim().length < 2 ? (
                      <div>
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">{t('searchMinimumChars')}</p>
                      </div>
                    ) : (
                      <div>
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">{t('searchNoResultsFound', { query: searchQuery })}</p>
                        <p className="text-xs mt-1">{t('searchTryDifferent')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center gap-[8px] p-[8px] bg-[#F8F8F8] rounded-full">
              <p>200</p>
              <Image
                src={"/icon.svg"}
                alt="test"
                width={24}
                height={24}
                quality={70}
                priority
              />
            </div>

            <div className="flex items-center justify-center gap-[8px] p-[8px] bg-[#F8F8F8] rounded-full">
              <Bell className="h-5 w-5" />
            </div>

            <AuthDropdown />

            {isAuthenticated && (
              <Button className="bg-[#3F51B5] text-white rounded-[4px] py-[10px] px-[24px] text-[16px]">
                <Plus className="h-4 w-4 mr-2" />
                {t('addAdvertisement')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Categories Mega Menu */}
      <div className="bg-[#060F36]">
        <div className="main_container mx-auto px-4">
          {loading ? (
            <div className="py-3 text-center text-gray-500">
              Loading categories...
            </div>
          ) : error ? (
            <div className="py-3 text-center  text-red-500">{error}</div>
          ) : (
            <MegaMenu categories={categories} />
          )}
        </div>
      </div>
    </div>
  );
}