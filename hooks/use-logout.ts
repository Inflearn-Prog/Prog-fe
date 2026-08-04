import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { logoutOnServer } from "@/app/actions/auth-actions";
import { ROUTES } from "@/lib/routes";

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutOnServer,
    onSettled: () => {
      signOut({
        callbackUrl: ROUTES.auth.SIGNIN,
        redirect: true,
      });
    },
  });
};
