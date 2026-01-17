"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/routes";

import { BaseButton } from "../shared/button";
import { Empty, EmptyDescription, EmptyTitle } from "../ui/empty";

export function SearchEmpty() {
  const router = useRouter();
  const handleClick = () => router.push(ROUTES.community.WRITE);
  return (
    <Empty className="gap-y-7">
      <Image
        src="/images/empty-prog.svg"
        alt="empty search"
        width={64}
        height={64}
      />
      <div className="flex flex-col gap-y-5">
        <EmptyTitle className="heading-medium">
          아직 이 분야의 '치트키'는 발견되지 않았어요!
        </EmptyTitle>
        <EmptyDescription className="body-medium">
          첫 번째 개척자가 되어 지식을 공유해주시겠어요?
        </EmptyDescription>
      </div>
      <BaseButton className="min-w-[197px]" onClick={handleClick}>
        글쓰기
      </BaseButton>
    </Empty>
  );
}
