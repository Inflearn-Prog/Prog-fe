import { SelectOption } from "@/components/shared/select-box";

export enum AuthProvider {
  KAKAO = "kakao",
  NAVER = "naver",
}

export const STATE_VALUES = {
  STUDENT: "재학중",
  JOB_SEEKER: "취업준비",
  CHANGING_JOB: "이직준비",
  EMPLOYED: "취업중",
  FREELANCER: "프리랜서",
  CAREER_BREAK: "휴직중",
  ETC: "기타",
} as const;

export const JOB_DATA = {
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  FULLSTACK: "풀스택",
  MOBILE: "모바일",
  DEVOPS: "데브옵스",
  DATA_ENGINEER: "데이터 엔지니어",
  AI_ML: "AI/머신러닝",
  SECURITY: "보안",
  QA: "QA",
  PM: "기획/PM",
  DESIGNER: "디자이너",
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
  currentStatus: string[];
  targetJob: string[];
  careerYear: string;
  education: string;
}) => {
  const stateInKorean = STATE_MAP.get(careerInfo.currentStatus[0]) || "";
  const jobsInKorean = careerInfo.targetJob.map(
    (code) => JOB_MAP.get(code) || code
  );
  const parsed = Number(careerInfo.careerYear);
  const careerNumber =
    careerInfo.careerYear === "신입" || !Number.isFinite(parsed) ? 0 : parsed;

  return {
    currentState: stateInKorean as "" | StateType,
    targetJobs: jobsInKorean as JobType[],
    career: careerNumber,
    educationLevel: careerInfo.education as EducationValue,
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
