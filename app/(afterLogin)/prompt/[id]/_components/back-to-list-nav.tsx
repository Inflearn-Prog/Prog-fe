"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { ROUTES } from "@/lib/routes";

export function BackToListNav() {
  const router = useRouter();

  const handleClick = useCallback(() => {
    const hasPrevPage =
      typeof window !== "undefined" &&
      window.history.length > 1 &&
      document.referrer.includes(window.location.origin);

    if (hasPrevPage) {
      router.back();
    } else {
      router.push(ROUTES.community.ROOT);
    }
  }, [router]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2 py-4 hover:opacity-70 transition-opacity"
    >
      <ArrowLeft size={24} className="text-gray-900" />
      <span className="heading-small text-gray-900">게시글 전체보기</span>
    </button>
  );
}
