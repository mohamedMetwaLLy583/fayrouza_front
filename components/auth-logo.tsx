import Image from "next/image";
import { ComponentProps } from "react";

type AuthLogoProps = {
  width?: number | string;
  height?: number | string;
} & Omit<ComponentProps<typeof Image>, "width" | "height">;

export const AuthLogo = ({
  width: logoWidth = 200,
  height: logoHeight = 200,
  className = "",
  src = "/AuthLogo.png",
  alt = "Auth Logo",
  ...props
}: AuthLogoProps) => {
  const parsedWidth =
    typeof logoWidth === "string" ? parseInt(logoWidth) : logoWidth;
  const parsedHeight =
    typeof logoHeight === "string" ? parseInt(logoHeight) : logoHeight;

  return (
    <Image
      width={parsedWidth}
      height={parsedHeight}
      quality={70}
      src={src}
      alt={alt}
      className={className}
      {...props}
    />
  );
};
