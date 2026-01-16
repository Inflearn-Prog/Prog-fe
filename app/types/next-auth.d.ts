import { DefaultSession } from "next-auth";

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
    provider?: string; // 카카오/네이버 구분용
  }

  interface Session {
    accessToken?: string;
    isNewUser?: boolean; // 가입 페이지 리다이렉트 판단용
    provider?: string; // 가입 시 백엔드 전달용
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
    accessTokenExpires?: number;
    isNewUser?: boolean;
    provider?: string;
    error?: string;
  }
}
