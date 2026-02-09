import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  putBasic,
  PutBasicParams,
  putCareer,
  PutCareerParams,
} from "@/queries/api/onboarding";

interface ApiError extends Error {
  code?: string;
}

export const usePutBasic = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (params: PutBasicParams) => {
      const token = session?.accessToken;
      if (!token) throw new Error("인증 토큰이 없습니다.") as ApiError;

      return putBasic(params, token);
    },
    onSuccess: () => {},
  });
};

export const usePutCareer = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (params: PutCareerParams) => {
      const token = session?.accessToken;
      if (!token) throw new Error("인증 토큰이 없습니다.") as ApiError;

      return putCareer(params, token);
    },
    onSuccess: () => {},
  });
};
