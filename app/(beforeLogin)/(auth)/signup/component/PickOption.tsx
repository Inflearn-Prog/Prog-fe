"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useSignupStore } from "@/app/store/signUpStore";
import { ProfIcon } from "@/components/profile-icon/profile-icon";
import { BaseButton } from "@/components/shared/button";
import { BaseInput } from "@/components/shared/inputs";
import { SectionHeader } from "@/components/shared/section-header";
import { ValidationMessage } from "@/components/shared/validation-message";
import { usePostNickname } from "@/hooks/use-onboarding";
import { cn } from "@/lib/utils";

import { Stepper } from "./Stepper";

interface ApiError extends Error {
  code?: string;
  status?: number;
}

export default function PickOption() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { mutate, isPending } = usePostNickname();

  const {
    nickname,
    setNickname,
    selectedProfileType,
    setSelectedProfileType,
    profileImage,
    provider,
    updateField,
    isTermsAgreed,
  } = useSignupStore();

  useEffect(() => {
    if (!isTermsAgreed) {
      router.replace("?step=select");
      alert("약관 동의를 먼저 완료해주세요.");
    }
  }, [isTermsAgreed, router]);

  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  const isStep2Complete = selectedProfileType !== null;

  // 닉네임이 수정되면 중복 확인 상태 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setDuplicateMessage("");
    setIsAvailable(false);

    if (value.length > 2 && !/^[a-zA-Z0-9가-힣]+$/.test(value)) {
      setDuplicateMessage(
        "닉네임은 2글자 이상, 한글, 영문, 숫자만 입력 가능합니다."
      );
      return;
    }
  };

  const handleNext = () => {
    if (isStep2Complete) {
      mutate(
        { params: nickname },
        {
          onSuccess: async () => {
            await update({
              ...session,
              registrationStatus: "NICKNAME_REGISTERED",
            });
            updateField("nickname", nickname);
            setIsAvailable(true);
            setDuplicateMessage("사용 가능한 닉네임입니다.");
            router.push("?step=pick-option");
          },
          onError: (error: ApiError) => {
            const errorCode = error.code;
            switch (errorCode) {
              case "NICKNAME_ALREADY_USED":
                setDuplicateMessage("이미 사용 중인 닉네임입니다.");
                setIsAvailable(false);
                break;
              case "INVALID_NICKNAME_FORMAT":
                setDuplicateMessage(
                  "닉네임 형식이 올바르지 않습니다. (최대 12자)"
                );
                setIsAvailable(false);
                break;
              case "NICKNAME_CHANGE_TOO_FREQUENT":
                toast.error("닉네임은 24시간 이내에 다시 변경할 수 없습니다.");
                break;
              case "USER_NOT_FOUND":
                toast.error(
                  "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요."
                );
                break;
              default:
                toast.error("닉네임 등록 중 오류가 발생했습니다.");
            }
          },
        }
      );
      router.push("?step=detail"); // 다음 단계로 이동
    }
  };

  useEffect(() => {
    if (session?.user) {
      if (session.user.image && !profileImage) {
        updateField("profileImage", session.user.image);
      }

      if (session.provider && !provider) {
        updateField("provider", session.provider.toUpperCase());
      }
    }
  }, [session, profileImage, provider, updateField]);

  return (
    <div>
      <Stepper currentStep={"pick-option"} />
      <SectionHeader
        title={"Prog에서 어떻게 불리고 싶으신가요?"}
        subtitle={"이름과 프로필 사진을 선택해주세요."}
        className="mb-6"
      />

      {/* 프로필 선택 영역 */}
      <div className="flex gap-6 md:gap-12 mb-5 md:mb-10 items-center justify-center">
        {/* 소셜(SOCIAL) 프로필 */}
        <div className="flex flex-col gap-2 md:gap-4 text-center">
          <button
            onClick={() => setSelectedProfileType("SOCIAL")}
            type="button"
            aria-label="소셜 프로필 선택"
            aria-pressed={selectedProfileType === "SOCIAL"}
            className={cn(
              "rounded-full transition-all duration-300",
              selectedProfileType === "SOCIAL" && "ring-8 ring-frog-600"
            )}
          >
            <ProfIcon
              src={profileImage}
              width={180}
              height={180}
              alt={nickname}
              fallback={nickname}
              className="w-[7.5rem] h-[7.5rem] md:w-[11.25rem] md:h-[11.25rem]"
            />
          </button>
          <p className="body-small !font-semibold">
            {provider === "KAKAO"
              ? "카카오톡"
              : provider === "NAVER"
                ? "네이버"
                : "소셜"}{" "}
            프로필
          </p>
        </div>

        {/* 기본(DEFAULT) 프로필 */}
        <div className="flex flex-col gap-4 text-center">
          <button
            onClick={() => setSelectedProfileType("DEFAULT")}
            type="button"
            aria-label="Prog 프로필 선택"
            aria-pressed={selectedProfileType === "DEFAULT"}
            className={cn(
              "rounded-full transition-all duration-300",
              selectedProfileType === "DEFAULT" && "ring-8 ring-frog-600"
            )}
          >
            <ProfIcon
              src=""
              width={180}
              height={180}
              alt={nickname}
              fallback={nickname}
              className="size-[7.5rem] md:size-[11.25rem]"
            />
          </button>
          <p className="body-small !font-semibold">Prog 프로필</p>
        </div>
      </div>

      {/* 닉네임 입력 영역 */}
      <div className="flex flex-col w-full items-center justify-center">
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <BaseInput
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={handleNicknameChange}
              viewLength={true}
              maxLength={12}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="w-full mt-2 md:my-2 min-h-6">
          {duplicateMessage && (
            <ValidationMessage
              message={duplicateMessage}
              messageType={isAvailable ? "success" : "error"}
              name="validation-input"
            />
          )}
        </div>
      </div>

      {/* 하단 다음 버튼 */}
      <div className="mx-auto lg:w-[55%]">
        <BaseButton
          onClick={handleNext}
          disabled={!isStep2Complete || isPending}
          className="w-full mt-6 py-3"
        >
          다음
        </BaseButton>
      </div>
    </div>
  );
}
