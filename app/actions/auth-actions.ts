"use server";

import { cookies } from "next/headers";

const REFRESH_TOKEN_COOKIE = "refresh_token";

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * 로그아웃을 서버에서 처리한다.
 *
 * refresh_token 은 keep-prog.com 에 httpOnly 로 있어 브라우저가 api.keep-prog.com 으로
 * 직접 보낼 수 없다. 서버가 Cookie 헤더에 실어야 BE 가 DB 의 토큰을 폐기한다.
 * 클라이언트에서 그냥 호출하면 BE 는 토큰 없이 받아 아무것도 폐기하지 않는다.
 */
export async function logoutOnServer() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/logout`, {
        method: "POST",
        headers: { Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}` },
      });
    } catch (error) {
      // 서버 폐기에 실패해도 로컬 세션은 끊는다.
      console.error("Failed to revoke refresh token:", error);
    }
  }

  cookieStore.delete("accessToken");
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
