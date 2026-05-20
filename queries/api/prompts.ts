import { PromptPage } from "@/app/types/type";
import { ApiResponse, fetcher } from "@/lib/fetcher";

// 다른 화면(랭킹, 검색 등)에서 사용하는 레거시 함수 — 이 브랜치에서는 수정하지 않음
export const fetchPrompts = async (
  category: string,
  pageParam: number,
  q?: string
): Promise<ApiResponse<PromptPage>> => {
  const params = new URLSearchParams({
    category,
    page: String(pageParam),
    size: "10",
  });
  if (q) params.append("q", q);

  const response = await fetcher.get(`prompts?${params.toString()}`);

  return response.json();
};

// --- 카테고리 ---

export interface CategoryResponse {
  categoryId: number;
  name: string;
  description: string;
}

export interface CategoryListResponse {
  categories: CategoryResponse[];
}

// --- 프롬프트 ---

export interface PromptCreateRequest {
  categoryId: number;
  title: string;
  content: string;
}

export type PromptUpdateRequest = Partial<PromptCreateRequest>;

export interface PromptResponse {
  promptId: number;
  userId: number;
  category: CategoryResponse;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userIcon: string | null;
  userDesc: string | null;
  isLiked: boolean;
  likes: number;
}

export interface PromptSummaryResponse {
  promptId: number;
  userId: number;
  nickname: string;
  category: CategoryResponse;
  title: string;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}

export interface PromptListResponse {
  prompts: PromptSummaryResponse[];
  totalCount: number;
}

export interface PromptLikeResponse {
  likeStatus: "LIKED" | "UNLIKED";
}

// --- 댓글 ---

export interface PromptCommentRequest {
  comment: string;
}

export interface PromptCommentResponse {
  commentId: number;
  nickName: string;
  comment: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentSliceResponse {
  content: PromptCommentResponse[];
  hasNext: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// --- API ---

export const promptApi = {
  createPrompt: (data: PromptCreateRequest) =>
    fetcher.post("prompts", { json: data }).json<ApiResponse<PromptResponse>>(),

  getPromptDetail: (promptId: string | number) =>
    fetcher.get(`prompts/${promptId}`).json<ApiResponse<PromptResponse>>(),

  getPrompts: (params?: { page?: number; size?: number; sort?: string }) =>
    fetcher
      .get("prompts", { searchParams: params })
      .json<ApiResponse<PromptListResponse>>(),

  updatePrompt: (promptId: string | number, data: PromptUpdateRequest) =>
    fetcher
      .put(`prompts/${promptId}`, { json: data })
      .json<ApiResponse<PromptResponse>>(),

  deletePrompt: (promptId: string | number) =>
    fetcher.delete(`prompts/${promptId}`).json<ApiResponse<null>>(),

  getPromptsLatest: (params?: { page?: number; size?: number }) =>
    fetcher
      .get("prompts/createDesc", { searchParams: params })
      .json<ApiResponse<PromptListResponse>>(),

  getPromptsMostLiked: (params?: { page?: number; size?: number }) =>
    fetcher
      .get("prompts/likeDesc", { searchParams: params })
      .json<ApiResponse<PromptListResponse>>(),

  getTodayHotPrompts: () =>
    fetcher
      .get("prompts/today-hot")
      .json<ApiResponse<PromptSummaryResponse[]>>(),

  searchPrompts: (keyword: string, params?: { page?: number; size?: number }) =>
    fetcher
      .get(`prompts/search/${keyword}`, { searchParams: params })
      .json<ApiResponse<PromptListResponse>>(),

  togglePromptLike: (promptId: string | number) =>
    fetcher
      .post(`prompts/${promptId}/like`)
      .json<ApiResponse<PromptLikeResponse>>(),

  createComment: (promptId: string | number, data: PromptCommentRequest) =>
    fetcher
      .post(`comment/${promptId}`, { json: data })
      .json<ApiResponse<PromptCommentResponse>>(),

  createReply: (
    promptId: string | number,
    commentId: string | number,
    data: PromptCommentRequest
  ) =>
    fetcher
      .post(`comment/${promptId}/${commentId}`, { json: data })
      .json<ApiResponse<PromptCommentResponse>>(),

  updateComment: (commentId: string | number, data: PromptCommentRequest) =>
    fetcher
      .patch(`comment/${commentId}`, { json: data })
      .json<ApiResponse<PromptCommentResponse>>(),

  deleteComment: (commentId: string | number) =>
    fetcher.delete(`comment/${commentId}`).json<ApiResponse<null>>(),

  getComments: (promptId: string | number) =>
    fetcher
      .get(`comment/${promptId}`)
      .json<ApiResponse<CommentSliceResponse>>(),

  getCategories: () =>
    fetcher.get("categories").json<ApiResponse<CategoryListResponse>>(),
};
