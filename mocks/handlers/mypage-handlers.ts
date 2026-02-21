import { http, HttpResponse } from "msw";

import { UserProfileResponse, UserPromptsResponse } from "@/queries/api/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080/api/v1";

export const mypageHandlers = [
  http.get(`${BASE_URL}/users/me/profile`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return new HttpResponse(null, { status: 401 });
    }

    return HttpResponse.json<UserProfileResponse>({
      success: true,
      status: 200,
      data: {
        basicInfo: {
          uid: "user_12345",
          nickname: "prog_user",
          email: "user@example.com",
          provider: "KAKAO",
          introduction: "안녕하세요, 기획자를 꿈꾸는 유저입니다.",
        },
        careerInfo: {
          currentStatus: ["JOB_SEEKER", "STUDENT"],
          targetJob: ["PLANNING", "PM"],
          careerYear: "신입",
          education: "BACHELOR",
          major: "산업디자인학과",
        },
        selfIntro: {
          experiences: [],
          keywords: ["서비스 기획", "데이터 분석", "커뮤니케이션"],
        },
      },
    });
  }),
  http.get(`${BASE_URL}/users/:userId/prompts`, ({ request, params }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "0");
    const size = Number(url.searchParams.get("size") || "4");
    const { userId } = params;

    return HttpResponse.json<UserPromptsResponse>({
      success: true,
      status: 200,
      data: {
        content: [
          {
            promptId: 1024 + page,
            title: `${userId}번 유저의 ${page + 1}페이지 프롬프트`,
            description: "자소서를 위한 GPT 프롬프트 설명입니다.",
            hasPreview: true,
            canCopy: true,
            createdAt: "2025-12-23T14:00:00",
            isLiked: true,
          },
        ],
        pageInfo: {
          currentPage: page,
          pageSize: size,
          totalElements: 45,
          totalPages: Math.ceil(45 / size),
          isLast: page >= Math.ceil(45 / size) - 1,
        },
      },
    });
  }),
  http.get(`${BASE_URL}/users/:userId/liked`, ({ request, params }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "0");
    const size = Number(url.searchParams.get("size") || "4");
    const { userId } = params;

    return HttpResponse.json<UserPromptsResponse>({
      success: true,
      status: 200,
      data: {
        content: [
          {
            promptId: 1024 + page,
            title: `${userId}번 유저의 ${page + 1}페이지 프롬프트`,
            description: "자소서를 위한 GPT 프롬프트 설명입니다.",
            hasPreview: true,
            canCopy: true,
            createdAt: "2025-12-23T14:00:00",
            isLiked: true,
          },
        ],
        pageInfo: {
          currentPage: page,
          pageSize: size,
          totalElements: 45,
          totalPages: Math.ceil(45 / size),
          isLast: page >= Math.ceil(45 / size) - 1,
        },
      },
    });
  }),
  http.put(`${BASE_URL}/users/me/profile`, async ({ request }) => {
    const updateData = await request.json();

    const isProfanity = JSON.stringify(updateData).includes("바보");

    if (isProfanity) {
      return HttpResponse.json(
        {
          success: false,
          code: "400",
          error: {
            errorClassName: "PROFANITY_DETECTED",
            message: "사용할 수 없는 단어가 포함되어 있습니다: [바보]",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    return HttpResponse.json(
      {
        success: true,
        code: "200",
        data: {
          message: "프로필 정보가 성공적으로 저장되었습니다.",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }),
];
