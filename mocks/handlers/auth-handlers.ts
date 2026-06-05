import { http, HttpResponse } from "msw";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const authHandlers = [
  http.post(`${BASE_URL}/auth/social-login`, async ({ request }) => {
    const { provider, authCode } = (await request.json()) as {
      provider: string;
      authCode: string;
    };

    if (!["KAKAO", "NAVER"].includes(provider.toUpperCase())) {
      return HttpResponse.json(
        {
          code: "400",
          success: false,
          data: {
            errorClassName: "INVALID_PROVIDER",
            message: "유효하지 않은 프로바이더",
          },
        },
        { status: 400 }
      );
    }
    if (authCode === "expired_token") {
      return HttpResponse.json(
        {
          code: "401",
          success: false,
          data: {
            errorClassName: "ACCESS_TOKEN_EXPIRED",
            message: "액세스 토큰 만료",
          },
        },
        { status: 401 }
      );
    }

    const isNewUser = true;

    return HttpResponse.json({
      code: "200",
      timestamp: new Date().toISOString(),
      success: true,
      data: {
        isNewUser: isNewUser,
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlcmFzZSI6Im1vY2siLCJleHAiOjQ3Njg4MzIwMDB9.signature",
      },
    });
  }),
  http.post(`${BASE_URL}/auth/logout`, () => {
    return HttpResponse.json(
      {
        success: true,
        code: "200",
        data: {},
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }),
  http.delete(`${BASE_URL}/users/me`, async () => {
    return HttpResponse.json(
      {
        success: true,
        code: "200",
        data: {
          uid: "kakao_1234567890",
          unlinkedProvider: "KAKAO",
          terminatedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }),
];
