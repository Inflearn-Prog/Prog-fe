"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { BaseButton } from "@/components/shared/button";

import { CTA_LINKS } from "./constant";

export function MobileBottomCta() {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 px-5 py-3 safe-area-bottom">
      <BaseButton
        onClick={() => router.push(CTA_LINKS.explore)}
        shape="round"
        full
        size="lg"
        className="gap-2"
      >
        프로그와 함께 커리어 시작하기
        <ArrowRight className="size-4" />
      </BaseButton>
    </div>
  );
}
