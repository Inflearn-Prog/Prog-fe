import { ImageProps } from "next/image";

// StaticImages 객체는 이미지 정보를 타입 안전하게 관리합니다.
export const STATIC_IMAGES: Record<
  string,
  Pick<ImageProps, "src" | "alt" | "width" | "height" | "priority">
> = {
  logo: {
    src: "/images/logo.svg",
    alt: "Prog Logo",
    width: 44,
    height: 48,
    priority: true,
  },
};
