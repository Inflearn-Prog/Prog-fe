import { queryOptions } from "@tanstack/react-query";

import {
  promptApi,
  PromptCommentRequest,
  PromptCreateRequest,
  PromptUpdateRequest,
} from "@/queries/api/prompts";

export const promptQueries = {
  all: ["prompt"] as const,
  lists: () => [...promptQueries.all, "list"] as const,

  details: () => [...promptQueries.all, "detail"] as const,
  detail: (id: string | number) =>
    queryOptions({
      queryKey: [...promptQueries.details(), String(id)] as const,
      queryFn: () => promptApi.getPromptDetail(id).then((res) => res.data),
    }),

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

  search: (keyword: string) =>
    queryOptions({
      queryKey: [...promptQueries.lists(), "search", keyword] as const,
      queryFn: () => promptApi.searchPrompts(keyword).then((res) => res.data),
      enabled: !!keyword,
    }),

  comments: (promptId: string | number) =>
    queryOptions({
      queryKey: [
        ...promptQueries.detail(promptId).queryKey,
        "comments",
      ] as const,
      queryFn: () =>
        promptApi.getComments(promptId).then((res) => res.data.content),
    }),

  categories: () =>
    queryOptions({
      queryKey: ["category", "list"] as const,
      queryFn: () =>
        promptApi.getCategories().then((res) => res.data.categories),
      staleTime: 1000 * 60 * 30,
    }),

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
    promptId: string | number,
    commentId: string | number,
    data: PromptCommentRequest
  ) => promptApi.createReply(promptId, commentId, data).then((res) => res.data),
  updateComment: (commentId: string | number, data: PromptCommentRequest) =>
    promptApi.updateComment(commentId, data).then((res) => res.data),
  deleteComment: (commentId: string | number) =>
    promptApi.deleteComment(commentId).then((res) => res.data),
};
