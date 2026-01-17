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
  // 1. 한국어 포함 여부 확인 (정규식)
  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(fallback);

  // 2. 언어별 글자 수 제한 로직
  // 한글이 포함되어 있으면 1글자, 영문/기타는 2글자 (모두 대문자 처리)
  const displayFallback = isKorean
    ? fallback.slice(0, 1)
    : fallback.slice(0, 2).toUpperCase();

  const bgColor = stringToColor(fallback);

  return (
    <Avatar
      style={{ width: `${width}px`, height: `${height}px` }}
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
        className="display-large"
      >
        {displayFallback}
      </AvatarFallback>
    </Avatar>
  );
}
