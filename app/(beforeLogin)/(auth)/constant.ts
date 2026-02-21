import { SelectOption } from "@/components/shared/select-box";

export enum AuthProvider {
  KAKAO = "kakao",
  NAVER = "naver",
}

export const STATE_VALUES = {
  STUDENT: "재학중",
  JOB_SEEKER: "취업준비",
  CHANGING_JOB: "이직준비",
  OTHER: "기타",
} as const;

export const JOB_DATA = {
  PLANNING: "기획",
  MARKETING: "마케팅",
  DESIGN: "디자인",
  DEVELOPMENT: "개발",
  SALES: "영업",
  PM: "PM",
  OTHER: "기타",
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
  | "DOCTOR";

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
  targetJobs: string[];
  career: number;
  educationLevel: string;
}) => {
  const stateCode =
    REVERSE_STATE_MAP.get(state.currentState) || state.currentState;
  const jobCodes = state.targetJobs.map(
    (label) => REVERSE_JOB_MAP.get(label) || label
  );

  return {
    currentStatus: stateCode,
    targetJob: jobCodes,
    careerYear: state.career,
    education: state.educationLevel,
  };
};

export const STATE_OPTIONS = Object.values(STATE_VALUES);
export const JOB_OPTIONS = Object.values(JOB_DATA);
export const EDUCATION_OPTIONS: SelectOption[] = [
  { label: "고등학교 졸업", value: "HIGH_SCHOOL" },
  { label: "전문대 졸업", value: "ASSOCIATE" },
  { label: "대학교 졸업", value: "BACHELOR" },
  { label: "석사 졸업", value: "MASTER" },
  { label: "박사 졸업", value: "DOCTOR" },
];
