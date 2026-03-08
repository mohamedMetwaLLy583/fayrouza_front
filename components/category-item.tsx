import { 
  NavigationMenuItem,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
    image?: string;
    ads_count: number;
    children?: any[];
  };
}

export function CategoryItem({ category }: CategoryItemProps) {
  return (
    <NavigationMenuItem>
      <Link href={`/category/${category.id}`} legacyBehavior passHref>
        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="text-sm font-medium leading-none">{category.name}</div>
          <p className="text-xs leading-none text-muted-foreground">
            {category.ads_count} ads
          </p>
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}