"use client";

import PromptCard from "@/components/prompt/prompt-card";
import { useGetPrompts } from "@/hooks/use-prompt-list";

export interface Prompt {
  id: string;
  category: string;
  title: string;
  content: string;
  userIcon: string;
  userName: string;
  userDesc: string;
  rank?: number; // 랭킹 페이지이므로 추가
  likes?: number;
  bookmarks?: number;
}

export default function RankingList({ category }: { category: string }) {
  const { data: prompts } = useGetPrompts(category);

  return (
    <div className="flex flex-col gap-4">
      {prompts?.map((prompt: Prompt) => (
        <PromptCard key={prompt.id} {...prompt} />
      ))}
    </div>
  );
}
