import { ApiResponse, fetcher } from "@/lib/fetcher";

import { UserProfileData, UserPromptsResponse } from "./types";

export const getUserProfile = async () => {
  return await fetcher
    .get(`users/me/profile`)
    .json<ApiResponse<UserProfileData>>();
};

interface GetUserPromptsParams {
  userId: string | number;
  page?: number;
  size?: number;
}

export const getUserPrompts = async ({
  userId,
  page = 0,
  size = 4,
}: GetUserPromptsParams): Promise<UserPromptsResponse> => {
  return await fetcher
    .get(`users/${userId}/prompts`, {
      searchParams: { page, size },
    })
    .json<UserPromptsResponse>();
};

export const getLikedPrompts = async ({
  userId,
  page = 0,
  size = 4,
}: GetUserPromptsParams): Promise<UserPromptsResponse> => {
  return await fetcher
    .get(`users/${userId}/liked`, {
      searchParams: { page, size },
    })
    .json<UserPromptsResponse>();
};

export interface UpdateProfileRequest {
  basicInfo?: {
    nickname?: string | null;
    introduction?: string | null;
  };
  careerInfo?: {
    currentStatus?: string[] | null;
    targetJob?: string[] | null;
    careerYear?: number | null;
    education?: string | null;
  };
  selfIntro?: {
    experiences?: string[] | null;
    keywords?: string[] | null;
  };
}

export const updateUserProfile = async (data: UpdateProfileRequest) => {
  return await fetcher
    .patch("users/me/profile", { json: data })
    .json<ApiResponse<{ message: string }>>();
};

interface WithdrawTermsResponse {
  userId: number;
  withdrawnTermIds: number[];
  message: string;
}

export const withdrawTerms = async (data: { termIds: number[] }) => {
  return await fetcher
    .delete("users/me/terms-agreements", { json: data })
    .json<ApiResponse<WithdrawTermsResponse>>();
};

// 개별 약관 동의 정보
interface AgreedTerm {
  termId: number;
  title: string;
  isRequired: boolean;
  agreedAt: string;
}

// data 필드의 전체 구조
interface AgreedTermsData {
  userId: number;
  agreedTerms: AgreedTerm[];
}

// 최종 API 응답 형태
interface AgreedTermsResponse {
  success: boolean;
  code: string;
  data: AgreedTermsData;
  timestamp: string;
}

export const getAgreedTerms = async (): Promise<AgreedTermsResponse> => {
  return await fetcher
    .get("users/me/terms-agreements")
    .json<AgreedTermsResponse>();
};
