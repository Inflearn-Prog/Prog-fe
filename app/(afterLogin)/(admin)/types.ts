// 관리자 페이지 공통 타입

// --- Enums ---
export type PromptStatus = "PUBLIC" | "PRIVATE" | "DELETED";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";
export type Role = "USER" | "ADMIN";
export type ReportReason =
  | "SPAM_AD"
  | "INAPPROPRIATE_EXPRESSION"
  | "NOT_WORKING"
  | "PLAGIARISM"
  | "OTHER";
export type ReportStatus = "PENDING" | "PROCESSED" | "REJECTED";
export type TargetType = "PROMPT" | "COMMENT";
export type ReportAction = "PRIVATE" | "DELETE";

// --- 공통 ---
export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

// --- 대시보드: 통계 ---
export interface MetricInfo {
  count: number;
  increment: number;
  percentage: number;
  status: string;
}

export interface StatsSummaryData {
  period: {
    startDate: string;
    endDate: string;
  };
  newUsers: MetricInfo;
  newPrompts: MetricInfo;
  copyCount: MetricInfo;
}

// --- 대시보드: 신고 ---
export interface PendingReport {
  reportId: number;
  reportedAt: string;
  reasonCategory: ReportReason;
  targetPromptTitle: string;
  reporterNickname: string;
  reportContent: string;
  status: ReportStatus;
}

export interface PendingReportListData {
  content: PendingReport[];
  pageInfo: {
    currentPage: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ReportProcessRequest {
  adminRemark?: string;
  action?: ReportAction;
}

export interface ReportRejectRequest {
  adminRemark?: string;
}

// --- 게시글 관리 ---
export interface AdminPromptInfo {
  promptId: number;
  title: string;
  authorNickname: string;
  categoryName: string;
  status: PromptStatus;
  createdAt: string;
}

export interface AdminPromptListData {
  content: AdminPromptInfo[];
  pageInfo: PageInfo;
}

// --- 유저 관리 ---
export interface AdminUserInfo {
  userId: number;
  nickname: string;
  role: Role;
  promptCount: number;
  commentCount: number;
  status: UserStatus;
}

export interface AdminUserListData {
  content: AdminUserInfo[];
  pageInfo: PageInfo;
}

// --- 카테고리 관리 ---
export interface AdminCategory {
  categoryId: number;
  name: string;
  description: string | null;
  parentId: number | null;
  parentName: string | null;
  childrenCount: number;
  displayOrder: number;
  createdAt: string;
}

export interface AdminCategoryListData {
  categories: AdminCategory[];
}

// --- 공지사항 ---
export interface AdminNoticeInfo {
  noticeId: number;
  title: string;
  createdAt: string;
}

export interface AdminNoticeDetail {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface AdminNoticeListData {
  content: AdminNoticeInfo[];
  pageInfo: PageInfo;
}
