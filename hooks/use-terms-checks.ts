import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { postTerms } from "@/queries/api/terms";
import { termsQueries } from "@/queries/options/terms";

export const useTerms = () => {
  return useQuery(termsQueries.list());
};

export const usePostTerms = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (params: number[]) => {
      const token = session?.accessToken;
      if (!token) throw new Error("인증 토큰이 없습니다.");
      return postTerms(params, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: termsQueries.list().queryKey,
      });
    },
  });
};
