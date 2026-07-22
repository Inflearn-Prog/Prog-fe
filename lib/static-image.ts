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
  toastSuccess: {
    src: "/images/toast-success.svg",
    alt: "Toast Success Icon",
    width: 22,
    height: 24,
    priority: false,
  },
  kakao: {
    src: "/images/kakao_icon.svg",
    alt: "Kakao Login Icon",
    width: 20,
    height: 20,
    priority: false,
  },
  naver: {
    src: "/images/naver_icon.svg",
    alt: "Naver Login Icon",
    width: 20,
    height: 20,
    priority: false,
  },
};
