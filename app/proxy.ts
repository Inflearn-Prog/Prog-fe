import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isSignIn = !!session;
  const isNewUser = session?.user?.isNewUser;

  // 보안 헤더 주입
  const response = NextResponse.next();
  response.headers.set(
    "x-auth-status",
    isSignIn ? "authenticated" : "unauthenticated"
  );

  // 공통 허용 경로
  if (nextUrl.pathname === "/") return response;

  // 로그인은 했지만 신규 유저라면 가입 페이지 외의 다른 곳으로 가는 것을 제한
  if (isSignIn && isNewUser && nextUrl.pathname !== ROUTES.auth.SIGNUP) {
    return NextResponse.redirect(new URL(ROUTES.auth.SIGNUP, nextUrl.origin));
  }

  // 이미 가입된 사람이 가입 페이지(/signup)에 접근하면 메인으로
  if (isSignIn && !isNewUser && nextUrl.pathname === ROUTES.auth.SIGNUP) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return response;
});

export const config = {
  /*
   * 아래 경로를 제외한 모든 경로에서 미들웨어 실행:
   * - api (API 라우트)
   * - _next/static (정적 파일)
   * - _next/image (이미지 최적화 파일)
   * - 이미지 파일
   * - favicon.ico (파비콘)
   * - /signin (로그인 페이지)
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|signin).*)",
  ],
};
