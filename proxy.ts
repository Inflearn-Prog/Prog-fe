import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  if (nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isSignIn = !!session;
  const isNewUser = session?.isNewUser;
  const regStatus = session?.registrationStatus;
  const protectedRoutes = [ROUTES.mypage.ROOT];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  // 2. 인증 관련 경로 (로그인, 가입)
  const isAuthRoute =
    pathname === ROUTES.auth.SIGNIN || pathname === ROUTES.auth.SIGNUP;

  // 로그인을 안 했는데 보호된 페이지(마이페이지)에 접근한 경우
  if (!isSignIn && isProtectedRoute) {
    const signInUrl = new URL(ROUTES.auth.SIGNIN, nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }
  const statusToStepMap: Record<string, string> = {
    SOCIAL_LOGIN_ONLY: "select",
    TERMS_AGREED: "pick-option",
    NICKNAME_REGISTERED: "detail",
    BASIC_INFO_COMPLETED: "preview",
    CAREER_INFO_COMPLETED: "complete",
  };

  const targetStep = statusToStepMap[regStatus as string];
  const currentStep = nextUrl.searchParams.get("step");

  if (isSignIn) {
    // 신규 유저인데 가입 페이지가 아닌 곳에 있다면 가입 페이지로
    if (targetStep && currentStep !== targetStep) {
      const url = new URL("/signup", nextUrl.origin);
      url.searchParams.set("step", targetStep);
      return NextResponse.redirect(url);
    }

    // 가입 완료 유저가 가입/로그인 페이지 접근 시 메인으로
    if (!isNewUser && isAuthRoute) {
      return NextResponse.redirect(new URL(ROUTES.rank.ROOT, nextUrl.origin));
    }
  }
  // 그 외(메인, 랭킹 페이지 등)는 모두 통과
  return NextResponse.next();
});

// matcher 설정
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|mockServiceWorker.js|auth-callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
