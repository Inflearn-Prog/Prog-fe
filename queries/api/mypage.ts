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
    currentStatus: string;
    targetJob: string[];
    careerYear: number;
    education: string;
    major: string;
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
