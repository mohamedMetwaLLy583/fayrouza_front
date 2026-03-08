import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import Image from "next/image";

interface SocialLoginButtonProps {
  provider: 'google' | 'apple';
  onClick?: () => void;
  className?: string;
}

export function SocialLoginButton({
  provider,
  onClick,
  className = ""
}: SocialLoginButtonProps) {
  const { t, dir } = useI18n();

  const providerConfig = {
    google: {
      text: t('googleAccount'),
      logo: '/google_Logo.png',
      bgColor: 'bg-[#F9F9F9F9]',
      borderColor: 'border-[#737373]'
    },
    apple: {
      text: t('appleAccount'),
      logo: '/apple_Logo.png',
      bgColor: 'bg-[#F9F9F9F9]',
      borderColor: 'border-[#737373]'
    }
  };

  const config = providerConfig[provider];
  return (
    <Button
      className={`w-1/2 h-[48px] px-[12px] ${config.bgColor} border border-solid ${config.borderColor} rounded-[12px] text-[#212121] hover:bg-transparent cursor-pointer text-[14px] text-[#212121] flex items-center ${dir === "rtl" ? "justify-end" : "justify-start"} flex-row-reverse gap-2 ${className}`}
      variant="outline"
      onClick={onClick}
    >
      <Image
        src={config.logo}
        alt={`${provider} Logo`}
        width={20}
        height={20}
      />
      {config.text}
    </Button>
  );
}