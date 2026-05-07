"use client";

import { ArrowLeftIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function BoardNavigate() {
  const layout =
    "max-w-7xl lg:px-0 px-5 min-w-90 mx-auto flex-1 flex items-center py-3";

  const pathname = usePathname();
  const isEditPage = pathname.includes("/edit");

  const router = useRouter();

  return (
    <div className="bg-white mb-15">
      <div className={layout}>
        <div className="flex items-center gap-x-5">
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="size-9" />
          </button>
          <h2 className="heading-medium">
            {isEditPage ? "게시글 수정하기" : "게시글 작성하기"}
          </h2>
        </div>
      </div>
    </div>
  );
}
