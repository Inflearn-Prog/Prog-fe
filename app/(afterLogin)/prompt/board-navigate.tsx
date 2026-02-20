"use client";

import { ArrowLeftIcon } from "lucide-react";

import { BaseButton } from "@/components/shared/button";

export default function BoardNavigate() {
  const layout =
    "mx-auto max-w-7xl lg:px-0 px-5 min-w-90 mx-auto flex-1 flex items-center justify-between";
  return (
    <div className={layout}>
      <div className="flex items-center gap-x-5">
        <button>
          <ArrowLeftIcon className="size-9" />
        </button>
        <h2 className="heading-medium">게시글 작성하기</h2>
      </div>

      <BaseButton className="label-medium" variant="secondary">
        임시저장된 글(1)
      </BaseButton>
    </div>
  );
}
