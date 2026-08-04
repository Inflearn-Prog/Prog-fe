import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
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
              // 서버가 탈퇴 시 소셜 연동 해제에 사용한다.
              refreshToken: account.refresh_token,
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

          const cookieStore = await cookies();
          cookieStore.set("accessToken", accessToken, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60, // 30일
          });

          // 1) 바디에 refreshToken이 있으면 그대로 저장 (BE가 @JsonIgnore를 제거한 경우)
          if (refreshToken) {
            cookieStore.set("refresh_token", refreshToken, {
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 30 * 24 * 60 * 60,
            });
          }

          // 2) 바디에 없으면 Set-Cookie 헤더에서 파싱 (server-to-server fetch이므로 수동 처리 필요)
          //    BE의 @JsonIgnore로 바디에서 제외되어도, Set-Cookie로는 내려오므로 여기서 읽어 저장
          let resolvedRefreshToken = refreshToken;
          if (!resolvedRefreshToken) {
            const setCookieHeader = response.headers.getSetCookie?.();
            if (setCookieHeader) {
              for (const cookie of setCookieHeader) {
                if (cookie.startsWith("refresh_token=")) {
                  const firstSegment = cookie.split(";")[0];
                  const eqIdx = firstSegment.indexOf("=");
                  const refreshTokenValue =
                    eqIdx >= 0 ? firstSegment.slice(eqIdx + 1) : "";
                  if (refreshTokenValue) {
                    resolvedRefreshToken = refreshTokenValue;
                    cookieStore.set("refresh_token", refreshTokenValue, {
                      httpOnly: true,
                      secure: process.env.NODE_ENV === "production",
                      sameSite: "lax",
                      path: "/",
                      maxAge: 30 * 24 * 60 * 60,
                    });
                  }
                }
              }
            }
          }

          // 신규 유저든 기존 유저든 일단 정보를 user 객체에 보관
          user.accessToken = accessToken;
          user.refreshToken = resolvedRefreshToken;
          user.isNewUser = isNewUser;
          user.registrationStatus = registrationStatus;
          user.provider = account.provider; // 소셜 제공자 정보 저장
          user.email = user.email ?? undefined;

          // 여기서 리다이렉트 하지 않고 무조건 true 반환 (로그인 처리)
          // 추후 회원가입 페이지에서 세션 정보에서 -> Zustand로 store.
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      // 1️⃣ 최초 로그인 시점에 user 객체가 들어옵니다.
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.registrationStatus = user.registrationStatus;
        token.isNewUser = user.isNewUser;
        token.provider = user.provider;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;

        if (user.accessToken) {
          try {
            const decoded = jwtDecode<{ exp: number; sub?: string }>(
              user.accessToken
            );
            token.accessTokenExpires = decoded.exp * 1000;

            if (decoded.sub) {
              token.sub = decoded.sub;
              token.backendUserId = decoded.sub;
            }
          } catch {
            token.error = "TokenDecodeError";
          }
        }
      }

      // 2️⃣ 회원가입 완료 후 클라이언트에서 update()를 호출했을 때
      if (trigger === "update" && session) {
        if (session.registrationStatus) {
          token.registrationStatus = session.registrationStatus;
          token.isNewUser =
            session.registrationStatus !== "ONBOARDING_COMPLETED";
        }

        if (session.user?.accessToken) {
          token.accessToken = session.user.accessToken;
          try {
            const decoded = jwtDecode<{ exp: number; sub?: string }>(
              session.user.accessToken
            );
            token.accessTokenExpires = decoded.exp * 1000;
            if (decoded.sub) {
              token.sub = decoded.sub; // 업데이트 시에도 강제 고정
              token.backendUserId = decoded.sub;
            }
          } catch {
            token.error = "TokenUpdateDecodeError";
          }
        }
      }

      // 3️⃣ 백엔드 토큰 만료 여부 체크 및 리프레시
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
      session.refreshToken = token.refreshToken as string;
      session.registrationStatus = token.registrationStatus as string;
      session.isNewUser = token.isNewUser as boolean;
      session.provider = token.provider as string;
      session.email = token.email as string;
      session.error = token.error as string;

      if (session.user) {
        session.user.accessToken = token.accessToken as string;
        session.user.id =
          (token.backendUserId as string) || (token.sub as string);
        session.user.email = token.email as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

async function refreshBackendToken(token: JWT): Promise<JWT> {
  try {
    const cookieStore = await cookies();
    let cookieString = cookieStore.toString();

    // 브라우저 쿠키에 refresh_token이 없더라도 NextAuth 토큰에서 가져와 헤더에 추가
    if (token.refreshToken && !cookieString.includes("refresh_token=")) {
      cookieString += `${cookieString ? "; " : ""}refresh_token=${token.refreshToken}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieString,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const resData = await response.json();
    // 2. 새 토큰 파싱
    const newAccessToken =
      typeof resData?.data === "string"
        ? resData.data
        : typeof resData?.data?.accessToken === "string"
          ? resData.data.accessToken
          : null;

    if (!newAccessToken) {
      throw new Error("Invalid refresh response: access token is missing");
    }

    const decoded = jwtDecode<{ exp: number }>(newAccessToken);

    // 새 accessToken을 쿠키에 저장
    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30일
    });

    // 백엔드가 Set-Cookie로 보낸 refresh_token을 Next.js 서버에서 수동 전달
    let newRefreshToken = token.refreshToken;
    const setCookieHeader = response.headers.getSetCookie?.();
    if (setCookieHeader) {
      for (const cookie of setCookieHeader) {
        if (cookie.startsWith("refresh_token=")) {
          const firstSegment = cookie.split(";")[0];
          const eqIdx = firstSegment.indexOf("=");
          const refreshTokenValue =
            eqIdx >= 0 ? firstSegment.slice(eqIdx + 1) : "";
          if (refreshTokenValue) {
            newRefreshToken = refreshTokenValue;
            cookieStore.set("refresh_token", refreshTokenValue, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 30 * 24 * 60 * 60, // 30일
            });
          }
        }
      }
    }

    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires: decoded.exp * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    // 갱신 실패 시 세션을 만료시키거나 클라이언트에서 로그아웃 처리를 유도하기 위해 에러 표기
    return {
      ...token,
      error: "AccessTokenExpired",
    };
  }
}
