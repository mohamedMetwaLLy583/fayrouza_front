'use client';

import { createContext, useContext, ReactNode } from 'react';

interface Category {
  id: string;
  name: string;
  image?: string;
  ads_count: number;
  children?: Category[];
}

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ 
  children, 
  categories, 
  loading, 
  error 
}: { 
  children: ReactNode; 
  categories: Category[]; 
  loading: boolean; 
  error: string | null;
}) {
  return (
    <CategoriesContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}