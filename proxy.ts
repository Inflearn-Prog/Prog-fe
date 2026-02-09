import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export async function proxy(req: NextRequest) {
  // 1. 세션 정보 가져오기
  const session = await auth();
  const { nextUrl } = req;

  const isSignIn = !!session;
  const isNewUser = session?.isNewUser;

  // 2. 공통 허용 경로 (메인, MSW 등)
  if (
    nextUrl.pathname === "/" ||
    nextUrl.pathname === "/mockServiceWorker.js"
  ) {
    return NextResponse.next();
  }

  // 3. 비로그인 유저가 보호된 경로에 접근할 때
  if (!isSignIn) {
    if (nextUrl.pathname !== "/signin") {
      const signInUrl = new URL("/signin", nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // 4. 신규 유저 리다이렉트 (가입 페이지로)
  if (isNewUser === false && nextUrl.pathname !== ROUTES.auth.SIGNUP) {
    return NextResponse.redirect(new URL(ROUTES.auth.SIGNUP, nextUrl.origin));
  }

  // 5. 가입 완료 유저가 다시 가입 페이지 접근 시
  if (!isNewUser && nextUrl.pathname === ROUTES.auth.SIGNUP) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
}

// 로그가 찍혔던 matcher 설정을 그대로 유지하세요
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|mockServiceWorker.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
