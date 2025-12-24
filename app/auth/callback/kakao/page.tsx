"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function KakaoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code"); 
  useEffect(() => {
    if (code) {
      fetch(`/api/auth/kakao?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.isNewUser) {
            // 신규 유저라면 추가 정보 입력 페이지로 보냄
            // 소셜 정보를 세션이나 쿠키에 잠시 보관했다가 최종 회원가입 시 사용
            router.push("/auth/signup");
          } else {
            // 기존 유저라면 메인 페이지로 보냄
            router.push("/");
          }
        });
    }
  }, [code]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>로그인 처리 중입니다...</p>
    </div>
  );
}