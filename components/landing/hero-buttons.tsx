"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { BaseButton } from "@/components/shared/button";

import { CTA_LINKS } from "./constant";

export function HeroButtons() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleExplore = () => {
    router.push(CTA_LINKS.explore);
  };

  const handleShare = () => {
    if (session?.user) {
      router.push(CTA_LINKS.share);
    } else {
      router.push(CTA_LINKS.login);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <BaseButton
          onClick={handleExplore}
          size="lg"
          className="gap-3 px-10 h-14 text-17 text-white shadow-lg shadow-frog-500/20 hover:shadow-xl transition-all bg-frog-600 hover:bg-frog-700 rounded-[6px]"
        >
          프롬프트 탐색하기
          <ArrowRight className="size-5" />
        </BaseButton>
        <BaseButton
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="px-10 h-14 text-17 text-gray-700 bg-white border-gray-200 hover:bg-gray-50 rounded-[6px]"
        >
          내 프롬프트 공유하기
        </BaseButton>
      </div>

      <p className="caption-medium text-gray-700 mt-4">
        가입 없이 프롬프트 탐색이 가능해요
      </p>
    </>
  );
}
