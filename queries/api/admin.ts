import {
  AdminCategoryListData,
  AdminNoticeDetail,
  AdminNoticeListData,
  AdminPromptListData,
  AdminUserListData,
  PendingReportListData,
  PromptStatus,
  ReportProcessRequest,
  ReportRejectRequest,
  StatsSummaryData,
  UserStatus,
} from "@/app/(afterLogin)/admin/types";
import { ApiResponse, fetcher } from "@/lib/fetcher";

// --- 대시보드: 통계 ---
export const getStatsSummary = async (startDate?: string, endDate?: string) => {
  const searchParams: Record<string, string> = {};
  if (startDate) searchParams["startDate"] = startDate;
  if (endDate) searchParams["endDate"] = endDate;

  return await fetcher
    .get("admin/stats/summary", { searchParams })
    .json<ApiResponse<StatsSummaryData>>();
};

// --- 대시보드: 신고 ---
export const getPendingReports = async (page = 0, size = 5) => {
  return await fetcher
    .get("admin/reports/pending", {
      searchParams: { page, size },
    })
    .json<ApiResponse<PendingReportListData>>();
};

export const processReport = async (
  reportId: number,
  data: ReportProcessRequest
) => {
  return await fetcher
    .patch(`admin/reports/${reportId}/process`, { json: data })
    .json<ApiResponse<unknown>>();
};

export const rejectReport = async (
  reportId: number,
  data: ReportRejectRequest
) => {
  return await fetcher
    .patch(`admin/reports/${reportId}/reject`, { json: data })
    .json<ApiResponse<unknown>>();
};

// --- 게시글 관리 ---
export const getAdminPrompts = async (params: {
  keyword?: string;
  categoryId?: number;
  status?: PromptStatus;
  page?: number;
  size?: number;
}) => {
  const searchParams: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 10,
  };
  if (params.keyword) searchParams["keyword"] = params.keyword;
  if (params.categoryId) searchParams["categoryId"] = params.categoryId;
  if (params.status) searchParams["status"] = params.status;

  return await fetcher
    .get("admin/prompts", { searchParams })
    .json<ApiResponse<AdminPromptListData>>();
};

export const bulkUpdatePrompts = async (data: {
  promptIds: number[];
  updateFields: { categoryId?: number; status?: PromptStatus };
}) => {
  return await fetcher
    .patch("admin/prompts/bulk-update", { json: data })
    .json<ApiResponse<{ updatedCount: number; message: string }>>();
};

export const bulkDeletePrompts = async (promptIds: number[]) => {
  return await fetcher
    .delete("admin/prompts/bulk", { json: { promptIds } })
    .json<ApiResponse<{ deletedCount: number; message: string }>>();
};

// --- 유저 관리 ---
export const getAdminUsers = async (params: {
  keyword?: string;
  page?: number;
  size?: number;
}) => {
  const searchParams: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 20,
  };
  if (params.keyword) searchParams["keyword"] = params.keyword;

  return await fetcher
    .get("admin/users", { searchParams })
    .json<ApiResponse<AdminUserListData>>();
};

export const bulkUpdateUserStatus = async (data: {
  userIds: number[];
  status: UserStatus;
}) => {
  return await fetcher
    .patch("admin/users/bulk-status", { json: data })
    .json<ApiResponse<{ updatedCount: number; message: string }>>();
};

export const bulkUpdateUserRole = async (data: {
  userIds: number[];
  role: "USER" | "ADMIN";
}) => {
  return await fetcher
    .patch("admin/users/bulk-role", { json: data })
    .json<ApiResponse<{ updatedCount: number; message: string }>>();
};

// --- 카테고리 관리 ---
export const getAdminCategories = async () => {
  return await fetcher
    .get("admin/categories")
    .json<ApiResponse<AdminCategoryListData>>();
};

export const createCategory = async (data: {
  name: string;
  description?: string;
  parentId?: number | null;
}) => {
  return await fetcher
    .post("admin/categories", { json: data })
    .json<ApiResponse<unknown>>();
};

export const updateCategory = async (
  categoryId: number,
  data: { name: string; description?: string; parentId?: number | null }
) => {
  return await fetcher
    .put(`admin/categories/${categoryId}`, { json: data })
    .json<ApiResponse<unknown>>();
};

export const deleteCategory = async (categoryId: number) => {
  return await fetcher
    .delete(`admin/categories/${categoryId}`)
    .json<ApiResponse<{ message: string }>>();
};

export const updateCategoryOrder = async (categoryIds: number[]) => {
  return await fetcher
    .put("admin/categories/order", { json: { categoryIds } })
    .json<ApiResponse<{ updatedCount: number; message: string }>>();
};

// --- 공지사항 ---
export const getAdminNotices = async (page = 0, size = 10) => {
  return await fetcher
    .get("admin/notices", { searchParams: { page, size } })
    .json<ApiResponse<AdminNoticeListData>>();
};

export const getAdminNoticeDetail = async (noticeId: number) => {
  return await fetcher
    .get(`admin/notices/${noticeId}`)
    .json<ApiResponse<AdminNoticeDetail>>();
};

export const createNotice = async (data: {
  title: string;
  content: string;
}) => {
  return await fetcher
    .post("admin/notices", { json: data })
    .json<ApiResponse<{ noticeId: number; message: string }>>();
};

export const updateNotice = async (
  noticeId: number,
  data: { title?: string; content?: string }
) => {
  return await fetcher
    .put(`admin/notices/${noticeId}`, { json: data })
    .json<ApiResponse<{ noticeId: number; message: string }>>();
};

export const bulkDeleteNotices = async (noticeIds: number[]) => {
  return await fetcher
    .delete("admin/notices/bulk", { json: { noticeIds } })
    .json<ApiResponse<{ deletedCount: number; message: string }>>();
};

// --- 관리자 댓글 삭제 ---
export const deleteAdminComment = async (commentId: number) => {
  return await fetcher
    .delete(`admin/comments/${commentId}`)
    .json<ApiResponse<null>>();
};
