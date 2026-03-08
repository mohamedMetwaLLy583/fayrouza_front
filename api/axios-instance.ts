import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://fayrouza.sdevelopment.tech/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      // Try both token keys for compatibility
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add Country ID header
      const countryId = localStorage.getItem('countryId') || '1'; // Default to Saudi Arabia (1)
      config.headers['X-Country-Id'] = countryId;

      // Add Language header
      const lang = localStorage.getItem('next-i18n-locale') || 'ar';
      config.headers['Accept-Language'] = lang;
    }
    
    // Log all outgoing requests
    console.log('📤 Outgoing Request:', {
      method: config.method?.toUpperCase(),
      url: (config.baseURL || '') + (config.url || ''),
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 Incoming Response:', {
      status: response.status,
      url: response.config.url,
      // data: response.data // Commented out to reduce log bloat unless needed
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.message || error.message;

    console.error('❌ API Error:', {
      status,
      url,
      message,
      data: error.response?.data
    });

    // Handle 401 Unauthorized errors globally
    if (status === 401) {
      console.warn('🔒 Unauthorized access (401). Redirecting to login...');
      
      if (typeof window !== 'undefined') {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Redirect to login page if we're not already there
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;