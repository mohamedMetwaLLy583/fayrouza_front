// Utility functions for authentication
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token && token.length > 0;
};

export const getUserData = (): any => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};