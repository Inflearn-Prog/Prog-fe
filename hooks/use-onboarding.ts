import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  putBasic,
  PutBasicParams,
  putCareer,
  PutCareerParams,
} from "@/queries/api/onboarding";

export const usePutBasic = () => {
  return useMutation({
    mutationFn: ({
      params,
      token,
    }: {
      params: PutBasicParams;
      token: string;
    }) => {
      return putBasic(params, token);
    },
  });
};

export const usePutCareer = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (params: PutCareerParams) => {
      const token = session?.accessToken;
      if (!token) throw new Error("인증 토큰이 없습니다.");

      return putCareer(params, token);
    },
    onSuccess: () => {},
  });
};
