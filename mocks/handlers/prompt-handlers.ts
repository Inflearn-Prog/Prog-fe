import { http, HttpResponse } from "msw";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const onboardingHandlers = [
  http.post(`${BASE_URL}/users/me/onboarding/basic`, async () => {
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
];
