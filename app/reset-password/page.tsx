'use client';

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import toast from 'react-hot-toast';
import { useI18n } from "@/lib/i18n/context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type ResetPasswordFormValues = {
  email: string;
  password: string;
  password_confirmation: string;
};

// Define a type for Axios error response
interface AxiosErrorData {
  message?: string;
  [key: string]: unknown;
}

interface AxiosError {
  response?: {
    data: AxiosErrorData;
    status: number;
  };
  message?: string;
  status?: number;
}

export default function ResetPasswordPage() {
  const { t, language, toggleLanguage, dir } = useI18n();
  
  const handleLanguageChange = (value: string) => {
    // Toggle language if it's different from current
    if ((language === 'ar' && value === 'dark') || (language === 'en' && value === 'light')) {
      toggleLanguage();
    }
  };

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) => {
      // Call the reset password API endpoint
      return authApi.resetPassword(data);
    },
    onSuccess: () => {
      toast.success(t('resetPasswordSuccess'));
    },
    onError: (error: AxiosError) => {
      let errorMessage = t('resetPasswordError');
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>({
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = handleSubmit((data) => {
    resetPasswordMutation.mutate(data);
  });

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
          <div className="w-full max-w-md">
            <form className="flex flex-col gap-6" onSubmit={onSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className={`flex items-center justify-center ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'} gap-[16px]`}>
                    <h1 className="text-[32px] font-700 text-[#161616]">
                      {t('resetPasswordTitle')}
                    </h1>
                    <Image src={"/Waving.png"} alt="test" width={24} height={38} />
                  </div>
                  <p className="text-[#616161] text-[16px] text-balance mt-[16]">
                    {t('resetPasswordSubtitle')}
                  </p>
                </div>
                
                <Field>
                  <div className={`flex items-center justify-${dir === 'rtl' ? 'end' : 'start'}`}>
                    <FieldLabel
                      htmlFor="email"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} text-[16px] font-400 text-[#212121]`}
                    >
                      {t('emailLabel')}
                    </FieldLabel>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className={`${dir === 'rtl' ? 'text-right placeholder:text-[14px]' : 'text-left placeholder:text-[14px]'} ${errors.email ? 'border-red-500' : ''}`}
                    disabled={resetPasswordMutation.isPending}
                    {...register("email", {
                      required: t('emailRequired'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('emailInvalid')
                      }
                    })}
                  />
                  {errors.email && (
                    <FieldDescription className={`text-red-500 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[14px] mt-1`}>
                      {errors.email.message}
                    </FieldDescription>
                  )}
                </Field>
                
                <Field>
                  <div className={`flex items-center justify-${dir === 'rtl' ? 'end' : 'start'}`}>
                    <FieldLabel
                      htmlFor="password"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} text-[16px] font-400 text-[#212121]`}
                    >
                      {t('passwordLabel')}
                    </FieldLabel>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    className={`${dir === 'rtl' ? 'text-right placeholder:text-[14px]' : 'text-left placeholder:text-[14px]'} ${errors.password ? 'border-red-500' : ''}`}
                    disabled={resetPasswordMutation.isPending}
                    {...register("password", {
                      required: t('passwordRequired'),
                      minLength: {
                        value: 6,
                        message: t('passwordMinLength')
                      }
                    })}
                  />
                  {errors.password && (
                    <FieldDescription className={`text-red-500 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[14px] mt-1`}>
                      {errors.password.message}
                    </FieldDescription>
                  )}
                </Field>
                
                <Field>
                  <div className={`flex items-center justify-${dir === 'rtl' ? 'end' : 'start'}`}>
                    <FieldLabel
                      htmlFor="password_confirmation"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} text-[16px] font-400 text-[#212121]`}
                    >
                      {t('passwordConfirmationLabel')}
                    </FieldLabel>
                  </div>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder={t('passwordConfirmationPlaceholder')}
                    className={`${dir === 'rtl' ? 'text-right placeholder:text-[14px]' : 'text-left placeholder:text-[14px]'} ${errors.password_confirmation ? 'border-red-500' : ''}`}
                    disabled={resetPasswordMutation.isPending}
                    {...register("password_confirmation", {
                      required: t('passwordConfirmationRequired'),
                      validate: (value) => 
                        value === password || t('passwordConfirmationMismatch')
                    })}
                  />
                  {errors.password_confirmation && (
                    <FieldDescription className={`text-red-500 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[14px] mt-1`}>
                      {errors.password_confirmation.message}
                    </FieldDescription>
                  )}
                </Field>
                
                <Field>
                  <Button
                    type="submit"
                    className="h-[56px] rounded-[4px] bg-[#3F51B5] hover:bg-[#3f51b584] cursor-pointer w-full"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? (
                      <span>{t('loading')}</span>
                    ) : (
                      <span>{t('resetPasswordButton')}</span>
                    )}
                  </Button>
                </Field>
                
                <Field>
                  <div className={`flex items-center justify-center ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'} w-full`}>
                    <p className="text-[14px] font-medium text-[#616161]">
                      {t('rememberPassword')}
                    </p>
                    <Link
                      href="/"
                      className="text-[14px] font-bold underline text-[#3F51B5]"
                    >
                      {t('backToLogin')}
                    </Link>
                  </div>
                </Field>
              </FieldGroup>
            </form>
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            width={136.75462341308594}
            height={179.99996948242188}
            src="/AuthLogo.png"
            alt="Authentication Logo"
            className="w-auto h-auto"
          />
        </div>
      </div>
    </div>
  );
}