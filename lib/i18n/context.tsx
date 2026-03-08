'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ar } from './ar';
import { en } from './en';

type Language = 'ar' | 'en';
type Translations = typeof ar;

interface I18nContextType {
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  language: Language;
  toggleLanguage: () => void;
  dir: 'rtl' | 'ltr';
}

const translations = { ar, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check for saved language preference in localStorage
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      if (savedLang === 'ar' || savedLang === 'en') {
        return savedLang;
      }
    }
    // Default to Arabic
    return 'ar';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language);
    
    // Update document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
    let translation = translations[language][key];
    
    // Replace parameters in translation string
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return translation;
  };

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ t, language, toggleLanguage, dir }}>
      {children}
    </I18nContext.Provider>
  );
};