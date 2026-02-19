import { useSuspenseQuery } from "@tanstack/react-query";

import { PromptBase } from "@/app/types/type";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080";
export const useGetPrompts = (category: string) => {
  return useSuspenseQuery<PromptBase[]>({
    queryKey: ["prompts", category],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/api/prompts?category=${category}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
};
