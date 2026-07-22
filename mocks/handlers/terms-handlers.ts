import { http, HttpResponse } from "msw";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const termsHandlers = [
  http.get(`${BASE_URL}/terms`, () => {
    return HttpResponse.json({
      code: "200",
      success: true,
      data: {
        terms: [
          {
            termId: 1,
            title: "이용약관 동의",
            isRequired: true,
            hasDetails: true,
            link: "/terms/terms.html",
          },
          {
            termId: 2,
            title: "개인정보 수집 및 이용 동의",
            isRequired: true,
            hasDetails: true,
            link: "/terms/privacy.html",
          },
          {
            termId: 3,
            title: "마케팅 정보 수신 동의",
            isRequired: false,
            hasDetails: true,
            link: "/terms/marketing.html",
          },
        ],
      },
    });
  }),
  // NOTE(보류): 약관 동의 POST mock 경로 불일치 — 현재 MSW 비활성이라 무해하나, 되살릴 때 수정 필요.
  // 이 핸들러는 `/users/me/terms-agreements`(복수·/me/)를 가로채지만,
  // 실제 회원가입 동의 호출 postTerms()는 `/users/terms-agreement`(단수)로 보낸다.
  // (출처: queries/api/terms.ts:46, API 스펙 apis-260524.md:314)
  // → MSW 재활성화 시 아래 경로를 `/users/terms-agreement`로 고쳐야 가로채진다.
  // 참고: 복수형 /users/me/terms-agreements 는 스펙상 GET(조회)·DELETE(철회) 전용, POST 없음.
  http.post(`${BASE_URL}/users/me/terms-agreements`, async () => {
    return HttpResponse.json({
      code: "200",
      success: true,
      data: {
        userId: 1205,
        isRegistrationComplete: true,
        message: "약관 동의가 성공적으로 처리되었습니다.",
      },
    });
  }),
];
