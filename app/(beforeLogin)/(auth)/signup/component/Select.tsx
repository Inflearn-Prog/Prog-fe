"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { useSignupStore } from "@/app/store/signUpStore";
import { BaseButton } from "@/components/shared/button";
import { SectionHeader } from "@/components/shared/section-header";
import { ProgTerms } from "@/components/terms/terms-check";
import { usePostTerms, useTerms } from "@/hooks/use-terms-checks";

export default function Select() {
  const router = useRouter();
  const { data, isLoading, error, isError } = useTerms();
  const { data: session, update } = useSession();
  const { mutate, isPending } = usePostTerms();
  const [checks, setChecks] = useState<Map<number, boolean>>(new Map());
  const { updateField } = useSignupStore();
  const termsList = data?.terms || [];

  const isAllChecked = termsList.every((t) => checks.get(t.termId));
  const isAllRequiredChecked = termsList
    .filter((t) => t.isRequired)
    .every((t) => checks.get(t.termId));

  if (isLoading) return <div>약관을 불러오는 중...</div>;
  if (isError) return <div>{error.message}</div>;

  const handleAllCheck = (checked: boolean) => {
    const newMap = new Map();
    termsList.forEach((term) => {
      newMap.set(term.termId, checked);
    });
    setChecks(newMap);
  };
  const handleSingleCheck = (id: number, checked: boolean) => {
    const newMap = new Map(checks);
    newMap.set(id, checked);
    setChecks(newMap);
  };
  const handleNext = () => {
    //전송 로직
    const agreedTermIds = Array.from(checks.entries())
      .filter(([_, checked]) => checked)
      .map(([id, _]) => id);

    mutate(agreedTermIds, {
      onSuccess: async () => {
        await update({
          ...session,
          registrationStatus: "TERMS_AGREED", // 백엔드 상태와 맞춤
        });
        updateField("isTermsAgreed", true);
        router.push("?step=pick-option");
      },
      onError: () => {
        toast.error("약관 저장 실패:");
      },
    });
  };
  return (
    <div>
      <SectionHeader
        title={"환영합니다!"}
        subtitle={"서비스 이용약관에 동의해주세요"}
        className="mb-6"
      />
      <ProgTerms
        terms={termsList}
        checks={checks}
        isAllChecked={isAllChecked}
        onAllCheck={handleAllCheck}
        onSingleCheck={handleSingleCheck}
      />
      <div className="mx-auto lg:w-[66%]">
        <BaseButton
          onClick={handleNext}
          disabled={!isAllRequiredChecked || isPending}
          full={true}
          className="mt-6 py-3"
        >
          다음
        </BaseButton>
      </div>
    </div>
  );
}
