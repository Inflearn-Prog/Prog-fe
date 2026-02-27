import { http, HttpResponse } from "msw";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const onboardingHandlers = [
  http.put(`${BASE_URL}/users/me/onboarding/basic`, async () => {
    return HttpResponse.json({
      status: 200,
      success: true,
      data: {
        userId: 1205,
        nextStep: "CAREER_INFO",
        message: "기본 정보가 저장되었습니다.",
      },
    });
  }),
  http.put(`${BASE_URL}/users/me/onboarding/career`, async () => {
    return HttpResponse.json({
      status: 200,
      success: true,
      data: {
        message: "커리어 정보가 성공적으로 저장되었습니다.",
        nextStep: "CAREER_DETAILS",
      },
    });
  }),
];
