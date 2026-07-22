"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, stringToColor } from "@/lib/utils";

interface ProfIconProps {
  src: string | null;
  width: number;
  height: number;
  alt: string;
  className?: string;
  fallback: string;
}

// 공통 스타일
const BASE_IMAGE_STYLE =
  "rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden";

export function ProfIcon({
  src,
  width,
  height,
  alt,
  className,
  fallback,
}: ProfIconProps) {
  const safeFallback = fallback || "U";
  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(safeFallback);

  // 2. 언어별 글자 수 제한 로직
  // 한글이 포함되어 있으면 1글자, 영문/기타는 2글자 (모두 대문자 처리)
  const displayFallback = isKorean
    ? safeFallback.slice(0, 1)
    : safeFallback.slice(0, 2).toUpperCase();

  const bgColor = stringToColor(safeFallback);

  return (
    <Avatar
      style={{
        width: className?.includes("w-") ? undefined : `${width}px`,
        height: className?.includes("h-") ? undefined : `${height}px`,
      }}
      className={cn(BASE_IMAGE_STYLE, className)}
    >
      <AvatarImage
        src={src || ""}
        alt={alt}
        draggable={false}
        className="select-none object-cover"
      />
      <AvatarFallback
        style={{ backgroundColor: bgColor }}
        className="display-small md:display-large"
      >
        {displayFallback}
      </AvatarFallback>
    </Avatar>
  );
}
