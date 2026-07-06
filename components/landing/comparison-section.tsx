import { Check, Frown, Smile, X } from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";

import { COMPARISON_NEW, COMPARISON_OLD } from "./constant";

export function ComparisonSection() {
  return (
    <section
      id="comparison-section"
      className="py-16 md:py-24 px-5 relative overflow-hidden"
    >
      <div className="inner">
        <SectionHeader
          title={
            <>
              제자리걸음이었던 커리어,
              <br />
              이제 <span className="text-frog-600">PROG</span>와 함께
              도약하세요.
            </>
          }
          subtitle="더 이상 빈 화면에서 고통받지 마세요. 이미 검증된 수많은 로그들이 당신의 발판이 되어드립니다."
          className="mb-12 md:mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* 기존 방식 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <Frown className="size-10 text-gray-700" strokeWidth={1.5} />
              <div className="flex flex-col">
                <h3 className="text-[22px] font-bold text-gray-800 tracking-tight">
                  기존 방식
                </h3>
                <p className="text-[14px] text-gray-700">
                  막연하고 고통스러운 작업 시간
                </p>
              </div>
            </div>

            <ul className="space-y-8">
              {COMPARISON_OLD.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="size-5 rounded-full bg-red-400 flex-center mt-1 shrink-0">
                    <X className="size-3 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-gray-700 tracking-tight">
                      {item.title}
                    </span>
                    <span className="text-[14px] text-gray-700 leading-relaxed">
                      {item.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* PROG와 함께 도약하기 */}
          <div className="rounded-2xl bg-frog-100 p-8 md:p-10 shadow-lg shadow-frog-200/20">
            <div className="flex items-center gap-4 mb-10">
              <Smile className="size-10 text-frog-600" strokeWidth={1.5} />
              <div className="flex flex-col">
                <h3 className="text-[22px] font-bold text-frog-600 tracking-tight">
                  PROG와 함께 도약하기
                </h3>
                <p className="text-[14px] text-frog-800">
                  데이터 기반의 논리적이고 빠른 결과
                </p>
              </div>
            </div>

            <ul className="space-y-8">
              {COMPARISON_NEW.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="size-5 rounded-full bg-frog-500 flex-center mt-1 shrink-0">
                    <Check className="size-3 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-frog-700 tracking-tight">
                      {item.title}
                    </span>
                    <span className="text-[14px] text-frog-800 leading-relaxed">
                      {item.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
