"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useSignupStore } from "@/app/store/signUpStore";
import { ProfIcon } from "@/components/profile-icon/profile-icon";
import { BaseButton } from "@/components/shared/button";
import { BaseInput } from "@/components/shared/inputs";
import { SectionHeader } from "@/components/shared/section-header";
import { ValidationMessage } from "@/components/shared/validation-message";
import { cn } from "@/lib/utils";
import { nicknameCheck } from "@/queries/api/nickname-check";

import { Stepper } from "./Stepper";

interface ApiError extends Error {
  code?: string;
  status?: number;
}

export default function PickOption() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    nickname,
    setNickname,
    selectedProfileType,
    setSelectedProfileType,
    profileImage,
    provider,
    updateField,
  } = useSignupStore();

  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isNicknameValid = nickname.length >= 2;
  const isStep2Complete = isAvailable && selectedProfileType !== null;

  const checkDuplicate = async () => {
    if (!isNicknameValid || isLoading) return;

    setIsLoading(true);
    setDuplicateMessage("");

    const token = session?.accessToken;

    if (!token) {
      setDuplicateMessage("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      setIsAvailable(false);
      return;
    }

    try {
      const isAvailable = await nicknameCheck(nickname, session?.accessToken);

      if (isAvailable) {
        setDuplicateMessage("사용 가능한 닉네임입니다.");
        setIsAvailable(true);
      }
    } catch (error: unknown) {
      setIsAvailable(false);

      const apiError = error as ApiError;
      if (apiError.status === 409) {
        setDuplicateMessage("이미 사용 중인 닉네임입니다.");
      } else if (apiError.status === 400) {
        setDuplicateMessage("올바르지 않은 닉네임 형식입니다.");
      } else {
        setDuplicateMessage(
          apiError.message || "알 수 없는 오류가 발생했습니다."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 닉네임이 수정되면 중복 확인 상태 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setDuplicateMessage("");
    setIsAvailable(false);
  };

  const handleNext = () => {
    if (isStep2Complete) {
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
      <div className="flex gap-12 mb-10 items-center justify-center">
        {/* 소셜(SOCIAL) 프로필 */}
        <div className="flex flex-col gap-4 text-center">
          <button
            onClick={() => setSelectedProfileType("SOCIAL")}
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
              disabled={isLoading}
            />
          </div>
          <BaseButton
            type="button"
            className="min-w-[100px]"
            disabled={!isNicknameValid || isLoading}
            onClick={checkDuplicate}
          >
            중복확인
          </BaseButton>
        </div>

        <div className="w-full my-2 min-h-6">
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
          disabled={!isStep2Complete}
          className="w-full mt-6 py-3"
        >
          다음
        </BaseButton>
      </div>
    </div>
  );
}
