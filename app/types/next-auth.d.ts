import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface UpdateData {
    user?: {
      accessToken?: string;
      isNewUser?: boolean;
      name?: string;
      image?: string;
    };
  }

  interface NextAuthResult {
    update: (data?: UpdateData) => Promise<Session | null>;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    isNewUser?: boolean;
    registrationStatus?: string;
    provider?: string; // 카카오/네이버 구분용
    email?: string;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    isNewUser?: boolean; // 가입 페이지 리다이렉트 판단용
    registrationStatus?: string;
    provider?: string; // 가입 시 백엔드 전달용
    email?: string;
    error?: string;
    user: {
      id?: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    registrationStatus?: string;
    accessTokenExpires?: number;
    isNewUser?: boolean;
    provider?: string;
    email?: string;
    error?: string;
  }
}

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  registrationStatus?: string;
  error?: "AccessTokenExpired" | "RefreshAccessTokenError";
}
