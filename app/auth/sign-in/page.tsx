"use client";

import Image from "next/image";
import { NAVER_AUTH_CONFIG, KAKAO_AUTH_CONFIG } from "../constants/auth";
import TopBar from "../../component/TopBar";

export default function Signin() {
  const onNaverLogin = () => {
    const randomState = Math.random().toString(36).substring(7);
    sessionStorage.setItem("naver_state", randomState);
    window.location.href = NAVER_AUTH_CONFIG.authUrl(randomState);
  };

  const onKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_CONFIG.authUrl;
  };

  return (
    <div className="grid grid-cols-12 min-h-screen w-full bg-gray-50">
      {/* 헤더 섹션 */}
      <header className="col-span-12 h-fit border-b border-gray-100 bg-white shadow-sm z-10">
        <TopBar />
      </header>

      {/* 메인 로그인 섹션 */}
      <main className="col-start-1 col-end-13 md:col-start-4 md:col-end-10 lg:col-start-5 lg:col-end-9 flex flex-col items-center px-6">
        <div className="flex w-full flex-col gap-10">
          <p className="display-small text-center text-gray-900">
            로그인하고 <br className="sm:hidden" /> 서비스를 이용하세요
          </p>

          {/* 로그인 버튼 섹션 */}
          <div className="flex flex-col gap-3 w-full max-w-[360px] mx-auto">
            {/* 카카오 버튼 */}
            <button
              type="button"
              onClick={onKakaoLogin}
              className="flex py-3.5 gap-2 shadow-sm items-center justify-center bg-[#F9DB00] rounded-[6px] hover:brightness-95 transition-all"
            >
              <Image src="/kakao_icon.svg" height={20} width={20} alt="kakao icon" />
              <p className="label-medium font-bold text-gray-950">카카오로 로그인</p>
            </button>

            {/* 네이버 버튼 */}
            <button
              type="button"
              onClick={onNaverLogin}
              className="flex py-3.5 gap-2 shadow-sm items-center justify-center bg-[#03C75A] rounded-[6px] hover:brightness-95 transition-all"
            >
              <Image src="/naver_icon.svg" height={20} width={20} alt="naver icon" />
              <p className="label-medium font-bold text-white">네이버로 로그인</p>
            </button>
          </div>

          {/* 하단 섹션 */}
          <div className="flex flex-col gap-8 w-full mx-auto">
            <div className="flex flex-col gap-5">
              <p className="text-center body-small text-gray-600">간편하게 회원가입 하기</p>
              
              <div className="flex flex-row items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={onKakaoLogin}
                  className="flex w-12 h-12 shadow-md items-center justify-center bg-[#F9DB00] rounded-full hover:scale-110 transition-transform flex-shrink-0"
                >
                  <Image src="/kakao_icon.svg" height={24} width={24} alt="kakao icon" />
                </button>
                <button
                  type="button"
                  onClick={onNaverLogin}
                  className="flex w-12 h-12 shadow-md items-center justify-center bg-[#03C75A] rounded-full hover:scale-110 transition-transform flex-shrink-0"
                >
                  <Image src="/naver_icon.svg" height={24} width={24} alt="naver icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}