'use client';

import { useState, useEffect } from "react";
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

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  dial_code: string;
  country_id: number;
  city_id: number;
};

// Define types for the register response
interface RegisterApiResponse {
  status: number;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  };
  message: string;
}

interface RegisterResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

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

export default function RegisterPage() {
  const { t, language, toggleLanguage, dir } = useI18n();

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue, // Add setValue to reset city_id when country changes
  } = useForm<RegisterFormValues>({
    mode: "onBlur",
  });

  const password = watch("password");
  const selectedCountryId = watch("country_id"); // Get selected country ID from form

  // Define the mutation for registration
  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) =>
      authApi.register(data) as Promise<RegisterResponse>,
    onSuccess: (response) => {
      // Handle different response structures
      let actualData = response;
      const responseData = response as any;
      if (
        responseData.data &&
        responseData.data.user &&
        responseData.data.token
      ) {
        // Handle response in the format {status: 200, data: {user, token}, message: "..."}
        actualData = {
          user: responseData.data.user,
          token: responseData.data.token,
          message: responseData.message,
        };
      } else if (response.token && response.user) {
        // Handle response in the expected format {token, user, message}
        actualData = response;
      }

      // Store the token and user data in localStorage
      if (actualData.token) {
        localStorage.setItem("authToken", actualData.token);
      }

      if (actualData.user) {
        localStorage.setItem("userData", JSON.stringify(actualData.user));
      }

      toast.success(t('registerSuccess'));
    },
    onError: (error: any) => {
      let errorMessage = t('registerError');

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await authApi.getCountries();
        setCountries(response.data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      const fetchStates = async () => {
        try {
          const response = await authApi.getStatesByCountry(selectedCountryId);
          setStates(response.data || []);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };
      fetchStates();
    } else {
      setStates([]);
    }
  }, [selectedCountryId]);

  const handleLanguageChange = (value: string) => {
    // Toggle language if it's different from current
    if ((language === 'ar' && value === 'dark') || (language === 'en' && value === 'light')) {
      toggleLanguage();
    }
  };

  // Handle country change to reset city selection
  const handleCountryChange = (value: string) => {
    const countryId = parseInt(value);
    setValue('country_id', countryId);
    setValue('city_id', 0); // Reset city selection when country changes
  };

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data);
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
                      {t('registerTitle')}
                    </h1>
                    <Image src={"/Waving.png"} alt="test" width={24} height={38} />
                  </div>
                  <p className="text-[#616161] text-[16px] text-balance mt-[16]">
                    {t('registerSubtitle')}
                  </p>
                </div>
                
                <Field>
                  <div className={`flex items-center justify-${dir === 'rtl' ? 'end' : 'start'}`}>
                    <FieldLabel
                      htmlFor="name"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} text-[16px] font-400 text-[#212121]`}
                    >
                      {t('nameLabel')}
                    </FieldLabel>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('namePlaceholder')}
                    className={`${dir === 'rtl' ? 'text-right placeholder:text-[14px]' : 'text-left placeholder:text-[14px]'} ${errors.name ? 'border-red-500' : ''}`}
                    disabled={registerMutation.isPending}
                    {...register("name", {
                      required: t('nameRequired'),
                    })}
                  />
                  {errors.name && (
                    <FieldDescription className={`text-red-500 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[14px] mt-1`}>
                      {errors.name.message}
                    </FieldDescription>
                  )}
                </Field>
                
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
                    disabled={registerMutation.isPending}
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
                    disabled={registerMutation.isPending}
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
                    disabled={registerMutation.isPending}
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
                  <div className={`flex items-center justify-${dir === 'rtl' ? 'end' : 'start'}`}>
                    <FieldLabel
                      htmlFor="phone"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} text-[16px] font-400 text-[#212121]`}
                    >
                      {t('phoneLabel')}
                    </FieldLabel>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={t('phonePlaceholder')}
                    className={`${dir === 'rtl' ? 'text-right placeholder:text-[14px]' : 'text-left placeholder:text-[14px]'} ${errors.phone ? 'border-red-500' : ''}`}
                    disabled={registerMutation.isPending}
                    {...register("phone", {
                      required: t('phoneRequired'),
                      pattern: {
                        value: /^\d+$/,
                        message: t('phoneInvalid')
                      }
                    })}
                  />
                  {errors.phone && (
                    <FieldDescription className={`text-red-500 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[14px] mt-1`}>
                      {errors.phone.message}
                    </FieldDescription>
                  )}
                </Field>
                
                <Field>
                  <div className={`flex items-center justify-${dir === 'rtl' ? 'end' : 'start'}`}>
                    <FieldLabel
                      htmlFor="dial_code"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} text-[16px] font-400 text-[#212121]`}
                    >
                      {t('dialCodeLabel')}
                    </FieldLabel>
                  </div>
                  <Input
                    id="dial_code"
                    type="text"
                    placeholder={t('dialCodePlaceholder')}
                    className={`${dir === 'rtl' ? 'text-right placeholder:text-[14px]' : 'text-left placeholder:text-[14px]'} ${errors.dial_code ? 'border-red-500' : ''}`}
                    disabled={registerMutation.isPending}
                    {...register("dial_code", {
                      required: t('dialCodeRequired'),
                    })}
                  />
                  {errors.dial_code && (
                    <FieldDescription className={`text-red-500 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[14px] mt-1`}>
                      {errors.dial_code.message}
                    </FieldDescription>
                  )}
                </Field>
                
                <Field>
                  <div className={`flex items-center justify-${dir === 'rtl' ? 'end' : 'start'}`}>
                    <FieldLabel
                      htmlFor="country_id"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} text-[16px] font-400 text-[#212121]`}
                    >
                      {t('countryLabel')}
                    </FieldLabel>
                  </div>
                  <Select
                    value={watch("country_id")?.toString() || ""}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger
                      id="country_id"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} ${errors.country_id ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder={t('selectCountry')} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name_ar || country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country_id && (
                    <FieldDescription className={`text-red-500 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[14px] mt-1`}>
                      {errors.country_id.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <div className={`flex items-center justify-${dir === 'rtl' ? 'end' : 'start'}`}>
                    <FieldLabel
                      htmlFor="city_id"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} text-[16px] font-400 text-[#212121]`}
                    >
                      {t('cityLabel')}
                    </FieldLabel>
                  </div>
                  <Select
                    value={watch("city_id")?.toString() || ""}
                    onValueChange={(value) => setValue("city_id", parseInt(value))}
                    disabled={!selectedCountryId}
                  >
                    <SelectTrigger
                      id="city_id"
                      className={`${dir === 'rtl' ? 'text-right' : 'text-left'} ${errors.city_id ? 'border-red-500' : ''}`}
                    >
                      <SelectValue
                        placeholder={
                          !selectedCountryId
                            ? t('selectCountryFirst')
                            : t('selectCity')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name_ar || state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city_id && (
                    <FieldDescription className={`text-red-500 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-[14px] mt-1`}>
                      {errors.city_id.message}
                    </FieldDescription>
                  )}
                </Field>
                
                <Field>
                  <Button
                    type="submit"
                    className="h-[56px] rounded-[4px] bg-[#3F51B5] hover:bg-[#3f51b584] cursor-pointer w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <span>{t('loading')}</span>
                    ) : (
                      <span>{t('registerButton')}</span>
                    )}
                  </Button>
                </Field>
                
                <Field>
                  <div className={`flex items-center justify-center ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'} w-full`}>
                    <p className="text-[14px] font-medium text-[#616161]">
                      {t('alreadyHaveAccount')}
                    </p>
                    <Link
                      href="/"
                      className="text-[14px] font-bold underline text-[#3F51B5]"
                    >
                      {t('loginInstead')}
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