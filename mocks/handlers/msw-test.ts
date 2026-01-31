import { http, HttpResponse } from "msw";

const baseUrl = "https://api.example.com";
export const mswHandlers = [
  http.get(`${baseUrl}/api/user`, () => {
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

  http.get(`${baseUrl}/api/user/:id`, (req) => {
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
];
