"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useSignupStore } from "@/app/store/signUpStore";
import { BaseButton } from "@/components/shared/button";
import { SectionHeader } from "@/components/shared/section-header";
import { usePostComplete } from "@/hooks/use-onboarding";
import { ROUTES } from "@/lib/routes";
import { STATIC_IMAGES } from "@/lib/static-image";

export default function Complete() {
  const router = useRouter();
  const { mutate, isPending } = usePostComplete();

  const {
    isTermsAgreed,
    nickname,
    targetJobs,
    currentState,
    isRegistrationSuccess,
  } = useSignupStore();

  useEffect(() => {
    if (!isTermsAgreed) {
      router.replace("/signup?step=select");
      return;
    }

    if (!nickname) {
      router.replace("/signup?step=pick-option");
      return;
    }

    if (!targetJobs && !currentState) {
      router.replace("/signup?step=detail");
      return;
    }

    if (!isRegistrationSuccess) {
      // 가입 절차를 거치지 않고 URL로 들어온 경우 첫 단계로 튕겨냄
      router.replace("/signup?step=select");
    }
  }, [
    isTermsAgreed,
    nickname,
    targetJobs,
    currentState,
    isRegistrationSuccess,
    router,
  ]);

  const handleNext = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.push(ROUTES.rank.ROOT);
        toast.success("회원가입이 완료되었습니다!");
      },
      onError: () => {
        toast.error("회원가입 완료 실패");
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <Image
          className="mb-4"
          {...STATIC_IMAGES.logo}
          width={110}
          height={120}
        />
      </div>
      <SectionHeader
        title={
          <>
            <span className="text-frog-600">Prog</span>와 함께하게
            <br />
            되신 것을 환영합니다!
          </>
        }
        subtitle={
          <>
            회원가입이 성공적으로 완료되었습니다.
            <br />
            나에게 딱 맞는 프롬프트로 커리어 여정을
            <br />
            지금 바로 시작해보세요!
          </>
        }
        className="mb-8"
      />

      <div className="mx-auto lg:w-[55%]">
        <BaseButton
          onClick={handleNext}
          disabled={isPending}
          className="w-full mt-6 py-3"
        >
          Prog 시작하기
        </BaseButton>
      </div>
    </div>
  );
}
