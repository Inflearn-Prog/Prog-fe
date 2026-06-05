import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/fetcher";
import { ROUTES } from "@/lib/routes";
import {
  getAgreedTerms,
  getLikedPrompts,
  getUserProfile,
  getUserPrompts,
  UpdateProfileRequest,
  updateUserProfile,
  withdrawTerms,
} from "@/queries/api/mypage";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => getUserProfile(),
    select: (response) => response.data,
    throwOnError: (error) =>
      error instanceof ApiError && error.httpStatus >= 500,
  });
};

interface UseUserPromptsProps {
  userId: string | number;
  page: number;
  size?: number;
  enabled?: boolean;
}

export const useUserPrompts = ({
  userId,
  page,
  size = 4,
  enabled = true,
}: UseUserPromptsProps) => {
  const backendPage = page - 1;
  return useQuery({
    queryKey: ["user", "prompts", userId, { page: backendPage, size }],
    queryFn: () => getUserPrompts({ userId, page: backendPage, size }),
    placeholderData: (previousData) => previousData,
    select: (response) => response.data,
    enabled: !!userId && enabled,
  });
};
export const useLikedPrompts = ({
  userId,
  page,
  size = 4,
  enabled = true,
}: UseUserPromptsProps) => {
  const backendPage = page - 1;
  return useQuery({
    queryKey: ["user", "likes", userId, { page: backendPage, size }],
    queryFn: () => getLikedPrompts({ userId, page: backendPage, size }),
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
    enabled: !!userId && enabled,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      toast.success("프로필 정보가 성공적으로 저장되었습니다.");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        if (error.httpStatus === 401) {
          toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          router.push(ROUTES.auth.SIGNIN);
          return;
        }
        // 그 외 서버가 보내준 메시지 표시
        toast.error(error.message || "오류가 발생했습니다.");
      } else {
        // 네트워크 단절 등 예상치 못한 일반 에러
        toast.error("네트워크 상태를 확인해주세요.");
      }
    },
  });
};

export const useWithdrawTerms = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { termIds: number[] }) => withdrawTerms(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "terms-agreements"],
      });
      queryClient.invalidateQueries({ queryKey: ["users", "me", "profile"] });
      toast.success("약관이 성공적으로 철회 완료되었습니다.");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        if (error.httpStatus === 401) {
          toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          router.push(ROUTES.auth.SIGNIN);
          return;
        }
        // 그 외 서버가 보내준 메시지 표시
        toast.error(error.message || "오류가 발생했습니다.");
      } else {
        // 네트워크 단절 등 예상치 못한 일반 에러
        toast.error("네트워크 상태를 확인해주세요.");
      }
    },
  });
};

export const useAgreedTerms = () => {
  return useQuery({
    queryKey: ["users", "me", "terms-agreements"],
    queryFn: getAgreedTerms,
    select: (response) => {
      const { agreedTerms, userId } = response.data;

      // 3번 마케팅 약관 동의 여부를 미리 계산
      const marketingTerm = agreedTerms.find((term) => term.termId === 3);
      const isMarketingAgreed = !!marketingTerm;

      return {
        userId,
        agreedTerms, // 전체 동의 리스트
        isMarketingAgreed, // 마케팅 동의 여부 (boolean)
        marketingAgreedAt: marketingTerm?.agreedAt, // 마케팅 동의 날짜
      };
    },
    // 로그인 기반 데이터이므로 세션 만료 등 에러 처리
    throwOnError: (error: ApiError) => {
      if (error.httpStatus === 401) {
        // 전역적인 로그아웃 처리나 리다이렉트 로직이 있다면 여기서 수행
        return true;
      }
      return false;
    },
  });
};
