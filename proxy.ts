import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  if (nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.includes("users")) {
    return NextResponse.next();
  }

  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";
  const isSignIn = bypassAuth ? true : !!session;
  const isNewUser = bypassAuth ? false : session?.isNewUser;
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
    NICKNAME_REGISTERED: "detail", // DB 상태 기준 시작점
  };

  const targetStep = statusToStepMap[regStatus as string];
  const currentStep = nextUrl.searchParams.get("step");

  if (isSignIn) {
    if (isNewUser) {
      if (currentStep !== "complete") {
        if (regStatus === "NICKNAME_REGISTERED") {
          const allowedFinalSteps = ["detail", "preview", "complete"];
          if (!allowedFinalSteps.includes(currentStep as string)) {
            const url = new URL("/signup", nextUrl.origin);
            url.searchParams.set("step", "detail");
            return NextResponse.redirect(url);
          }
        } else if (targetStep && currentStep !== targetStep) {
          const url = new URL("/signup", nextUrl.origin);
          url.searchParams.set("step", targetStep);
          return NextResponse.redirect(url);
        }
      }
    }
    const isCompleted = regStatus === "ONBOARDING_COMPLETED";
    if (isCompleted) {
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/", nextUrl.origin));
      }
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isProd = process.env.NODE_ENV === "production";
  const scriptSrc = isProd
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`;

  const cspHeader = [
    "default-src 'self'",
    scriptSrc,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, // 필요시 스타일에도 'nonce-${nonce}' 교체 가능
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    `connect-src 'self' ${process.env.NEXT_PUBLIC_BACKEND_API_URL || ""}`,
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
});

// matcher 설정
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|mockServiceWorker.js|auth-callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
