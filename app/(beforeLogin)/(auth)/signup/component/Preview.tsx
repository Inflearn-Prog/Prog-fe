"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useSignupStore } from "@/app/store/signUpStore";
import { BaseButton } from "@/components/shared/button";
import { BaseInput } from "@/components/shared/inputs";
import { SectionHeader } from "@/components/shared/section-header";
import { SelectBox } from "@/components/shared/select-box";
import { usePutBasic } from "@/hooks/use-onboarding";

import { EDUCATION_OPTIONS, FIELD_OPTIONS } from "../constant";
import { Stepper } from "./Stepper";

export default function Preview() {
  const router = useRouter();
  const { mutate, isPending } = usePutBasic();
  const { data: session, update } = useSession();

  const { field, career, educationLevel, updateField } = useSignupStore();

  const isCareerValid = !isNaN(Number(career)) && Number(career) >= 0;
  const isStep4Complete =
    educationLevel !== "" && field !== "" && isCareerValid;

  const handleNext = async () => {
    if (isStep4Complete) {
      //전송 로직
      const token = session?.accessToken;

      if (!token) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        return;
      }
      const userBasicInfo = {
        education: educationLevel,
        major: field,
        career: career,
      };
      mutate(
        { params: userBasicInfo, token: token },
        {
          onSuccess: async () => {
            try {
              await update({
                user: {
                  ...session?.user,
                  isNewUser: false,
                  name: session?.user?.name ?? undefined,
                  image: session?.user?.image ?? undefined,
                },
              });

              router.push("?step=complete");
            } catch (e) {
              console.error("세션 업데이트 실패:", e);
            }
          },
          onError: (error) => {
            // eslint-disable-next-line no-console
            console.error("기본 정보 저장 실패:", error.message);
          },
        }
      );
    }
  };

  return (
    <div>
      <Stepper currentStep={"preview"} />
      <SectionHeader
        title={"자세한 정보를 알려주세요"}
        subtitle={"프로그와 함께 멋진 미래를 그려봐요!"}
        className="mb-6"
      />

      <div className="flex flex-col gap-4 mb-10">
        {/* 최종학력 선택 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">최종학력</label>
          <SelectBox
            placeholder="학력을 선택해주세요"
            value={educationLevel}
            onValueChange={(val) => updateField("educationLevel", val)}
            selectOptions={EDUCATION_OPTIONS}
          />
        </div>

        {/* 계열 선택 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">계열</label>
          <SelectBox
            placeholder="계열을 선택해주세요"
            value={field}
            onValueChange={(val) => updateField("field", val)}
            selectOptions={FIELD_OPTIONS}
          />
        </div>

        {/* 총 경력 입력 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">총 경력</label>
          <BaseInput
            placeholder="예) 3 (숫자만 입력)"
            inputMode="numeric"
            value={career}
            viewLength={true}
            maxLength={100}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = value.replace(/[^0-9]/g, "");
              updateField(
                "career",
                numericValue === "" ? 0 : Number(numericValue)
              );
            }}
          />
        </div>
      </div>

      <div className="mx-auto lg:w-[55%]">
        <BaseButton
          onClick={handleNext}
          disabled={!isStep4Complete || isPending}
          className="w-full mt-6 py-3"
        >
          가입완료
        </BaseButton>
      </div>
    </div>
  );
}
