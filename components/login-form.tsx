"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SocialLoginButton } from "@/components/social-login-button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import toast from "react-hot-toast";
import { useI18n } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define TypeScript types for form data
type LoginFormValues = {
  email: string;
  password: string;
};

interface LoginApiResponse {
  status: number;
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
      is_guest?: boolean;
    };
    token: string;
  };
  message: string;
}

interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    is_guest?: boolean;
  };
  message?: string;
}

// Define a type for Axios error response
interface AxiosErrorData {
  message?: string;
  // Add other possible fields from the API response
  [key: string]: unknown;
}

interface AxiosConfig {
  transitional?: {
    silentJSONParsing: boolean;
    forcedJSONParsing: boolean;
    clarifyTimeoutError: boolean;
  };
  adapter?: string[];
  transformRequest?: unknown[];
  transformResponse?: unknown[];
  timeout?: number;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  maxContentLength?: number;
  maxBodyLength?: number;
  env?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  baseURL?: string;
  method?: string;
  url?: string;
  data?: unknown;
  allowAbsoluteUrls?: boolean;
  [key: string]: unknown;
}

interface AxiosResponse<T = AxiosErrorData> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, unknown>;
  config: AxiosConfig;
  request?: unknown;
}

interface AxiosError<T = AxiosErrorData> {
  config: AxiosConfig;
  code?: string;
  request?: unknown;
  response?: AxiosResponse<T>;
  message?: string;
  name?: string;
  stack?: string;
  isAxiosError: boolean;
  status?: number;
}

export function LoginForm({
  className,
  onSubmit,
  onSuccess,
  onError,
  ...props
}: React.ComponentProps<"form"> & {
  onSubmit?: (data: LoginFormValues) => void;
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: AxiosError) => void;
}) {
  const { t, dir } = useI18n();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormValues) =>
      authApi.login(credentials) as Promise<LoginResponse>,
    onSuccess: (response) => {
      // Handle different response structures for regular login vs guest login
      // Regular login returns: {status: 200, data: {user, token}, message: "Login successful"}
      // Guest login returns: {token, user, message}

      // Extract actual data based on response structure
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

      // Show success toast
      toast.success(actualData.message || t("loginSuccess"));

      try {
        // Securely store the token and user data in localStorage
        if (actualData.token) {
          localStorage.setItem("authToken", actualData.token);

          // Verify that the token was stored successfully
          const storedToken = localStorage.getItem("authToken");
          if (!storedToken || storedToken !== actualData.token) {
            throw new Error("Failed to store authentication token securely");
          }
        }

        if (actualData.user) {
          localStorage.setItem("userData", JSON.stringify(actualData.user));
        }

        // Only redirect after token is successfully stored
        // Handle successful login
        if (onSuccess) {
          onSuccess(actualData);
        } else {
          // Redirect to home page after successful login
          router.push("/home");
        }
      } catch (storageError) {
        console.error("Error storing authentication data:", storageError);
        toast.error(t("loginError"));

        // Clear any partially stored data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    },
    onError: (error: AxiosError) => {
      // Handle AxiosError specifically to extract meaningful message
      let errorMessage = t("loginError");

      if (error?.response?.data?.message) {
        // Server responded with error message
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        // Check if it's an Axios error with status
        if (error.status === 401) {
          errorMessage = t("unauthorized");
        } else if (error.status === 400) {
          errorMessage = t("badRequest");
        } else if (error.message?.includes("401")) {
          errorMessage = t("unauthorized");
        } else {
          errorMessage = error.message;
        }
      } else if (error?.code) {
        // Handle specific error codes
        if (error.code === "ERR_NETWORK") {
          errorMessage = t("networkError");
        } else if (error.code === "ERR_BAD_REQUEST") {
          errorMessage = t("badRequest");
        }
      }

      // Show error toast with extracted message
      toast.error(errorMessage);

      // Handle login error
      if (onError) {
        onError(error);
      } else {
        console.error("Login failed:", error);
      }
    },
  });

  const guestLoginMutation = useMutation({
    mutationFn: () => authApi.guestLogin() as Promise<LoginResponse>,
    onSuccess: (response) => {
      // Handle different response structures for regular login vs guest login
      // Regular login returns: {status: 200, data: {user, token}, message: "Login successful"}
      // Guest login returns: {token, user, message}

      // Extract actual data based on response structure
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

      // Show success toast
      toast.success(
        actualData.message || t("guestLoginSuccess") || t("loginSuccess"),
      );

      try {
        // Securely store the token and user data in localStorage
        if (actualData.token) {
          localStorage.setItem("authToken", actualData.token);

          // Verify that the token was stored successfully
          const storedToken = localStorage.getItem("authToken");
          if (!storedToken || storedToken !== actualData.token) {
            throw new Error("Failed to store authentication token securely");
          }
        }

        if (actualData.user) {
          localStorage.setItem("userData", JSON.stringify(actualData.user));
        }

        // Only redirect after token is successfully stored
        // Handle successful guest login
        if (onSuccess) {
          onSuccess(actualData);
        } else {
          // Redirect to home page after guest login
          router.push("/home");
        }
      } catch (storageError) {
        console.error("Error storing authentication data:", storageError);
        toast.error(t("guestLoginError") || t("loginError"));

        // Clear any partially stored data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    },
    onError: (error: AxiosError) => {
      // Handle AxiosError specifically to extract meaningful message
      let errorMessage = t("guestLoginError") || t("loginError");

      if (error?.response?.data?.message) {
        // Server responded with error message
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        // Check if it's an Axios error with status
        if (error.status === 401) {
          errorMessage = t("unauthorized");
        } else if (error.status === 400) {
          errorMessage = t("badRequest");
        } else if (error.message?.includes("401")) {
          errorMessage = t("unauthorized");
        } else {
          errorMessage = error.message;
        }
      } else if (error?.code) {
        // Handle specific error codes
        if (error.code === "ERR_NETWORK") {
          errorMessage = t("networkError");
        } else if (error.code === "ERR_BAD_REQUEST") {
          errorMessage = t("badRequest");
        }
      }

      // Show error toast with extracted message
      toast.error(errorMessage);

      // Handle guest login error
      if (onError) {
        onError(error);
      } else {
        console.error("Guest login failed:", error);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
  });

  const onFormSubmit = handleSubmit((data) => {
    // Call the parent onSubmit if provided, otherwise call the API
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Call the API using React Query mutation
      loginMutation.mutate(data);
    }
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onFormSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <div
            className={`flex items-center justify-center ${dir === "rtl" ? "flex-row-reverse" : "flex-row"} gap-[16px]`}
          >
            <h1 className="text-[32px] font-700 text-[#161616]">
              {t("welcomeTitle")}
            </h1>
            <Image src={"/Waving.png"} alt="test" width={24} height={38} />
          </div>
          <p className="text-[#616161] text-[16px] text-balance mt-[16]">
            {t("welcomeMessage")}
          </p>
        </div>
        <FieldSeparator>{t("loginVia")}</FieldSeparator>
        <div className="flex items-center gap-[12px]">
          <SocialLoginButton
            provider="apple"
            onClick={() => toast.error(t("featureComingSoon"))}
          />
          <SocialLoginButton
            provider="google"
            onClick={() => toast.error(t("featureComingSoon"))}
          />
        </div>
        <Field>
          <div
            className={`flex items-center justify-${dir === "rtl" ? "start" : "end"}`}
          >
            <FieldLabel
              htmlFor="email"
              className={`${dir === "rtl" ? "text-right" : "text-right"} text-[16px] font-400 text-[#212121]`}
            >
              {t("emailLabel")}
            </FieldLabel>
          </div>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            className={`${dir === "rtl" ? "text-right placeholder:text-[14px]" : "text-left placeholder:text-[14px]"} ${errors.email ? "border-red-500" : ""}`}
            disabled={loginMutation.isPending}
            {...register("email", {
              required: t("emailRequired"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("emailInvalid"),
              },
            })}
          />
          {errors.email && (
            <FieldDescription
              className={`text-red-500 ${dir === "rtl" ? "text-right" : "text-left"} text-[14px] mt-1`}
            >
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <div
            className={`flex items-center justify-${dir === "rtl" ? "start" : "end"}`}
          >
            <FieldLabel
              htmlFor="password"
              className={`${dir === "rtl" ? "text-right" : "text-left"} text-[16px] font-400 text-[#212121]`}
            >
              {t("passwordLabel")}
            </FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            placeholder={t("passwordPlaceholder")}
            className={`${dir === "rtl" ? "text-right placeholder:text-[14px]" : "text-left placeholder:text-[14px]"} ${errors.password ? "border-red-500" : ""}`}
            disabled={loginMutation.isPending}
            {...register("password", {
              required: t("passwordRequired"),
              minLength: {
                value: 6,
                message: t("passwordMinLength"),
              },
            })}
          />
          {errors.password && (
            <FieldDescription
              className={`text-red-500 ${dir === "rtl" ? "text-right" : "text-left"} text-[14px] mt-1`}
            >
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>
        <Link
          href="/forgot-password"
          className={`${dir === "rtl" ? "ml-auto" : "mr-auto"} text-[14px] font-medium underline-offset-4 underline text-[#3F51B5]`}
        >
          {t("forgotPassword")}
        </Link>
        <Field>
          <Button
            type="submit"
            className="h-[56px] rounded-[4px] bg-[#3F51B5] hover:bg-[#3f51b584] cursor-pointer"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <span>{t("loading")}</span>
              </>
            ) : (
              <>
                <Image
                  src={"/login_icon.png"}
                  alt="test"
                  width={20}
                  height={20}
                />
                {t("loginButton")}
                <Image
                  src={"/language-circle.png"}
                  alt="test"
                  width={20}
                  height={20}
                />
              </>
            )}
          </Button>
        </Field>

        {/* Guest Login Button */}
        <Field>
          <Button
            type="button"
            variant="outline"
            className="h-[56px] rounded-[4px] border border-[#3F51B5] text-[#3F51B5] hover:bg-[#3F51B5]/10 cursor-pointer"
            disabled={guestLoginMutation.isPending}
            onClick={() => guestLoginMutation.mutate()}
          >
            {guestLoginMutation.isPending ? (
              <>
                <span>{t("loading")}</span>
              </>
            ) : (
              <>{t("guestLoginButton")}</>
            )}
          </Button>
        </Field>

        <Field>
          <div
            className={`flex items-center justify-center ${dir === "rtl" ? "flex-row-reverse" : "flex-row"} w-full`}
          >
            <p className="text-[14px] font-medium text-[#616161]">
              {t("noAccount")}
            </p>
            <Link
              href="/register"
              className="text-[14px] font-bold underline text-[#3F51B5]"
            >
              {t("createAccount")}
            </Link>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
