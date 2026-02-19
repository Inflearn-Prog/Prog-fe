// proxy.ts (또는 middleware.ts)
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  const isDevelopment = process.env.NODE_ENV === "development";
  const isSignIn = isDevelopment ? true : !!session;

  const isNewUser = session?.isNewUser;

  // 2. 공통 허용 경로 (메인, MSW 등)
  if (
    nextUrl.pathname === "/" ||
    nextUrl.pathname === "/mockServiceWorker.js"
  ) {
    return NextResponse.next();
  }

  // 3. 비로그인 유저 처리
  if (!isSignIn) {
    // 로그인 페이지는 통과, 그 외엔 로그인으로 리다이렉트
    if (nextUrl.pathname !== "/signin") {
      const signInUrl = new URL("/signin", nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // 4. 신규 유저 처리 (로그인은 했지만 가입 전)
  if (isNewUser && nextUrl.pathname !== ROUTES.auth.SIGNUP) {
    return NextResponse.redirect(new URL(ROUTES.auth.SIGNUP, nextUrl.origin));
  }

  // 5. 가입 완료 유저가 다시 가입 페이지 접근 시
  if (!isNewUser && nextUrl.pathname === ROUTES.auth.SIGNUP) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
});

// matcher 설정
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|mockServiceWorker.js|auth-callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
