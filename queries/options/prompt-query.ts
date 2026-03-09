import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  promptApi,
  PromptCommentRequest,
  PromptCreateRequest,
  PromptUpdateRequest,
} from "@/queries/api/prompts";

export const promptQueries = {
  all: ["prompt"] as const,
  lists: () => [...promptQueries.all, "list"] as const,
  list: (params: { categoryId?: number; page?: number; size?: number }) =>
    infiniteQueryOptions({
      queryKey: [...promptQueries.lists(), params] as const,
      queryFn: ({ pageParam = 1 }) =>
        promptApi
          .getPrompts({ ...params, page: pageParam as number })
          .then((res) => res.data),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    }),

  details: () => [...promptQueries.all, "detail"] as const,
  detail: (id: string | number) =>
    queryOptions({
      queryKey: [...promptQueries.details(), String(id)] as const,
      queryFn: () => promptApi.getPromptDetail(id).then((res) => res.data),
    }),

  // 최신/좋아요/핫 프롬프트
  latest: () =>
    queryOptions({
      queryKey: [...promptQueries.lists(), "latest"] as const,
      queryFn: () => promptApi.getPromptsLatest().then((res) => res.data),
    }),
  mostLiked: () =>
    queryOptions({
      queryKey: [...promptQueries.lists(), "most-liked"] as const,
      queryFn: () => promptApi.getPromptsMostLiked().then((res) => res.data),
    }),
  todayHot: () =>
    queryOptions({
      queryKey: [...promptQueries.lists(), "today-hot"] as const,
      queryFn: () => promptApi.getTodayHotPrompts().then((res) => res.data),
    }),

  // 검색
  search: (keyword: string) =>
    queryOptions({
      queryKey: [...promptQueries.lists(), "search", keyword] as const,
      queryFn: () => promptApi.searchPrompts(keyword).then((res) => res.data),
      enabled: !!keyword,
    }),

  /**
   * 댓글 관련
   */
  comments: (promptId: string | number) =>
    queryOptions({
      queryKey: [
        ...promptQueries.detail(promptId).queryKey,
        "comments",
      ] as const,
      queryFn: () => promptApi.getComments(promptId).then((res) => res.data),
    }),

  /**
   * 프롬프트 생성/수정/삭제/좋아요 토글 API 호출 함수들
   * - useMutation 훅에서 사용하기 위한 래퍼 함수들
   */
  create: (data: PromptCreateRequest) =>
    promptApi.createPrompt(data).then((res) => res.data),
  update: (id: string | number, data: PromptUpdateRequest) =>
    promptApi.updatePrompt(id, data).then((res) => res.data),
  delete: (id: string | number) =>
    promptApi.deletePrompt(id).then((res) => res.data),
  toggleLike: (id: string | number) =>
    promptApi.togglePromptLike(id).then((res) => res.data),

  createComment: (promptId: string | number, data: PromptCommentRequest) =>
    promptApi.createComment(promptId, data).then((res) => res.data),
  createReply: (
    promptId: string,
    commentId: string,
    data: PromptCommentRequest
  ) => promptApi.createReply(promptId, commentId, data).then((res) => res.data),
  updateComment: (commentId: string, data: PromptCommentRequest) =>
    promptApi.updateComment(commentId, data).then((res) => res.data),
  deleteComment: (commentId: string) =>
    promptApi.deleteComment(commentId).then((res) => res.data),
};
