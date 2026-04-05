import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { ROUTES } from "@/lib/routes";
import { postLogout } from "@/queries/api/auth";

export const useLogout = () => {
  return useMutation({
    mutationFn: postLogout,
    onSettled: () => {
      signOut({
        callbackUrl: ROUTES.auth.SIGNIN,
        redirect: true,
      });
    },
  });
};
