"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { BaseButton } from "@/components/shared/button";
import { SectionHeader } from "@/components/shared/section-header";
import { usePostComplete } from "@/hooks/use-onboarding";
import { STATIC_IMAGES } from "@/lib/static-image";

export default function Complete() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { mutate, isPending } = usePostComplete();

  const handleNext = () => {
    mutate(undefined, {
      onSuccess: async () => {
        await update({
          registrationStatus: "ONBOARDING_COMPLETED",
          user: {
            accessToken: session?.accessToken,
          },
        });
        router.push("/");
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
