"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import UserProfile from "@/components/mypage/user-profile";
import { BaseButton } from "@/components/shared/button";

interface UserData {
  nickname: string;
  email: string;
  profileImage: string;
  introduction: string;
  provider: "KAKAO" | "NAVER";
}

export default function MypageLeftSection() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        //나중에 다른것들처럼 mock api생성 후 연결 예정
        // 테스트용 더미 데이터
        setUserData({
          nickname: "개구리",
          email: "frog@example.com",
          profileImage: "",
          introduction: "반갑습니다!",
          provider: "KAKAO",
        });
      } catch (error) {
        console.error("유저 정보 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      try {
        //로그아웃 호출

        alert("로그아웃 되었습니다.");
        router.push("/"); //로그아웃되고 어느 페이지로 이동?
        router.refresh();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!userData) return <div>유저 정보가 없습니다.</div>;

  const handleWithdraw = async () => {
    const isConfirmed = confirm(
      "정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
    );

    if (isConfirmed) {
      try {
        // 탈퇴 기능 호출
        alert("회원 탈퇴가 완료되었습니다.");
        router.push("/");
      } catch (error) {
        alert("탈퇴 처리 중 오류가 발생했습니다.");
      }
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <UserProfile
        nickname={userData.nickname}
        email={userData.email}
        profileImage={userData.profileImage}
        provider={userData.provider}
        introduction={userData.introduction}
      />

      <BaseButton
        onClick={handleLogout}
        variant={"secondary"}
        className="bg-gray-0"
      >
        로그아웃
      </BaseButton>

      <button onClick={handleWithdraw} className="text-error">
        계정 탈퇴
      </button>
    </div>
  );
}
