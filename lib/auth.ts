import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

export const { handlers, auth, signIn, signOut, update } = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      checks: ["state"],
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      checks: ["state"],
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일 동안 세션 유지
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.access_token) {
        return false;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/social-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: account.provider.toUpperCase(),
              accessToken: account.access_token,
            }),
          }
        );

        if (!response.ok) {
          return false;
        }

        const resData = await response.json();

        if (resData.success) {
          const { isNewUser, accessToken, refreshToken, registrationStatus } =
            resData.data;

          // 신규 유저든 기존 유저든 일단 정보를 user 객체에 보관
          user.accessToken = accessToken; // 신규 유저면 null이 들어감
          user.isNewUser = isNewUser;
          user.refreshToken = refreshToken; // 신규 유저 여부 저장
          user.registrationStatus = registrationStatus;
          user.provider = account.provider; // 소셜 제공자 정보 저장

          // 여기서 리다이렉트 하지 않고 무조건 true 반환 (로그인 처리)
          // 추후 회원가입 페이지에서 세션 정보에서 -> Zustand로 store.
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.registrationStatus = user.registrationStatus;
        token.isNewUser = user.isNewUser;
        token.provider = user.provider;

        if (user.accessToken) {
          try {
            const decoded = jwtDecode<{ exp: number }>(user.accessToken);
            token.accessTokenExpires = decoded.exp * 1000;
          } catch {
            token.error = "TokenDecodeError";
          }
        }
      }

      //회원가입 완료 후 클라이언트에서 update()를 호출했을 때 실행됨

      if (trigger === "update" && session) {
        if (session.registrationStatus) {
          token.registrationStatus = session.registrationStatus;
          token.isNewUser =
            session.registrationStatus !== "ONBOARDING_COMPLETED";
        }

        if (session.user?.accessToken) {
          token.accessToken = session.user.accessToken;
          try {
            const decoded = jwtDecode<{ exp: number }>(
              session.user.accessToken
            );
            token.accessTokenExpires = decoded.exp * 1000;
          } catch {
            token.error = "TokenUpdateDecodeError";
          }
        }
      }
      // 기존 유저이고 토큰 만료 시간이 있다면 체크 (신규 유저는 이 단계를 건너뜀)
      if (token.accessToken && token.accessTokenExpires) {
        const isTokenValid = Date.now() < (token.accessTokenExpires as number);
        if (!isTokenValid) {
          return await refreshBackendToken(token);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.registrationStatus = token.registrationStatus as string;
      session.isNewUser = token.isNewUser as boolean;
      session.provider = token.provider as string;
      session.error = token.error as string;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

async function refreshBackendToken(token: JWT): Promise<JWT> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
          Cookie: cookieString,
        },
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Refresh failed");
    }

    // 2. 새 토큰 파싱
    const newAccessToken = resData.data.accessToken;
    const decoded = jwtDecode<{ exp: number }>(newAccessToken);

    console.log("✅ 토큰 갱신 성공!");

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: decoded.exp * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("🚨 토큰 자동 갱신 실패:", error);
    // 갱신 실패 시 세션을 만료시키기 위해 에러 표기
    return {
      ...token,
      error: "AccessTokenExpired",
    };
  }
}
