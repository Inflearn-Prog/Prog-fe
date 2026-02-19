"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  // const isDevelopment = process.env.NODE_ENV === "development";
  // if (isDevelopment) {
  //   return <>{children}</>;
  // }
  return <SessionProvider>{children}</SessionProvider>;
}
