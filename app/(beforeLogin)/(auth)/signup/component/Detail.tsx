"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSignupStore } from "@/app/store/signUpStore";
import { BaseButton } from "@/components/shared/button";
import { SectionHeader } from "@/components/shared/section-header";
import { usePutCareer } from "@/hooks/use-onboarding";

import { StatusSelect } from "./StatusSelect";
import { Stepper } from "./Stepper";
import { TargetJobsSelect } from "./TargetJobsSelect";

export default function Detail() {
  const router = useRouter();
  const { mutate, isPending } = usePutCareer();

  const [otherInput, setOtherInput] = useState("");
  const { targetJobs, setTargetJobs, currentState, updateField } =
    useSignupStore();
  const isStateValid =
    currentState !== "" &&
    (currentState !== "기타" || (otherInput || "").trim().length > 0);
  const isStep3Complete = isStateValid && targetJobs.length > 0;

  const handleJobClick = (option: string) => {
    const isSelected = targetJobs.includes(option);
    if (isSelected) {
      setTargetJobs(targetJobs.filter((j) => j !== option));
    } else {
      setTargetJobs([...targetJobs, option]);
    }
  };

  const handleNext = () => {
    if (isStep3Complete) {
      //전송 로직
      const finalStatus = currentState === "기타" ? otherInput : currentState;

      const userCareerInfo = {
        currentStatuses: [finalStatus],
        targetJobRoles: targetJobs,
      };
      mutate(userCareerInfo, {
        onSuccess: () => {
          router.push("?step=preview");
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
            if (val !== "기타") setOtherInput("");
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
