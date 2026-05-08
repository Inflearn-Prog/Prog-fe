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
