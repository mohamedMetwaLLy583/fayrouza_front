import axiosInstance from './axios-instance';

// Updated interfaces based on the actual API response
export interface AdOwner {
  author_name: string;
  author_phone: string;
  author_image: string;
  social_links: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    snapchat: string;
  };
}

export interface AdDetails {
  id: string;
  image: string[];
  title: string;
  description: string;
  ad_type: string | null;
  address: string;
  category_name: string;
  type: number;
  price: string;
  list_category: Array<{ id: number; name: string }>;
  lat: string;
  lng: string;
  views: number;
  status: string;
  is_favourited: boolean;
  is_premium: boolean;
  owner: AdOwner;
  city_id: number;
  state_id: number | null;
  country_id: number;
  show_phone: number;
  phone: number;
  show_email: number;
  email: string;
  show_whatsapp: number;
  whatsapp: number;
  custom_fields: Array<{ key: string; value: string }>;
  created_at: string;
  similar_ads: any[];
  prev_id: string | null;
  next_id: string | null;
}

export interface AdDetailsApiResponse {
  status: number;
  data: {
    ad: AdDetails;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    views_count: number;
  };
  message: string;
}

export interface FavoriteResponse {
  success: boolean;
  message: string;
  data: {
    ad_id: string;
    category_added: boolean;
    category: {
      id: number;
      name: string;
      slug: string;
    };
    ads_count_in_category: number;
  };
}

export interface GetAdsParams {
  category_id?: string | number;
  city_id?: string | number;
  min_price?: number;
  max_price?: number;
  sort?: string;
  name?: string;
  page?: number;
}

export const adsApi = {
  getAdDetails: async (adId: string): Promise<AdDetailsApiResponse> => {
    console.log('=== API Call: getAdDetails ===');
    console.log('Ad ID:', adId);
    console.log('API URL:', `/ads/show/${adId}`);
    console.log('=============================');
    
    const response = await axiosInstance.get<AdDetailsApiResponse>(`/ads/show/${adId}`);
    
    console.log('=== API Response: getAdDetails ===');
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    console.log('Ad Title:', response.data.data.ad.title);
    console.log('Ad Price:', response.data.data.ad.price);
    console.log('Ad Views:', response.data.data.ad.views);
    console.log('Is Premium:', response.data.data.ad.is_premium);
    console.log('Is Favourited:', response.data.data.ad.is_favourited);
    console.log('Owner Name:', response.data.data.ad.owner.author_name);
    console.log('Custom Fields:', response.data.data.ad.custom_fields);
    console.log('=================================');
    
    return response.data;
  },

  getFilteredAds: async (params: GetAdsParams): Promise<any> => {
    console.log('=== API Call: getFilteredAds ===');
    console.log('Params:', params);
    console.log('===============================');
    
    const response = await axiosInstance.get('/ads', { params });
    
    console.log('=== API Response: getFilteredAds ===');
    console.log('Response Status:', response.status);
    console.log('====================================');
    
    return response.data;
  },

  toggleFavorite: async (adId: string): Promise<FavoriteResponse> => {
    console.log('=== API Call: toggleFavorite ===');
    console.log('Ad ID:', adId);
    console.log('API URL:', `/ads/favourites`);
    console.log('Request Body:', { ad_id: adId });
    
    // التحقق من التوكن قبل الإرسال
    const token = typeof window !== 'undefined' && typeof localStorage !== 'undefined' 
      ? (localStorage.getItem('token') || localStorage.getItem('authToken'))
      : null;
    
    console.log('Auth Token:', token ? `${token.substring(0, 20)}...` : 'لا يوجد توكن');
    console.log('===============================');
    
    const response = await axiosInstance.post<FavoriteResponse>('/ads/favourites', {
      ad_id: adId
    });
    
    console.log('=== API Response: toggleFavorite ===');
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Data:', response.data);
    console.log('Success:', response.data.success);
    console.log('Message:', response.data.message);
    console.log('Category Added:', response.data.data.category_added);
    console.log('Category Name:', response.data.data.category.name);
    console.log('Ads Count in Category:', response.data.data.ads_count_in_category);
    console.log('===================================');
    
    return response.data;
  },
};