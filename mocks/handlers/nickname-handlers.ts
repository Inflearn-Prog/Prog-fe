import { http, HttpResponse } from "msw";

const BASE_URL = "http://localhost:8080";

export const nicknameHandlers = [
  http.get(`${BASE_URL}/users/nickname/availability`, ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get("nickname");

    if (!nickname) {
      return new HttpResponse(null, { status: 400 });
    }

    if (nickname === "admin") {
      return HttpResponse.json(
        {
          isAvailable: false,
          message: "이미 사용 중인 닉네임입니다.",
        },
        { status: 409 }
      );
    }

    return HttpResponse.json(
      {
        isAvailable: true,
        message: "사용 가능한 닉네임입니다.",
      },
      { status: 200 }
    );
  }),
];
