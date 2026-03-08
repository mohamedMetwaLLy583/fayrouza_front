'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';

interface Category {
  id: string;
  name: string;
  image?: string;
  ads_count: number;
  children?: Category[];
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  const { dir, t } = useI18n();

  // Handle category card click - navigate to category details page
  const handleCategoryClick = () => {
    // Navigate to dynamic route with category name as parameter
    router.push(`/category/${encodeURIComponent(category.name)}`);
  };

  return (
    <div 
      className="cursor-pointer transition-transform duration-200 w-fit hover:scale-105"
      onClick={handleCategoryClick}
    >
      <div className="flex items-center justify-center flex-col">
        {/* Category Image Container */}
        <div className="bg-[#F7F7F7] rounded-[16px] w-[135px] h-[135px] hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-[100%] h-[100%] object-contain p-4 rounded-[16px]"
            />
          ) : (
            // Fallback icon if no image is provided
            <div className="w-16 h-16 bg-[#3F51B5] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {category.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        {/* Category Info */}
        <div className="p-4 text-center">
          <h3 className={`font-[500] text-[#333] truncate text-[20px] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            {category.name}
          </h3>
          {/* Display ads count if available */}
        </div>
      </div>
    </div>
  );
}