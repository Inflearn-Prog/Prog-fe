"use client";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface ProfIconProps {
  src: string | StaticImport;
  width: number;
  height: number;
  alt: string;
  className?: string;
}

// 공통 스타일
const BASE_CONTAINER_STYLE = "flex flex-col gap-4 text-center items-center";
const BASE_IMAGE_STYLE =
  "rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-300";

export function ProfIcon({
  src,
  width,
  height,
  alt,
  className,
}: ProfIconProps) {
  return (
    <div className={BASE_CONTAINER_STYLE}>
      <div className={cn(BASE_IMAGE_STYLE, className)}>
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          className="rounded-full"
        />
      </div>
    </div>
  );
}
