import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toasts } from "@/components/shared/toast";
import { ApiError } from "@/lib/fetcher";
import {
  getLikedPrompts,
  getUserProfile,
  getUserPrompts,
  UpdateProfileRequest,
  updateUserProfile,
} from "@/queries/api/mypage";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => getUserProfile(),
    select: (response) => response.data,
    throwOnError: (error) => error instanceof ApiError && error.status >= 500,
  });
};

interface UseUserPromptsProps {
  userId: string | number;
  page: number;
  size?: number;
}

export const useUserPrompts = ({
  userId,
  page,
  size = 4,
}: UseUserPromptsProps) => {
  return useQuery({
    queryKey: ["user", "prompts", userId, { page, size }],
    queryFn: () => getUserPrompts({ userId, page, size }),
    placeholderData: (previousData) => previousData,
    select: (response) => response.data,
  });
};
export const useLikedPrompts = (userId: string | number, page: number) => {
  return useQuery({
    queryKey: ["user", "likes", userId, { page }],
    queryFn: () => getLikedPrompts({ userId, page }),
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      toasts.success("프로필 정보가 성공적으로 저장되었습니다.");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        // 401 권한 없음 (세션 만료) 처리
        if (error.status === 401) {
          //toasts.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          // router.push('/login'); // 필요시 이동
          return;
        }
        // 그 외 서버가 보내준 메시지 표시
        //toasts.error(error.message || "오류가 발생했습니다.");
      } else {
        // 네트워크 단절 등 예상치 못한 일반 에러
        //toasts.error("네트워크 상태를 확인해주세요.");
        console.error("네트워크 상태를 확인해주세요.");
      }

      console.error(`[${error.name}]`, error.message);
    },
  });
};
