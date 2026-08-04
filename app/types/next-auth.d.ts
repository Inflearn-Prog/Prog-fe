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

  // 이 인터페이스의 값은 /api/auth/session 으로 브라우저에 그대로 나간다.
  // refreshToken 을 다시 넣지 말 것 — 14일짜리 토큰이 JS 에 노출된다.
  interface Session {
    accessToken?: string;
    isNewUser?: boolean; // 가입 페이지 리다이렉트 판단용
    registrationStatus?: string;
    provider?: string; // 가입 시 백엔드 전달용
    email?: string;
    error?: string;
    user: {
      id?: string;
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
