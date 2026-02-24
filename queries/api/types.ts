import {
  EDUCATION_OPTIONS,
  STATE_VALUES,
} from "@/app/(beforeLogin)/(auth)/constant";
import { ApiResponse } from "@/lib/fetcher";

// 마이페이지 유저 정보 응답타입
export type StateKey = keyof typeof STATE_VALUES;
export type EducationValue = (typeof EDUCATION_OPTIONS)[number]["value"];

export interface BasicInfo {
  uid: string | number;
  nickname: string;
  email: string;
  provider: "KAKAO" | "NAVER";
  introduction: string | null;
}

export interface CareerInfo {
  currentStatus: StateKey[];
  targetJob: string[];
  careerYear: string;
  education: EducationValue;
  major: string;
}

export interface SelfIntro {
  experiences: string[];
  keywords: string[];
}

export interface UserProfileData {
  basicInfo: BasicInfo;
  careerInfo: CareerInfo;
  selfIntro: SelfIntro;
}

export type UserProfileResponse = ApiResponse<UserProfileData>;

// 마이페이지 좋아요한 프롬프트 리스트 응답타입
export interface PromptItem {
  promptId: number;
  title: string;
  description: string;
  hasPreview: boolean;
  canCopy: boolean;
  createdAt: string;
  isLiked: boolean;
}

export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface UserPromptsData {
  content: PromptItem[];
  pageInfo: PageInfo;
}

export type UserPromptsResponse = ApiResponse<UserPromptsData>;
