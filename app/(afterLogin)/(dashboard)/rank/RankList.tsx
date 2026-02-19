"use client";

import { PromptBase } from "@/app/types/type";
import PromptCard from "@/components/prompt/prompt-card";
import { useGetPrompts } from "@/hooks/use-prompt-list";

export interface PromptInfo extends PromptBase {
  rank?: number;
  likes?: number;
  bookmarks?: number;
}

export default function RankingList({ category }: { category: string }) {
  const { data: prompts } = useGetPrompts(category);

  return (
    <div className="flex flex-col gap-4">
      {prompts?.map((prompt: PromptInfo) => (
        <PromptCard key={prompt.id} {...prompt} />
      ))}
    </div>
  );
}
