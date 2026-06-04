"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { ROUTES } from "@/lib/routes";

export function BackToListNav() {
  const router = useRouter();

  const handleClick = useCallback(() => {
    // 같은 탭에 이전 기록이 있으면 직전 화면(쿼리/스크롤 유지)으로 복귀.
    // 직접 진입(새 탭/주소 입력)이면 history.length === 1 이므로 커뮤니티로 이동.
    // document.referrer는 App Router의 클라이언트 네비게이션에서 갱신되지 않아 사용하지 않는다.
    if (window.history.length > 1) {
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
