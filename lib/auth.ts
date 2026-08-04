import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

const REFRESH_TOKEN_COOKIE = "refresh_token";

// BE 의 jwt.refresh-expiration(14일)과 맞춘다.
const REFRESH_TOKEN_MAX_AGE = 14 * 24 * 60 * 60;

/**
 * BE 는 refresh_token 을 응답 바디가 아니라 Set-Cookie 로만 내려준다(@JsonIgnore).
 * 이 요청을 보낸 주체가 브라우저가 아니라 Next 서버라서 쿠키가 자동 저장되지 않으므로 직접 꺼낸다.
 */
function readRefreshTokenFromResponse(response: Response): string | null {
  const setCookies = response.headers.getSetCookie?.() ?? [];

  for (const cookie of setCookies) {
    if (!cookie.startsWith(`${REFRESH_TOKEN_COOKIE}=`)) continue;

    const firstSegment = cookie.split(";")[0];
    const eqIdx = firstSegment.indexOf("=");
    const value = eqIdx >= 0 ? firstSegment.slice(eqIdx + 1) : "";

    if (value) return value;
  }

  return null;
}

/**
 * 콜백은 쿠키를 쓸 수 없는 컨텍스트(서버 컴포넌트·미들웨어)에서도 돈다.
 * 그곳에서는 조용히 실패하고 false 를 준다. 호출부가 이어갈지 미룰지 판단한다.
 */
async function persistRefreshToken(value: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(REFRESH_TOKEN_COOKIE, value, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return true;
  } catch {
    return false;
  }
}

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
          const { isNewUser, accessToken, registrationStatus } = resData.data;

          // 1) BE 가 @JsonIgnore 를 떼면 바디로 내려온다.
          // 2) 지금은 Set-Cookie 로만 오고, 이 요청은 Next 서버가 보낸 것이라 자동 저장되지 않는다.
          const refreshToken =
            (resData.data.refreshToken as string | undefined) ??
            readRefreshTokenFromResponse(response);

          if (refreshToken) {
            await persistRefreshToken(refreshToken);
          }

          // 이전 버전이 심어둔 accessToken 쿠키를 정리한다. 읽는 곳이 없고 수명만 30일이었다.
          try {
            (await cookies()).delete("accessToken");
          } catch {
            // 쿠키 쓰기가 막힌 컨텍스트
          }

          // 신규 유저든 기존 유저든 일단 정보를 user 객체에 보관
          user.accessToken = accessToken;
          user.refreshToken = refreshToken ?? undefined;
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
    // 여기에 담은 값은 /api/auth/session 응답으로 브라우저 JS 에 그대로 노출된다.
    // 리프레시 토큰은 절대 올리지 않는다. 액세스 토큰도 최상위 하나로만 둔다.
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.registrationStatus = token.registrationStatus as string;
      session.isNewUser = token.isNewUser as boolean;
      session.provider = token.provider as string;
      session.email = token.email as string;
      session.error = token.error as string;

      if (session.user) {
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

// BE 는 이미 쓴 리프레시 토큰이 다시 오면 탈취로 판단해 그 사용자의 전 기기 토큰을 폐기한다.
// 만료 직후 여러 요청이 각자 갱신에 나서면 정상 사용자가 통째로 로그아웃되므로,
// 같은 토큰에 대한 갱신은 하나로 묶는다.
const inFlightRefreshes = new Map<string, Promise<JWT>>();

async function refreshBackendToken(token: JWT): Promise<JWT> {
  let refreshToken = token.refreshToken;

  try {
    refreshToken =
      (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value ?? refreshToken;
  } catch {
    // 쿠키를 읽을 수 없는 컨텍스트. NextAuth JWT 에 남은 값으로 진행한다.
  }

  if (!refreshToken) {
    console.error("Token refresh error: no refresh token available");
    return { ...token, error: "AccessTokenExpired" };
  }

  // BE 는 갱신할 때마다 리프레시 토큰을 교체하고 옛 토큰을 폐기한다.
  // 교체분을 저장할 수 없는 곳에서 갱신하면 그 값을 잃고, 다음 갱신이 폐기된 토큰으로 나가
  // 전 기기 로그아웃을 부른다. 지금 값을 그대로 다시 심어 쓰기 가능 여부를 확인하고,
  // 불가능하면 미룬다. 쿠키를 쓸 수 있는 /api/auth/session 요청에서 갱신된다.
  if (!(await persistRefreshToken(refreshToken))) {
    return token;
  }

  const running = inFlightRefreshes.get(refreshToken);
  if (running) return running;

  const key = refreshToken;
  const request = requestNewTokens(token, key).finally(() => {
    inFlightRefreshes.delete(key);
  });
  inFlightRefreshes.set(key, request);

  return request;
}

async function requestNewTokens(
  token: JWT,
  refreshToken: string
): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const resData = await response.json();
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

    // BE 는 갱신할 때마다 리프레시 토큰도 새로 발급하고 옛 토큰을 폐기한다(로테이션).
    // 새 값을 놓치면 다음 갱신이 폐기된 토큰으로 나가 전 기기 로그아웃을 부른다.
    const rotated = readRefreshTokenFromResponse(response);
    if (rotated) {
      await persistRefreshToken(rotated);
    }

    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: rotated ?? refreshToken,
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
