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
            link: "https://prog.notion.site/terms-1",
          },
          {
            termId: 2,
            title: "개인정보 수집 및 이용 동의",
            isRequired: true,
            hasDetails: true,
            link: "https://prog.notion.site/terms-2",
          },
          {
            termId: 3,
            title: "마케팅 정보 수신 동의",
            isRequired: false,
            hasDetails: true,
            link: "https://prog.notion.site/terms-3",
          },
        ],
      },
    });
  }),
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
