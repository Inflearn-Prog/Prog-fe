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

export const STATE_OPTIONS = Object.values(STATE_VALUES);
export const JOB_OPTIONS = Object.values(JOB_DATA);

export type StateType = (typeof STATE_VALUES)[keyof typeof STATE_VALUES];
export type JobType = (typeof JOB_DATA)[keyof typeof JOB_DATA];
export type JobTypeCode = keyof typeof JOB_DATA;

export const EDUCATION_OPTIONS: SelectOption[] = [
  { label: "고등학교 졸업", value: "HIGH_SCHOOL" },
  { label: "전문대 졸업", value: "ASSOCIATE" },
  { label: "대학교 졸업", value: "BACHELOR" },
  { label: "석사 졸업", value: "MASTER" },
  { label: "박사 졸업", value: "DOCTOR" },
];

export const FIELD_OPTIONS: SelectOption[] = [
  { label: "인문계열", value: "HUMANITIES" },
  { label: "이공계열", value: "ENGINEERING_SCIENCE" },
  { label: "예체능계열", value: "ARTS_PHYSICAL" },
];
