"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NaverCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      fetch(`/api/auth/naver?code=${code}&state=${state}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.isNewUser) {
            // 신규 유저라면 추가 정보 입력 페이지로 보냄
            // 소셜 정보를 세션이나 쿠키에 잠시 보관했다가 최종 회원가입 시 사용
            router.push("/auth/signup");
          } else {
            // 이미 가입된 회원이면 로그인 성공 처리 후 메인으로
            router.push("/");
          }
        })
        .catch((err) => console.error("네이버 로그인 실패:", err));
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>로그인 처리 중입니다...</p>
    </div>
  );
}