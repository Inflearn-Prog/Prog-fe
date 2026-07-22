import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  postComplete,
  postNickname,
  putBasic,
  PutBasicParams,
  putCareer,
  PutCareerParams,
} from "@/queries/api/onboarding";

export const usePostNickname = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ params }: { params: string }) => {
      const token = session?.accessToken;
      if (!token) throw new Error("인증 토큰이 없습니다.");

      return postNickname(params, token);
    },
  });
};

export const usePutBasic = () => {
  const { data: session } = useSession();
  return useMutation({
    mutationFn: ({ params }: { params: PutBasicParams }) => {
      const token = session?.accessToken;
      if (!token) throw new Error("인증 토큰이 없습니다.");
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

export const usePostComplete = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: () => {
      const token = session?.accessToken;
      if (!token) throw new Error("인증 토큰이 없습니다.");

      return postComplete(token);
    },
    onSuccess: () => {},
  });
};
