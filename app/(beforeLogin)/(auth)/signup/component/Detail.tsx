"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSignupStore } from "@/app/store/signUpStore";
import { BaseButton } from "@/components/shared/button";
import { SectionHeader } from "@/components/shared/section-header";
import { usePutCareer } from "@/hooks/use-onboarding";

import { JobType, STATE_VALUES } from "../../constant";
import { StatusSelect } from "./StatusSelect";
import { Stepper } from "./Stepper";
import { TargetJobsSelect } from "./TargetJobsSelect";

export default function Detail() {
  const router = useRouter();
  const { mutate, isPending } = usePutCareer();

  const [otherInput, setOtherInput] = useState("");
  const {
    isTermsAgreed,
    nickname,
    targetJobs,
    setTargetJobs,
    currentState,
    updateField,
  } = useSignupStore();

  useEffect(() => {
    if (!isTermsAgreed) {
      router.replace("/signup?step=select");
      return;
    }

    if (!nickname) {
      router.replace("/signup?step=pick-option");
      alert("닉네임 설정이 완료되지 않았습니다.");
    }
  }, [isTermsAgreed, nickname, router]);

  const isStep3Complete =
    currentState !== "" &&
    (currentState !== STATE_VALUES.OTHER ||
      (otherInput || "").trim().length > 0);

  const handleJobClick = (option: string) => {
    const castedOption = option as JobType;
    const isSelected = targetJobs.includes(castedOption);

    if (isSelected) {
      setTargetJobs(targetJobs.filter((j) => j !== castedOption));
    } else {
      setTargetJobs([...targetJobs, castedOption]);
    }
  };

  const handleNext = () => {
    if (isStep3Complete) {
      const finalStatus =
        currentState === STATE_VALUES.OTHER ? otherInput.trim() : currentState;

      const userCareerInfo = {
        currentStatuses: [finalStatus],
        targetJobRoles: targetJobs,
      };
      mutate(userCareerInfo, {
        onSuccess: () => {
          router.push("?step=preview");
        },
        onError: (error) => {
          // eslint-disable-next-line no-console
          console.error("커리어 정보 저장 실패:", error.message);
        },
      });
    }
  };

  return (
    <div>
      <Stepper currentStep={"detail"} />
      <SectionHeader
        title={"어떤 커리어를 꿈꾸시나요?"}
        subtitle={"선택한 내용은 이후에도 변경이 가능해요!"}
        className="mb-6"
      />
      <div className="flex flex-col gap-6 mb-10">
        <StatusSelect
          value={currentState}
          otherValue={otherInput}
          onSelect={(val) => {
            updateField("currentState", val);
            if (val !== STATE_VALUES.OTHER) setOtherInput("");
          }}
          onOtherChange={setOtherInput}
        />

        <TargetJobsSelect selectedJobs={targetJobs} onToggle={handleJobClick} />
      </div>

      <div className="mx-auto lg:w-[55%]">
        <BaseButton
          onClick={handleNext}
          disabled={!isStep3Complete || isPending}
          className="w-full mt-6 py-3"
        >
          다음
        </BaseButton>
      </div>
    </div>
  );
}
