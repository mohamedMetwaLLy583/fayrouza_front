import axiosInstance from './axios-instance';

export interface Category {
  id: string;
  name: string;
  image?: string;
  ads_count: number;
  children?: Category[];
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  image: string[];
  ad_type: string | null;
  address: string;
  category_name: string;
  list_category?: Array<{ id: number; name: string }>;
  author_name: string;
  author_image?: string;
  status: string;
  rejection_reason: string | null;
  rejection_reason_type: string | null;
  type: number;
  city_id: number;
  price: string;
  lat: string;
  lng: string;
  views: number;
  is_favourited: boolean;
  is_premium: boolean;
  show_phone: number;
  show_email: number;
  show_whatsapp: number;
  custom_fields: Array<{ key: string; value: string }>;
  created_at: string;
}

export interface HomeAdCategory {
  category_id: number;
  category_name: string;
  ads_count: number;
  ads: Ad[];
}

export interface HomePageApiResponse {
  status: number;
  data: {
    categories: Category[];
    home_ads: HomeAdCategory[];
    sliders: any[];
  };
  message: string;
}

interface Country {
  id: number;
  name: string;
  // Add other properties as needed based on API response
}

interface State {
  id: number;
  name: string;
  // Add other properties as needed based on API response
}

interface CountriesResponse {
  status: number;
  data: Country[];
  message?: string;
}

interface StatesResponse {
  status: number;
  data: State[];
  message?: string;
}

export const homeApi = {
  getHomePageData: async (): Promise<HomePageApiResponse> => {
    const response = await axiosInstance.get<HomePageApiResponse>('/home-page');
    return response.data;
  },

  getCategoryDetails: async (categoryName: string): Promise<any> => {
    const response = await axiosInstance.get(`/categories?name=${encodeURIComponent(categoryName)}`);
    return response.data;
  },

  getCategorySliders: async (categoryId: string): Promise<any> => {
    const response = await axiosInstance.get(`/sliders/${categoryId}`);
    return response.data;
  },

  searchAds: async (query: string): Promise<any> => {
    console.log('=== API Call: searchAds ===');
    console.log('Search Query:', query);
    console.log('API URL:', `/ads/search?search=${encodeURIComponent(query)}`);
    console.log('==========================');
    
    const response = await axiosInstance.get(`/ads/search?search=${encodeURIComponent(query)}`);
    
    console.log('=== API Response: searchAds ===');
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    console.log('==============================');
    
    return response.data;
  },

};