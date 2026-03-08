import axiosInstance from './axios-instance';

interface LoginCredentials {
  email: string;
  password: string;
  platform?: string;
  fcm_token?: string;
}

// Define the actual API response structure
interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

interface LoginUserData {
  id: string;
  email: string;
  name?: string;
  is_guest?: boolean;
}

interface LoginResponse {
  token?: string;
  user?: LoginUserData;
  message?: string;
}

interface LoginApiResponse {
  status: number;
  data: {
    user: LoginUserData;
    token: string;
  };
  message: string;
}

interface ForgotPasswordResponse {
  message?: string;
}

interface ResetPasswordCredentials {
  email: string;
  password: string;
  password_confirmation: string;
}

interface ResetPasswordResponse {
  message?: string;
}

interface VerifyOtpCredentials {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  message?: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  dial_code: string;
  country_id: number;
  city_id: number;
}

interface RegisterResponse {
  message?: string;
}

interface GuestLoginResponse {
  token?: string;
  user?: LoginUserData;
  message?: string;
}

interface UserCoinsResponse {
  status: boolean;
  message: string;
  data: {
    coins: number;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginApiResponse>('/login', credentials);
    // Transform the response to match the expected structure
    if (response.data.data && response.data.data.user && response.data.data.token) {
      return {
        token: response.data.data.token,
        user: response.data.data.user,
        message: response.data.message
      };
    }
    // Fallback for different response structure
    return response.data as unknown as LoginResponse;
  },

  guestLogin: async (): Promise<GuestLoginResponse> => {
    const response = await axiosInstance.post<GuestLoginResponse>('/guest-login');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await axiosInstance.post<ForgotPasswordResponse>('/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordCredentials): Promise<ResetPasswordResponse> => {
    const response = await axiosInstance.post<ResetPasswordResponse>('/reset-password', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpCredentials): Promise<VerifyOtpResponse> => {
    const response = await axiosInstance.post<VerifyOtpResponse>('/verify-otp', data);
    return response.data;
  },

  register: async (data: RegisterCredentials): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<RegisterResponse>('/register', data);
    return response.data;
  },

  getCountries: async (): Promise<any> => {
    const response = await axiosInstance.get('/countries');
    return response.data;
  },

  getStatesByCountry: async (countryId: number): Promise<any> => {
    const response = await axiosInstance.get(`/country_states?country_id=${countryId}`);
    return response.data;
  },

  getUserCoins: async (): Promise<UserCoinsResponse> => {
    const response = await axiosInstance.get<UserCoinsResponse>('/user/coins');
    return response.data;
  },

  getCountryCities: async (countryId: number): Promise<any> => {
    const response = await axiosInstance.get(`/country_cities?country_id=${countryId}`);
    return response.data;
  },

  getStateCities: async (stateId: number): Promise<any> => {
    const response = await axiosInstance.get(`/state_cities?state_id=${stateId}`);
    return response.data;
  },
};