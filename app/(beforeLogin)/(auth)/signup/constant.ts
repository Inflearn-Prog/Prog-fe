import { SelectOption } from "@/components/shared/select-box";

export const STATE_OPTIONS = ["재학중", "취업준비", "이직준비", "기타"];
export const JOB_OPTIONS = ["기획", "마케팅", "디자인", "개발", "영업", "기타"];

export const EDUCATION_OPTIONS: SelectOption[] = [
  { label: "고등학교 졸업", value: "HIGH_SCHOOL" },
  { label: "전문대 졸업", value: "ASSOCIATE" },
  { label: "대학교 졸업", value: "BACHELOR_4" },
  { label: "석사 졸업", value: "MASTER" },
  { label: "박사 졸업", value: "DOCTOR" },
];

export const FIELD_OPTIONS: SelectOption[] = [
  { label: "인문계열", value: "HUMANITIES" },
  { label: "이공계열", value: "ENGINEERING_SCIENCE" },
  { label: "예체능계열", value: "ARTS_PHYSICAL" },
];
