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
  sort?: string;
}

export const getUserPrompts = async ({
  userId,
  page = 0,
  size = 4,
  sort = "",
}: GetUserPromptsParams): Promise<UserPromptsResponse> => {
  return await fetcher
    .get(`users/${userId}/prompts`, {
      searchParams: { page, size, sort },
    })
    .json<UserPromptsResponse>();
};

export const getLikedPrompts = async ({
  userId,
  page = 0,
  size = 4,
  sort = "",
}: GetUserPromptsParams): Promise<UserPromptsResponse> => {
  return await fetcher
    .get(`users/${userId}/liked`, {
      searchParams: { page, size, sort },
    })
    .json<UserPromptsResponse>();
};

export interface UpdateProfileRequest {
  basicInfo: {
    nickname: string;
    introduction: string;
  };
  careerInfo: {
    currentStatuses: string[];
    targetJobRoles: string[];
    careerYears: number;
    educationLevel: string;
  };
  selfIntro: {
    experiences: string[];
    keywords: string[];
  };
}

export const updateUserProfile = async (data: UpdateProfileRequest) => {
  return await fetcher
    .put("users/me/profile", { json: data })
    .json<ApiResponse<{ message: string }>>();
};

interface WithdrawTermsResponse {
  userId: number;
  withdrawnTermIds: number[];
  message: string;
}

export const withdrawTerms = async (data: { termIds: number[] }) => {
  return await fetcher
    .delete("/users/me/terms-agreements", { json: data })
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
