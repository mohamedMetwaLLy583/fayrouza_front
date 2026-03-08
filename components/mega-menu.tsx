import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  image?: string;
  ads_count: number;
  children?: Category[];
}

interface MegaMenuProps {
  categories: Category[];
}

export function MegaMenu({ categories }: MegaMenuProps) {
  return (
    <NavigationMenu className="w-full relative z-[100]">
      <NavigationMenuList className="flex flex-wrap gap-1 py-2 justify-start">
        {categories.map((category) => (
          <NavigationMenuItem key={category.id}>
            {category.children && category.children.length > 0 ? (
              <>
                <NavigationMenuTrigger className="bg-transparent text-white text-[15px] font-bold hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white transition-colors duration-200 flex items-center gap-2">
                  {category.image && (
                    <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      <img src={category.image} alt={category.name} className="w-[80%] h-[80%] object-contain" />
                    </div>
                  )}
                  <span>{category.name}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 bg-white rounded-2xl shadow-[0px_20px_40px_rgba(0,0,0,0.1)] border border-gray-100">
                  <div className="w-[85vw] md:w-[600px] lg:w-[700px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.children.map((subCategory) => (
                      <div key={subCategory.id} className="group block p-4 rounded-2xl hover:bg-[#F9FAFB] transition-colors border border-transparent hover:border-gray-100">
                        <Link
                          href={`/category/${encodeURIComponent(subCategory.name)}`}
                          className="block cursor-pointer mb-3"
                        >
                          <div className="font-black text-gray-900 group-hover:text-[#3F51B5] transition-colors text-base">{subCategory.name}</div>
                          <div className="text-xs text-[#FFBB37] font-bold mt-1 bg-[#FFBB37]/10 w-fit px-2 py-0.5 rounded-full inline-block">
                            {subCategory.ads_count} إعلان
                          </div>
                        </Link>

                        {subCategory.children && subCategory.children.length > 0 && (
                          <div className="mt-3 flex flex-col gap-2 relative">
                            {/* خط عمودي جانبي بتصميم ذكي */}
                            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gray-100 rounded-full" />
                            
                            <div className="pr-3 flex flex-col gap-2">
                              {subCategory.children.slice(0, 4).map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/category/${encodeURIComponent(child.name)}`}
                                  className="block text-sm text-gray-500 hover:text-[#3F51B5] transition-colors font-medium relative before:content-[''] before:absolute before:-right-3 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-200 hover:before:bg-[#3F51B5]"
                                >
                                  {child.name}
                                </Link>
                              ))}
                              {subCategory.children.length > 4 && (
                                <Link
                                  href={`/category/${encodeURIComponent(subCategory.name)}`}
                                  className="block text-xs text-[#3F51B5] hover:underline font-bold mt-1"
                                >
                                  عرض الكل ({subCategory.children.length})
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={`/category/${encodeURIComponent(category.name)}`} legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent text-white text-[15px] font-bold hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white flex items-center gap-2`}>
                  {category.image && (
                    <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      <img src={category.image} alt={category.name} className="w-[80%] h-[80%] object-contain" />
                    </div>
                  )}
                  <span>{category.name}</span>
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}