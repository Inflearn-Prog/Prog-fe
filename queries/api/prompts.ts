import { PromptPage } from "@/app/types/type";
import { ApiResponse, fetcher } from "@/lib/fetcher";

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

export type JobCategory = "BACKEND" | "FRONTEND" | "AI" | "ETC";
interface Prompt {
  id: number;
  userId: number;
  category: JobCategory;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userIcon: string;
  userDesc: string;
  likes: number;
  isLiked: boolean;
}

interface Comment {
  commentId: number;
  nickName: string;
  comment: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromptCreateRequest extends Pick<Prompt, "title" | "content"> {
  categoryId: string;
}

export type PromptUpdateRequest = Partial<PromptCreateRequest>;

export interface PromptResponse extends Pick<
  Prompt,
  "userId" | "category" | "title" | "content" | "createdAt" | "updatedAt"
> {
  promptId: number;
  isLiked?: boolean;
  likes?: number;
}

export interface PromptPageResponse {
  items: PromptResponse[];
  nextPage?: number;
}

export type PromptCommentRequest = Pick<Comment, "comment">;

export interface PromptCommentResponse extends Pick<
  Comment,
  "nickName" | "comment" | "parentId" | "createdAt" | "updatedAt"
> {
  commentId: number;
}

export const promptApi = {
  createPrompt: (data: PromptCreateRequest) =>
    fetcher.post("prompts", { json: data }).json<ApiResponse<PromptResponse>>(),

  getPromptDetail: (promptId: string | number) =>
    fetcher.get(`prompts/${promptId}`).json<ApiResponse<PromptResponse>>(),

  getPrompts: (params: { categoryId?: number; page?: number; size?: number }) =>
    fetcher
      .get("prompts", { searchParams: params })
      .json<ApiResponse<PromptPageResponse>>(),

  updatePrompt: (promptId: string | number, data: PromptUpdateRequest) =>
    fetcher
      .put(`prompts/${promptId}`, { json: data })
      .json<ApiResponse<PromptResponse>>(),

  deletePrompt: (promptId: string | number) =>
    fetcher.delete(`prompts/${promptId}`).json<ApiResponse<void>>(),

  getPromptsLatest: () =>
    fetcher.get("prompts/createDesc").json<ApiResponse<PromptResponse[]>>(),

  getPromptsMostLiked: () =>
    fetcher.get("prompts/likeDesc").json<ApiResponse<PromptResponse[]>>(),

  getTodayHotPrompts: () =>
    fetcher.get("prompts/today-hot").json<ApiResponse<PromptResponse[]>>(),

  searchPrompts: (keyword: string) =>
    fetcher
      .get(`prompts/search/${keyword}`)
      .json<ApiResponse<PromptResponse[]>>(),

  togglePromptLike: (promptId: string | number) =>
    fetcher.post(`prompts/${promptId}/like`).json<ApiResponse<void>>(),

  createComment: (promptId: string | number, data: PromptCommentRequest) =>
    fetcher
      .post(`api/v1/comment/${promptId}`, { json: data })
      .json<ApiResponse<PromptCommentResponse>>(),

  createReply: (
    promptId: string | number,
    commentId: string | number,
    data: PromptCommentRequest
  ) =>
    fetcher
      .post(`api/v1/comment/${promptId}/${commentId}`, { json: data })
      .json<ApiResponse<PromptCommentResponse>>(),

  updateComment: (commentId: string | number, data: PromptCommentRequest) =>
    fetcher
      .patch(`api/v1/comment/${commentId}`, { json: data })
      .json<ApiResponse<PromptCommentResponse>>(),

  deleteComment: (commentId: string | number) =>
    fetcher.delete(`api/v1/comment/${commentId}`).json<ApiResponse<void>>(),

  getComments: (promptId: string | number) =>
    fetcher
      .get(`api/v1/comment/${promptId}`)
      .json<ApiResponse<PromptCommentResponse[]>>(),
};
