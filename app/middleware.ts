import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import { ROUTES } from "@/lib/routes";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isNewUser = token?.isNewUser;
    const { pathname } = req.nextUrl;
    // 신규 유저인데 회원가입 페이지가 아닌 곳에 접근하면 가입 페이지로 리다이렉트
    if (isNewUser && pathname !== `${ROUTES.auth.SIGNUP}`) {
      return NextResponse.redirect(new URL(`${ROUTES.auth.SIGNUP}`, req.url));
    }
    // 이미 가입된 유저인데 가입 페이지에 접근하려 하면 메인으로 리다이렉트
    if (token && !isNewUser && pathname === `${ROUTES.auth.SIGNUP}`) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    // 로그인이 되어 있는 유저만 위의 middleware 함수가 실행되도록 설정
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname === "/") return true;
        return !!token;
      },
    },
  }
);

export const config = {
  /*
   * 아래 경로를 제외한 모든 경로에서 미들웨어 실행:
   * - api (API 라우트)
   * - _next/static (정적 파일)
   * - _next/image (이미지 최적화 파일)
   * - 이미지 파일
   * - favicon.ico (파비콘)
   * - auth/signin (로그인 페이지)
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth/signin).*)",
  ],
};
