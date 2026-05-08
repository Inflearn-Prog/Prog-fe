"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { AuthProvider } from "@/app/(beforeLogin)/(auth)/constant";
import { clearAuthCookies } from "@/app/actions/auth-actions";
import UserProfile from "@/components/mypage/user-profile";
import { BaseButton } from "@/components/shared/button";
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
        queryClient.clear();
        toast.success("로그아웃 되었습니다.");
      } catch {
        toast.error("로그아웃 처리 중 오류가 발생했습니다.");
      } finally {
        await signOut({
          callbackUrl: ROUTES.rank.ROOT,
          redirect: true,
        });
        queryClient.clear();
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

      await clearAuthCookies();
      queryClient.clear();

      toast.success("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      router.push(ROUTES.rank.ROOT);
      router.refresh();
    } catch {
      toast.error("탈퇴 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요.");
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
