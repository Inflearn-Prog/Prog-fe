"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { LikedPrompt, MyPrompt } from "@/app/types/type";
import {
  LikedArticleCard,
  MyArticleCard,
} from "@/components/mypage/articleCard";
import { toasts } from "@/components/shared/toast";
import { cn } from "@/lib/utils";

export default function MypageActivitySection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSub = searchParams.get("sub") || "liked";

  const handleSubTabChange = (sub: "liked" | "posted") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sub", sub);
    router.push(`/mypage?${params.toString()}`, { scroll: false });
  };

  const handleCopy = async (e: React.MouseEvent, content: string) => {
    e.stopPropagation(); // 카드의 onClick이 실행되지 않도록 차단
    try {
      await navigator.clipboard.writeText(content);
      toasts.success("프롬프트가 클립보드에 복사되었습니다!");
    } catch {
      alert("복사에 실패했습니다.");
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/prompts/${id}`);
  };

  // 실제 API 데이터 구조에 맞춘 임시 데이터
  // 1. 좋아요 한 프롬프트 데이터
  const mockLikedPrompts = [
    {
      promptId: 1024,
      title: "좋아요 - 자소서를 위한 GPT 프롬프트",
      description: "이 프롬프트는 좋아요 탭에서만 보입니다.",
      isLiked: true,
    },
    {
      promptId: 1025,
      title: "좋아요 - 면접 대비 프롬프트",
      description: "상세한 설명이 들어가는 영역입니다.",
      isLiked: true,
    },
  ];

  // 2. 내가 게시한 프롬프트 데이터 (createdAt 포함)
  const mockMyPrompts = [
    {
      promptId: 2048,
      title: "게시글 - 나만의 비밀 프롬프트",
      description: "내가 직접 작성해서 게시한 프롬프트입니다.",
      createdAt: "2026-02-18T10:00:00", // n시간 전/일 전 테스트용
    },
    {
      promptId: 2049,
      title: "게시글 - 효율적인 코딩 프롬프트",
      description: "코딩 효율을 200% 높여주는 마법의 문장들.",
      createdAt: "2026-01-20T13:50:00",
    },
  ];
  const currentList = activeSub === "liked" ? mockLikedPrompts : mockMyPrompts;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 서브 탭 메뉴 */}
      <div className="flex w-full bg-gray-0 border border-gray-100 rounded-[8px] overflow-hidden p-1 shadow-sm">
        <button
          onClick={() => handleSubTabChange("liked")}
          className={cn(
            "flex-1 py-2.5 label-medium !font-bold transition-all rounded-[6px]",
            activeSub === "liked"
              ? "bg-blue-600 text-gray-0 shadow-sm"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          좋아요한 프롬프트
        </button>
        <button
          onClick={() => handleSubTabChange("posted")}
          className={cn(
            "flex-1 py-2.5 label-medium !font-bold transition-all rounded-[6px]",
            activeSub === "posted"
              ? "bg-blue-600 text-gray-0 shadow-sm"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          게시한 프롬프트
        </button>
      </div>

      {/* 리스트 영역 */}
      <div className="flex flex-col gap-4">
        {activeSub === "liked"
          ? (mockLikedPrompts as LikedPrompt[]).map((prompt) => (
              <LikedArticleCard
                key={prompt.promptId}
                title={prompt.title}
                content={prompt.description}
                onCopy={(e) => handleCopy(e, prompt.description)}
                onClick={() => handleCardClick(prompt.promptId)}
              />
            ))
          : (mockMyPrompts as MyPrompt[]).map((prompt) => (
              <MyArticleCard
                key={prompt.promptId}
                title={prompt.title}
                content={prompt.description}
                createdAt={prompt.createdAt}
                onClick={() => handleCardClick(prompt.promptId)}
              />
            ))}
      </div>
    </div>
  );
}
