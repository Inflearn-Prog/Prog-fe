import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일 동안 세션 유지
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.access_token) return false;

      try {
        const response = await fetch(
          `${process.env.BACKEND_API_URL}/auth/social-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: account.provider.toUpperCase(),
              authCode: account.access_token,
            }),
          }
        );

        const resData = await response.json();

        if (resData.success) {
          const { isNewUser, accessToken } = resData.data;

          // 신규 유저든 기존 유저든 일단 정보를 user 객체에 보관
          user.accessToken = accessToken; // 신규 유저면 null이 들어감
          user.isNewUser = isNewUser; // 신규 유저 여부 저장
          user.provider = account.provider; // 소셜 제공자 정보 저장

          // 여기서 리다이렉트 하지 않고 무조건 true 반환 (로그인 처리)
          // 추후 회원가입 페이지에서 세션 -> Zustand로 store.
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
        token.isNewUser = user.isNewUser;
        token.provider = user.provider;
        // NextAuth 기본 필드(email, image)는 자동으로 token에 들어감

        if (user.accessToken) {
          try {
            const decoded = jwtDecode<{ exp: number }>(user.accessToken);
            token.accessTokenExpires = decoded.exp * 1000;
          } catch (e) {
            console.error("Token decoding error", e);
          }
        }
        return token;
      }

      //회원가입 완료 후 클라이언트에서 update()를 호출했을 때 실행됨

      if (trigger === "update" && session) {
        token.accessToken = session.user.accessToken;
        token.isNewUser = false;

        if (session.user.accessToken) {
          const decoded = jwtDecode<{ exp: number }>(session.user.accessToken);
          token.accessTokenExpires = decoded.exp * 1000;
        }
      }
      // 기존 유저이고 토큰 만료 시간이 있다면 체크 (신규 유저는 이 단계를 건너뜀)
      if (token.accessToken && token.accessTokenExpires) {
        const isTokenValid = Date.now() < (token.accessTokenExpires as number);
        if (!isTokenValid) {
          token.error = "AccessTokenExpired";
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.isNewUser = token.isNewUser;
      session.provider = token.provider;
      session.error = token.error;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
