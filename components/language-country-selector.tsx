import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/lib/i18n/context';
import Image from 'next/image';

export function LanguageCountrySelector() {
  const { language, toggleLanguage } = useI18n();

  const handleCountryChange = (countryId: string) => {
    localStorage.setItem('countryId', countryId);
    // Reload or update context if needed, but for now Axios interceptor will pick it up on next request
    window.location.reload(); 
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-auto text-[14px] text-[#212121] gap-1"
          >
            <Image src={"/Flags.svg"} alt="flag" width={24} height={18} />
            {language === "ar" ? "السعوديه" : "Saudi Arabia"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleCountryChange('1')}>
            {language === "ar" ? "السعودية" : "Saudi Arabia"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCountryChange('2')}>
            {language === "ar" ? "مصر" : "Egypt"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-auto text-[14px] text-[#212121] gap-1"
          >
            <Globe className="h-4 w-4" />
            {language === "ar" ? "العربية" : "English"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={toggleLanguage}>
            {language === "ar" ? "English" : "العربية"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}