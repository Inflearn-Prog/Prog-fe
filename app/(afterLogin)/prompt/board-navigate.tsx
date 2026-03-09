"use client";

import { ArrowLeftIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { BaseButton } from "@/components/shared/button";

export default function BoardNavigate() {
  const layout =
    "mx-auto max-w-7xl lg:px-0 px-5 min-w-90 mx-auto flex-1 flex items-center justify-between py-3";

  const pathname = usePathname();
  const isEditPage = pathname.includes("/edit");

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="bg-white mb-15">
      <div className={layout}>
        <div className="flex items-center gap-x-5">
          <button onClick={handleGoBack}>
            <ArrowLeftIcon className="size-9" />
          </button>
          <h2 className="heading-medium">
            {isEditPage ? "게시글 수정하기" : "게시글 작성하기"}
          </h2>
        </div>

        <BaseButton className="label-medium" variant="secondary">
          임시저장된 글(1)
        </BaseButton>
      </div>
    </div>
  );
}
