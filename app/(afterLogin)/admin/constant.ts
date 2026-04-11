import { ReportReason, UserStatus } from "./types";

export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  SPAM_AD: "광고/도배",
  INAPPROPRIATE_EXPRESSION: "불쾌한 표현",
  NOT_WORKING: "작동 안함",
  PLAGIARISM: "도용",
  OTHER: "기타",
};

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: "일반",
  INACTIVE: "비활성",
  SUSPENDED: "제한",
  DELETED: "삭제",
};

export const PROMPT_STATUS_LABEL: Record<string, string> = {
  PUBLIC: "공개",
  PRIVATE: "비공개",
  DELETED: "삭제",
};
