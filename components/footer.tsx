import { Facebook, Twitter, Instagram, Youtube, Globe, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';

export function Footer() {
  const { t, dir } = useI18n();

  return (
    <>
      <div
        style={{
          backgroundImage: "url(/Vector.svg)",
          backgroundSize: "contain",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-[#FAFAFA]"
        dir={dir}
      >
        <div className="flex items-center justify-between  main_container">
          <div>
            <div className="mb-[16px]">
              <p className="text-[24px] text-[#3F51B5] font-bold">
                {t("promotionalTagline")}
              </p>
            </div>
            <div className="mb-[24px]">
              <p className="text-[32px] font-bold text-[#333333]">
                {t("promotionalTitle")}
              </p>
            </div>
            <div className="flex items-center justify-start gap-[16px]">
              <Image
                src="/Store_download_one.png"
                alt=""
                width={120}
                height={40}
              />
              <Image
                src="/Store_download_two.png"
                alt=""
                width={120}
                height={40}
              />
            </div>
          </div>
          <div>
            <Image src="/MOKUP.png" alt="" width={498} height={378} />
          </div>
        </div>
      </div>
      <footer
        className="bg-[#232D64] text-white py-[40px]"
        style={{
          backgroundImage: "url(/Pattern.svg)",
          backgroundPosition: "center center",
        }}
        dir={dir}
      >
        <div className="main_container">
          <div className="flex items-center justify-center flex-col py-5">
            <Image
              src={"/AuthLogo.png"}
              alt="logo"
              width={60.77973175048828}
              height={80.00007629394531}
            />
            <p className="my-[24px] text-[14px] font-[400] text-[#FFFFFFC7]">
              {t("footerCompanyDescription")}
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#FFFFFF3D] mb-8 w-full"></div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#FFFFFF99] text-[14px]">
              © {new Date().getFullYear()} {t("footerCompanyInfo")}.{" "}
              {t("footerCopyright")}.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-[14px] text-[#FFFFFF]">
              <Link
                href="/about-us"
                className="hover:text-white transition-colors underline"
              >
                {t("footerAboutUs")}
              </Link>
              <Link
                href="/contact-us"
                className="hover:text-white transition-colors underline"
              >
                {t("footerContactUs")}
              </Link>
              <Link
                href="/faq"
                className="hover:text-white transition-colors underline"
              >
                {t("footerFaq")}
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors underline"
              >
                {t("footerPrivacyPolicy")}
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:text-white transition-colors underline"
              >
                {t("footerTermsOfService")}
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-white transition-colors underline"
              >
                {t("footerSitemap")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}