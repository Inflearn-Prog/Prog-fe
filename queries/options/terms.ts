import { queryOptions, UseMutationOptions } from "@tanstack/react-query";

import { fetchTerms, postTerms, PostTermsResponse } from "@/queries/api/terms";

export const termsQueries = {
  all: ["terms"] as const,
  list: () =>
    queryOptions({
      queryKey: [...termsQueries.all, "list"] as const,
      queryFn: fetchTerms,
      staleTime: 1000 * 60 * 5,
    }),
  create: (
    token: string
  ): UseMutationOptions<PostTermsResponse, Error, number[]> => ({
    mutationFn: (params: number[]) => postTerms(params, token),
  }),
};
