import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Utility functions for authentication
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token && token.length > 0;
};

const getUserData = (): any => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check auth status on mount
    setIsAuth(isAuthenticated());
    setLoading(false);
  }, []);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setIsAuth(false);
      router.push('/login');
    }
  };

  return {
    isAuthenticated: isAuth,
    loading,
    logout,
    getUserData
  };
};