"use client";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { AuthProvider } from "@/app/(beforeLogin)/(auth)/constant";
import UserProfile from "@/components/mypage/user-profile";
import { BaseButton } from "@/components/shared/button";
import { toasts } from "@/components/shared/toast";
import { useUserProfile } from "@/hooks/use-mypage";
import { ROUTES } from "@/lib/routes";
import { deleteUserAccount, postLogout } from "@/queries/api/auth";

import MypageLeftSkeleton from "./MypageLeftSkeleton";

export default function MypageLeftSection() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useUserProfile();

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      try {
        await postLogout();

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        queryClient.clear();
        toasts.success("로그아웃 되었습니다.");
        router.push(ROUTES.rank.ROOT);
        router.refresh();
      } catch (error) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        console.error("Logout failed:", error);
        //TODO: error 컴포넌트가 생기면 사용자 피드백 주기
        alert("로그아웃 처리 중 오류가 발생했습니다.");
        //toasts.error("로그아웃 처리 중 오류가 발생했습니다.");
      }
    }
  };

  const handleWithdraw = async () => {
    const isConfirmed = confirm(
      "정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
    );

    if (!isConfirmed || !userData) return;

    try {
      await deleteUserAccount(userData.basicInfo.uid);

      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      queryClient.clear();

      toasts.success("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      router.push(ROUTES.rank.ROOT);
      router.refresh();
    } catch (error) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      console.error("Withdrawal failed:", error);
      alert("탈퇴 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요.");
      //toasts.error("탈퇴 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요.");
    }
  };

  // 로딩 및 에러 처리
  if (isLoading) return <MypageLeftSkeleton />;
  if (!userData)
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 p-6 border border-gray-100 bg-gray-0 rounded-[10px] shadow-md">
          유저 정보가 없습니다.
        </div>
        <BaseButton onClick={() => router.push(ROUTES.auth.SIGNIN)}>
          로그인하러 가기
        </BaseButton>
      </div>
    );

  const { basicInfo } = userData;

  return (
    <div className="flex flex-col gap-5">
      <UserProfile
        nickname={basicInfo.nickname}
        email={basicInfo.email}
        profileImage={""}
        provider={basicInfo.provider.toLowerCase() as AuthProvider}
        introduction={basicInfo.introduction ?? "반갑습니다!"}
      />

      <BaseButton
        onClick={handleLogout}
        variant={"secondary"}
        className="bg-gray-0"
      >
        로그아웃
      </BaseButton>

      <button
        onClick={handleWithdraw}
        className="text-error label-small opacity-60 hover:opacity-100 transition-opacity"
      >
        계정 탈퇴
      </button>
    </div>
  );
}
