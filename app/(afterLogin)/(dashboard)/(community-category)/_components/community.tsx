"use client";

import { ThumbsUpIcon } from "lucide-react";
import Link from "next/link";

import { SearchEmpty } from "@/components/search/search-empty";
import { formatRelative } from "@/lib/datetime";
import { ROUTES } from "@/lib/routes";

import { CommunityPromptItem } from "../../_types/community-type";

interface CommunitySectionProps {
  prompts: CommunityPromptItem[];
  isLoading: boolean;
}

export function CommunitySection({
  prompts,
  isLoading,
}: CommunitySectionProps) {
  return (
    <div>
      {!isLoading && prompts.length === 0 ? (
        <div className="py-5.5">
          <SearchEmpty />
        </div>
      ) : (
        <div className="border p-5 rounded-10 bg-white mt-7">
          <CommunityList prompts={prompts} />
        </div>
      )}
    </div>
  );
}

export function CommunityList({ prompts }: { prompts: CommunityPromptItem[] }) {
  return (
    <ul className="divide-y divide-gray-100">
      {prompts.map((item) => (
        <li key={item.id}>
          <CommunityItem {...item} />
        </li>
      ))}
    </ul>
  );
}

export function CommunityItem(props: CommunityPromptItem) {
  return (
    <Link
      href={ROUTES.prompt.DETAIL(props.id.toString())}
      className="py-4 px-3 flex items-center justify-between text-black gap-x-5 hover:bg-gray-50 transition-colors"
    >
      <h3 className="label-large font-bold">
        {props.title} [{props.likeCount}]
      </h3>

      <div className="flex items-center label-small gap-x-4 text-gray-600">
        <p className="label-small p-0">{props.authorNickname}</p>
        <p className="label-small p-0">{formatRelative(props.createdAt)}</p>

        <div className="flex items-center gap-x-1.5">
          <ThumbsUpIcon size={18} fill={"currentColor"} strokeWidth={0} />
          <span className="font-medium">{props.likeCount}</span>
        </div>
      </div>
    </Link>
  );
}
