"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import { STATIC_IMAGES } from "@/lib/static-image";

export default function SignInPage() {
  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/auth-callback" });
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
              onClick={() => handleSocialLogin("kakao")}
            >
              <Image {...STATIC_IMAGES.kakao} />
              <p className="font-bold text-sm ">카카오로 로그인</p>
            </button>
            <button
              type="button"
              className="flex py-2 gap-2 shadow-md items-center justify-center bg-[#01C73C] rounded-[6px]"
              onClick={() => handleSocialLogin("naver")}
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
                onClick={() => handleSocialLogin("kakao")}
              >
                <Image {...STATIC_IMAGES.kakao} />
              </button>
              <button
                type="button"
                className="flex p-2 shadow-md items-center justify-center bg-[#01C73C] rounded-full"
                onClick={() => handleSocialLogin("naver")}
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
