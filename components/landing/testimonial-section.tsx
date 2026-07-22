"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProfIcon } from "@/components/profile-icon/profile-icon";
import { SectionHeader } from "@/components/shared/section-header";

import { TESTIMONIAL_CARDS } from "./constant";

const TAG_COLORS = {
  blue: "bg-frog-100 text-frog-700",
  green: "bg-emerald-50 text-emerald-700",
  orange: "bg-amber-50 text-amber-700",
} as const;

export function TestimonialSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLDivElement>(
      "[data-testimonial-card]"
    )?.offsetWidth;
    const gap = 16;
    const distance = (cardWidth ?? 300) + gap;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section id="testimonial-section" className="py-16 md:py-20 bg-gray-50">
      <div className="inner px-5">
        <SectionHeader
          title="PROG 커뮤니티가 증명하는 도약의 가치"
          subtitle="먼저 도약한 선배들의 생생한 합격 로그를 확인하세요."
          className="mb-10"
        />

        <div className="relative">
          {/* 좌우 네비게이션 버튼 */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex-center size-10 rounded-full bg-white shadow-md border border-gray-100 transition-300 hover:bg-gray-50 hidden"
              aria-label="이전 카드 보기"
            >
              <ChevronLeft className="size-5 text-gray-600" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex-center size-10 rounded-full bg-white shadow-md border border-gray-100 transition-300 hover:bg-gray-50 hidden"
              aria-label="다음 카드 보기"
            >
              <ChevronRight className="size-5 text-gray-600" />
            </button>
          )}

          {/* 카드 슬라이더 */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto md:overflow-x-hidden scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:snap-none md:pb-0"
          >
            {TESTIMONIAL_CARDS.map((card) => (
              <TestimonialCard key={card.id} card={card} />
            ))}
          </div>

          {/* 모바일 인디케이터 */}
          <MobileIndicator />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  card,
}: {
  card: (typeof TESTIMONIAL_CARDS)[number];
}) {
  return (
    <div
      data-testimonial-card
      className="min-w-[280px] sm:min-w-[320px] max-w-[340px] md:min-w-0 md:max-w-none md:w-full flex-shrink-0 md:flex-shrink snap-start md:snap-none rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-4 transition-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* 상단 정보 */}
      <div className="flex items-center gap-3">
        <ProfIcon
          src={null}
          width={40}
          height={40}
          alt={card.name}
          fallback={card.name}
        />
        <div className="flex flex-col">
          <span className="text-[14px] text-gray-900 font-bold leading-none mb-1">
            {card.name}
          </span>
          <span className="text-[12px] text-gray-700 leading-none">
            {card.role}
          </span>
        </div>
      </div>

      <p className="text-[13px] text-gray-700 flex-1 leading-relaxed">
        &ldquo;{card.content}&rdquo;
      </p>

      {/* 하단 정보 */}
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-[10px] px-2 py-1 rounded bg-blue-50 text-blue-600 font-bold">
            {card.tag}
          </span>
        </div>
        <span className="text-[13px] text-gray-800 font-medium">
          {card.title}
        </span>
      </div>
    </div>
  );
}

function MobileIndicator() {
  return (
    <div className="flex md:hidden justify-center gap-1.5 mt-2">
      {TESTIMONIAL_CARDS.map((card) => (
        <div key={card.id} className="size-1.5 rounded-full bg-gray-300" />
      ))}
    </div>
  );
}
