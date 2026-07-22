import { SelectOption } from "@/components/shared/select-box";

export enum AuthProvider {
  KAKAO = "kakao",
  NAVER = "naver",
}

export const STATE_VALUES = {
  STUDENT: "재학중",
  JOB_SEEKER: "취업 준비",
  CAREER_CHANGE_PREP: "이직 준비",
  ETC: "기타",
} as const;

export const JOB_DATA = {
  DEVELOPMENT: "개발",
  MARKETING_CONTENT: "마케팅/콘텐츠",
  SERVICE_PLANNING: "서비스 기획",
  HR_GA: "인사/총무",
  DESIGN: "디자인",
  ETC: "기타",
} as const;

export const STATE_MAP = new Map<string, string>(
  Object.entries(STATE_VALUES) as [string, string][]
);
export const JOB_MAP = new Map<string, string>(
  Object.entries(JOB_DATA) as [string, string][]
);
export const REVERSE_STATE_MAP = new Map<string, string>(
  (Object.entries(STATE_VALUES) as [string, string][]).map(([k, v]) => [v, k])
);
export const REVERSE_JOB_MAP = new Map<string, string>(
  (Object.entries(JOB_DATA) as [string, string][]).map(([k, v]) => [v, k])
);

export type StateType = (typeof STATE_VALUES)[keyof typeof STATE_VALUES];
export type StateKey = keyof typeof STATE_VALUES;
export type JobType = (typeof JOB_DATA)[keyof typeof JOB_DATA];
export type EducationValue =
  | "HIGH_SCHOOL"
  | "ASSOCIATE"
  | "BACHELOR"
  | "MASTER"
  | "DOCTORATE"
  | "NONE";

export const transformCareerInfoToState = (careerInfo: {
  currentStatuses: string[];
  targetJobRoles: string[];
  careerYears: string;
  educationLevel: string;
}) => {
  const firstStatus = careerInfo?.currentStatuses?.[0] || "";
  const stateInKorean = STATE_MAP.get(firstStatus) || "";

  const jobsInKorean = (careerInfo?.targetJobRoles || []).map(
    (code) => JOB_MAP.get(code) || code
  );

  const rawYear = careerInfo?.careerYears || "";
  const cleanYear = rawYear.replace("년차", "").trim();
  const parsed = Number(cleanYear);

  const careerNumber =
    rawYear === "신입" || !Number.isFinite(parsed) ? 0 : parsed;

  return {
    currentState: stateInKorean as "" | StateType,
    targetJobs: jobsInKorean as JobType[],
    career: careerNumber,
    educationLevel: (careerInfo?.educationLevel || "") as EducationValue,
  };
};

export const transformStateToPayload = (state: {
  currentState: string;
  otherInput?: string;
  targetJobs: string[];
}) => {
  const isOther = state.currentState === STATE_VALUES.ETC;
  const stateCode = isOther
    ? state.otherInput || "OTHER"
    : REVERSE_STATE_MAP.get(state.currentState) || state.currentState;

  const jobCodes = state.targetJobs.map(
    (label) => REVERSE_JOB_MAP.get(label) || label
  );

  return {
    currentStatuses: [String(stateCode)],
    targetJobRoles: jobCodes,
  };
};

export const transformState = (state: {
  currentState: string;
  otherInput?: string;
  targetJobs: string[];
  careerYears: number;
  educationLevel: string;
}) => {
  const isOther = state.currentState === STATE_VALUES.ETC;
  const stateCode = isOther
    ? state.otherInput || "OTHER"
    : REVERSE_STATE_MAP.get(state.currentState) || state.currentState;

  const jobCodes = state.targetJobs.map(
    (label) => REVERSE_JOB_MAP.get(label) || label
  );
  const parsed = Number(state.careerYears);
  const careerYears = !Number.isFinite(parsed) ? 0 : parsed;

  return {
    currentStatuses: [String(stateCode)],
    targetJobRoles: jobCodes,
    careerYears: careerYears,
    educationLevel: state.educationLevel as EducationValue,
  };
};

export const STATE_OPTIONS = Object.values(STATE_VALUES);
export const JOB_OPTIONS = Object.values(JOB_DATA);
export const EDUCATION_OPTIONS: SelectOption[] = [
  { label: "고등학교 졸업", value: "HIGH_SCHOOL" },
  { label: "전문대 졸업", value: "ASSOCIATE" },
  { label: "대학교 졸업", value: "BACHELOR" },
  { label: "석사 졸업", value: "MASTER" },
  { label: "박사 졸업", value: "DOCTORATE" },
  { label: "없음", value: "NONE" },
];
