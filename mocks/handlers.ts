import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.example.com/api/user", () => {
    return HttpResponse.json({
      data: {
        name: "handongryong",
        age: 25,
      },
    });
  }),
];
