"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { BaseButton } from "@/components/shared/button";

import { CTA_LINKS } from "./constant";

export function CtaSection() {
  const router = useRouter();

  return (
    <section id="cta-section" className="py-16 md:py-20 px-5">
      <div className="inner flex flex-center">
        <BaseButton
          onClick={() => router.push(CTA_LINKS.explore)}
          size="lg"
          className="gap-2 px-10 h-14 text-17 text-white bg-frog-600 hover:bg-frog-700 rounded-[6px]"
        >
          PROG와 함께 커리어 시작하기
          <ArrowRight className="size-5" />
        </BaseButton>
      </div>
    </section>
  );
}
