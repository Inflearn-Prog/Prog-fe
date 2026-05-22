import { PromptPage } from "@/app/types/type";
import { ApiResponse, fetcher } from "@/lib/fetcher";

export const fetchPrompts = async (
  category: string = "all",
  pageParam: number = 0,
  size: number = 10
): Promise<ApiResponse<PromptPage>> => {
  const params = new URLSearchParams({
    category,
    page: String(pageParam),
    size: String(size),
  });

  const response = await fetcher.get(`prompts/createDesc?${params.toString()}`);
  return response.json();
};

export const fetchLikePrompts = async (
  pageParam: number = 0,
  size: number = 10
): Promise<ApiResponse<PromptPage>> => {
  const params = new URLSearchParams({
    page: String(pageParam),
    size: String(size),
  });

  const response = await fetcher.get(`prompts/likeDesc?${params.toString()}`);
  return response.json();
};

export const fetchSearchPrompts = async (
  keyword: string,
  pageParam: number = 0,
  size: number = 20
): Promise<ApiResponse<PromptPage>> => {
  const params = new URLSearchParams({
    page: String(pageParam),
    size: String(size),
  });

  const response = await fetcher.get(
    `prompts/search/${encodeURIComponent(keyword)}?${params.toString()}`
  );
  return response.json();
};
