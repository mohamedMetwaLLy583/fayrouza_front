'use client';

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { AuthLogo } from "@/components/auth-logo";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { language, toggleLanguage } = useI18n();

  const handleLanguageChange = (value: string) => {
    // Toggle language if it's different from current
    if ((language === 'ar' && value === 'dark') || (language === 'en' && value === 'light')) {
      toggleLanguage();
    }
  };

  const handleLoginSuccess = (data: any) => {
    // Handle successful login and redirect to home
    console.log('Login successful:', data);
    router.push("/home");
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-[40px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center flex-row-reverse gap-1">
            <Select
              value={language === 'ar' ? 'light' : 'dark'}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[102px] !shadow-none border-0 outline-0">
                <SelectValue placeholder="اختار اللغه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">عربي</SelectItem>
                <SelectItem value="dark">English</SelectItem>
              </SelectContent>
            </Select>
            <Image
              src={"/language-square.png"}
              width={24}
              height={24}
              alt="test"
            />
          </div>
          <Image
            src={"/Logo.png"}
            width={60.77976608276367}
            height={79.99964904785156}
            alt="test"
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
      <div className="bg-[#3F51B5] relative hidden lg:block">
        <Image
          width={1000}
          height={1000}
          quality={70}
          src="/AuthRectangle.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <AuthLogo
          width={136.75462341308594}
          height={179.99996948242188}
          src="/AuthLogo.png"
          alt="Authentication Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}