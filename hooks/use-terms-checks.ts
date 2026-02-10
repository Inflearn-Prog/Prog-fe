import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { fetchTerms, postTerms } from "@/queries/api/terms";

type PostTermsParams = number[];

export const termsQueries = {
  all: () =>
    queryOptions({
      queryKey: ["terms"],
      queryFn: fetchTerms,
      staleTime: 1000 * 60 * 5,
    }),
};

export const useTerms = () => {
  return useQuery(termsQueries.all());
};

export const usePostTerms = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (params: PostTermsParams) => {
      const token = session?.accessToken;

      if (!token) {
        const error = new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
        throw error;
      }
      return postTerms(params, token);
    },
    onSuccess: () => {},
    onError: () => {},
  });
};
