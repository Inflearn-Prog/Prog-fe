import { http, HttpResponse } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// 사용자 데이터 타입 정의
interface User {
  id: string;
  name: string;
  age: number;
}

// POST 요청 본문 타입 정의
interface CreateUserRequest {
  name: string;
  age: number;
}
export const mswHandlers = [
  http.get(`${baseUrl}/user`, ({ request }) => {
    try {
      // API 로직: 실제로는 DB나 외부 데이터에서 가져옴
      return HttpResponse.json({
        data: [
          { id: "1", name: "user1", age: 21 },
          { id: "2", name: "user2", age: 22 },
          { id: "3", name: "user3", age: 23 },
          { id: "4", name: "user4", age: 24 },
          { id: "5", name: "user5", age: 25 },
          { id: "6", name: "user6", age: 26 },
          { id: "7", name: "user7", age: 27 },
          { id: "8", name: "user8", age: 28 },
          { id: "9", name: "user9", age: 29 },
          { id: "10", name: "user10", age: 30 },
          { id: "11", name: "user11", age: 31 },
        ],
      });
    } catch (error) {
      // 에러 처리: MSW에서 에러 응답 반환
      return HttpResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }
  }),

  http.get(`${baseUrl}/user/:id`, (req) => {
    // jwt 토큰이 안왔을때,
    // if (!req.request.headers.get("Authorization")) {
    //   return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // return HttpResponse.json(
    //   apiErrorResponse(401, "Unauthorized", "Unauthorized")
    // );

    const { id } = req.params;
    // 상단의 데이터 배열에서 해당 id의 유저를 찾음
    const users = [
      { id: "1", name: "user1", age: 21 },
      { id: "2", name: "user2", age: 22 },
      { id: "3", name: "user3", age: 23 },
      { id: "4", name: "user4", age: 24 },
      { id: "5", name: "user5", age: 25 },
      { id: "6", name: "user6", age: 26 },
      { id: "7", name: "user7", age: 27 },
      { id: "8", name: "user8", age: 28 },
      { id: "9", name: "user9", age: 29 },
      { id: "10", name: "user10", age: 30 },
      { id: "11", name: "user11", age: 31 },
    ];
    const user = users.find((u) => u.id === id);
    if (user) {
      return HttpResponse.json({ data: user });
    } else {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }
  }),

  http.post(`${baseUrl}/user`, async (req) => {
    try {
      const body = (await req.request.json()) as CreateUserRequest;
      const { name, age } = body;

      const newUser: User = { id: String(Date.now()), name, age };
      return HttpResponse.json({ data: newUser }, { status: 201 });
    } catch (error) {
      // 요청 본문 파싱 에러 처리
      return HttpResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }),

  http.get(`${baseUrl}/users/me`, () => {
    const data = {
      status: 200,
      success: true,
      data: {
        provider: "google",
        email: "user@example.com" /* TODO : 아마 이 부분 */,
        nickname: "집에가고싶다",
        profileImageUrl: "https://some.profile.image.url.com" /* 이미지 url */,
        kakaoEmail: "siria22@kakao.com",
        googleEmail: null,
        naverEmail: "someNaverEmail@naver.com",
      },
    };

    return HttpResponse.json(data);
  }),
];
