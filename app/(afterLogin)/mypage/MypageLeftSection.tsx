"use client";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import UserProfile from "@/components/mypage/user-profile";
import { BaseButton } from "@/components/shared/button";
import { toasts } from "@/components/shared/toast";
import { useUserProfile } from "@/hooks/use-mypage";
import { deleteUserAccount, postLogout } from "@/queries/api/auth";

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
        router.push("/");
        router.refresh();
      } catch (error) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        console.error("Logout failed:", error);
        //TODO: error 컴포넌트가 생기면 사용자 피드백 주기
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
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Withdrawal failed:", error);
      //toasts.error("탈퇴 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요.");
    }
  };

  // 로딩 및 에러 처리
  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (!userData)
    return <div className="p-10 text-center">유저 정보가 없습니다.</div>;

  const { basicInfo } = userData;

  return (
    <div className="flex flex-col gap-5">
      <UserProfile
        nickname={basicInfo.nickname}
        email={basicInfo.email}
        profileImage={""}
        provider={basicInfo.provider}
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
