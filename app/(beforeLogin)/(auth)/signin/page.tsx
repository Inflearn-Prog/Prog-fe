"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { STATIC_IMAGES } from "@/lib/static-image";

import { AuthProvider } from "../constant";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: AuthProvider) => {
    try {
      setIsLoading(true);
      await signIn(provider, { callbackUrl: "/auth-callback" });
    } catch {
      alert("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-12 flex flex-col h-full">
      <main className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex flex-col gap-8">
          <p className="text-3xl text-center font-bold">
            로그인하고 서비스를 이용하세요
          </p>
          <div className="flex flex-col col-span-4 gap-2">
            <button
              type="button"
              className="flex py-2 gap-2 shadow-md items-center justify-center bg-[#F9DB00] rounded-[6px]"
              onClick={() => handleSocialLogin(AuthProvider.KAKAO)}
              disabled={isLoading}
            >
              <Image {...STATIC_IMAGES.kakao} />
              <p className="font-bold text-sm ">카카오로 로그인</p>
            </button>
            <button
              type="button"
              className="flex py-2 gap-2 shadow-md items-center justify-center bg-[#01C73C] rounded-[6px]"
              onClick={() => handleSocialLogin(AuthProvider.NAVER)}
              disabled={isLoading}
            >
              <Image {...STATIC_IMAGES.naver} />
              <p className="font-bold text-sm ">네이버로 로그인</p>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-center">간편하게 회원가입 하기</p>
            <div className="flex flex-row items-center justify-center gap-4">
              <button
                type="button"
                className="flex p-2 shadow-md items-center justify-center bg-[#F9DB00] rounded-full"
                onClick={() => handleSocialLogin(AuthProvider.KAKAO)}
                disabled={isLoading}
              >
                <Image {...STATIC_IMAGES.kakao} />
              </button>
              <button
                type="button"
                className="flex p-2 shadow-md items-center justify-center bg-[#01C73C] rounded-full"
                onClick={() => handleSocialLogin(AuthProvider.NAVER)}
                disabled={isLoading}
              >
                <Image {...STATIC_IMAGES.naver} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
