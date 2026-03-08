'use client';

import { Heart, Folder, TrendingUp } from 'lucide-react';

interface FavoriteStatsProps {
  categoryName?: string;
  adsCountInCategory?: number;
  isVisible?: boolean;
}

export function FavoriteStats({ categoryName, adsCountInCategory, isVisible = false }: FavoriteStatsProps) {
  if (!isVisible || !categoryName) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm z-40">
      <div className="flex items-start gap-3">
        <div className="bg-green-100 p-2 rounded-full">
          <Heart className="w-5 h-5 text-green-600 fill-current" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">تمت الإضافة للمفضلة!</h4>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>الفئة: {categoryName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>إجمالي الإعلانات: {adsCountInCategory}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}