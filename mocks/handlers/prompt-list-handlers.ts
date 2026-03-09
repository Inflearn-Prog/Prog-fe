/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from "msw";

const MOCK_PROMPTS = [
  {
    id: 1,
    userId: 101,
    category: "FRONTEND",
    title: "React의 가상 DOM 원리",
    content: "가상 DOM에 대해 설명해주세요.",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
    userName: "프론트엔드마스터",
    userIcon: "https://example.com/user101.png",
    userDesc: "프론트엔드 개발자입니다.",
    likes: 120,
    isLiked: true,
  },
  {
    id: 2,
    userId: 102,
    category: "BACKEND",
    title: "백엔드 아키텍처 설계",
    content: "MSA 아키텍처 설계 방법",
    createdAt: "2024-03-02T11:00:00Z",
    updatedAt: "2024-03-02T11:00:00Z",
    userName: "백엔드고수",
    userIcon: "https://example.com/user102.png",
    userDesc: "백엔드 개발자입니다.",
    likes: 85,
    isLiked: false,
  },
  {
    id: 3,
    userId: 103,
    category: "AI",
    title: "오늘의 핫한 AI 프롬프트",
    content: "LLM 최적화 방법",
    createdAt: "2024-03-03T12:00:00Z",
    updatedAt: "2024-03-03T12:00:00Z",
    userName: "AI연구원",
    userIcon: "https://example.com/user103.png",
    userDesc: "AI 연구원입니다.",
    likes: 200,
    isLiked: false,
  },
];

const MOCK_COMMENTS = [
  {
    commentId: 1,
    nickName: "개발왕",
    comment: "좋은 프롬프트네요!",
    parentId: null,
    createdAt: "2024-03-04T10:00:00Z",
    updatedAt: "2024-03-04T10:00:00Z",
  },
  {
    commentId: 2,
    nickName: "코딩맨",
    comment: "동의합니다!",
    parentId: 1,
    createdAt: "2024-03-04T11:00:00Z",
    updatedAt: "2024-03-04T11:00:00Z",
  },
];

const getTimestamp = () => new Date().toISOString();
interface ReportRequestBody {
  targetType: "PROMPT" | "COMMENT";
  targetId: number;
  reason:
    | "SPAM_AD"
    | "INAPPROPRIATE_EXPRESSION"
    | "NOT_WORKING"
    | "PLAGIARISM"
    | "OTHER";
  reasonDetail: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const promptListHandlers = [
  //API 명세서 업데이트되면 맞춰서 수정해야함.
  http.get(`${BASE_URL}/prompts`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const page = parseInt(url.searchParams.get("page") || "1");
    const size = parseInt(url.searchParams.get("size") || "10");

    let filteredData =
      !category || category === "all"
        ? MOCK_PROMPTS
        : MOCK_PROMPTS.filter((p) => p.category === category);

    const rankedData = filteredData.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    const start = (page - 1) * size;
    const end = start + size;
    const slicedData = rankedData.slice(start, end);

    const isLast = end >= rankedData.length;

    return HttpResponse.json({
      items: slicedData,
      nextPage: isLast ? null : page + 1,
      isLast: isLast,
    });
  }),
  http.post(`${BASE_URL}/prompts/like/:promptId`, ({ params }) => {
    const { promptId } = params;

    return HttpResponse.json(
      {
        message: "좋아요 처리가 완료되었습니다.",
        id: promptId,
      },
      { status: 200 }
    );
  }),
  http.delete(`${BASE_URL}/prompts/like/:promptId`, ({ params }) => {
    const { promptId } = params;

    console.log(`Prompt ${promptId} 좋아요 취소됨`);

    return HttpResponse.json(
      {
        message: "좋아요 취소가 완료되었습니다.",
        id: promptId,
      },
      { status: 200 }
    );
  }),
  http.post(`${BASE_URL}/reports`, async ({ request }) => {
    const body = (await request.json()) as ReportRequestBody;
    const { targetType, targetId, reason, reasonDetail } = body;

    if (reason === "OTHER" && (!reasonDetail || reasonDetail.trim() === "")) {
      return HttpResponse.json(
        {
          success: false,
          code: "409",
          error: {
            errorClassName: "INVALID_INPUT_VALUE",
            message: "신고 상세 사유를 입력해주세요.",
          },
          timestamp: getTimestamp(),
        },
        { status: 409 }
      );
    }
    if (reasonDetail && reasonDetail.length > 200) {
      return HttpResponse.json(
        {
          success: false,
          code: "409",
          error: {
            errorClassName: "TEXT_TOO_LONG",
            message: "200자를 초과할 수 없습니다.",
          },
          timestamp: getTimestamp(),
        },
        { status: 409 }
      );
    }
    if (targetId === 999) {
      return HttpResponse.json(
        {
          success: false,
          code: "400",
          error: {
            errorClassName: "CANNOT_REPORT_SELF",
            message: "자신의 컨텐츠를 신고할 수 없습니다.",
          },
          timestamp: getTimestamp(),
        },
        { status: 400 }
      );
    }

    if (targetId === 888) {
      return HttpResponse.json(
        {
          success: false,
          code: "409",
          error: {
            errorClassName: "ALREADY_REPORTED",
            message: "이미 신고된 항목입니다.",
          },
          timestamp: getTimestamp(),
        },
        { status: 409 }
      );
    }
    return HttpResponse.json(
      {
        success: true,
        code: "201",
        data: {
          targetType,
          targetId,
          reporterId: 22,
          createdAt: getTimestamp().split(".")[0],
        },
        timestamp: getTimestamp(),
      },
      { status: 201 }
    );
  }),

  http.post(`${BASE_URL}/prompts`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      status: 201,
      success: true,
      data: {
        promptId: 999,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: "프롬프트가 생성되었습니다.",
    });
  }),

  // 프롬프트 상세 조회
  http.get(`${BASE_URL}/prompts/:promptId`, ({ params }) => {
    const { promptId } = params;
    const prompt =
      MOCK_PROMPTS.find((p) => p.id === Number(promptId)) || MOCK_PROMPTS[0];
    return HttpResponse.json({
      status: 200,
      success: true,
      data: prompt,
      message: "프롬프트 상세 조회가 완료되었습니다.",
    });
  }),

  // 프롬프트 수정
  http.put(`${BASE_URL}/prompts/:promptId`, async ({ params, request }) => {
    const { promptId } = params;
    const body = (await request.json()) as any;
    return HttpResponse.json({
      status: 200,
      success: true,
      data: {
        promptId: Number(promptId),
        ...body,
        updatedAt: new Date().toISOString(),
      },
      message: "프롬프트가 수정되었습니다.",
    });
  }),

  // 프롬프트 삭제
  http.delete(`${BASE_URL}/prompts/:promptId`, ({ params }) => {
    const { promptId } = params;
    return HttpResponse.json({
      status: 200,
      success: true,
      message: "프롬프트가 삭제되었습니다.",
    });
  }),

  // 2. 프롬프트 조회 및 검색 (User)
  // 최신순 조회
  http.get(`${BASE_URL}/prompts/createDesc`, () => {
    const sorted = [...MOCK_PROMPTS].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return HttpResponse.json({
      status: 200,
      success: true,
      data: sorted,
    });
  }),

  // 좋아요순 조회
  http.get(`${BASE_URL}/prompts/likeDesc`, () => {
    const sorted = [...MOCK_PROMPTS].sort(
      (a, b) => (b.likes || 0) - (a.likes || 0)
    );
    return HttpResponse.json({
      status: 200,
      success: true,
      data: sorted,
    });
  }),

  // 오늘 핫한 프롬프트
  http.get(`${BASE_URL}/prompts/today-hot`, () => {
    return HttpResponse.json({
      status: 200,
      success: true,
      data: MOCK_PROMPTS.slice(0, 5),
    });
  }),

  // 제목 검색
  http.get(`${BASE_URL}/prompts/search/:keyword`, ({ params }) => {
    const { keyword } = params;
    const filtered = MOCK_PROMPTS.filter((p) =>
      p.title.includes(keyword as string)
    );
    return HttpResponse.json({
      status: 200,
      success: true,
      data: filtered,
    });
  }),

  // 좋아요/취소 토글
  http.post(`${BASE_URL}/prompts/:promptId/like`, ({ params }) => {
    const { promptId } = params;
    return HttpResponse.json({
      status: 200,
      success: true,
      message: `프롬프트 ${promptId} 좋아요 처리 완료`,
    });
  }),

  // 3. 프롬프트 댓글 관리 (User)
  // 댓글 목록 조회
  http.get(`${BASE_URL}/api/v1/comment/:promptId`, ({ params }) => {
    return HttpResponse.json({
      status: 200,
      success: true,
      data: MOCK_COMMENTS,
    });
  }),

  // 댓글 작성
  http.post(`${BASE_URL}/api/v1/comment/:promptId`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      status: 201,
      success: true,
      data: {
        commentId: 100,
        nickName: "작성자",
        ...body,
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // 대댓글 작성
  http.post(
    `${BASE_URL}/api/v1/comment/:promptId/:commentId`,
    async ({ params, request }) => {
      const { commentId } = params;
      const body = (await request.json()) as any;
      return HttpResponse.json({
        status: 201,
        success: true,
        data: {
          commentId: 200,
          nickName: "답글작성자",
          ...body,
          parentId: Number(commentId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  ),

  // 댓글 수정
  http.patch(
    `${BASE_URL}/api/v1/comment/:commentId`,
    async ({ params, request }) => {
      const body = (await request.json()) as any;
      return HttpResponse.json({
        status: 200,
        success: true,
        data: {
          commentId: Number(params.commentId),
          ...body,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  ),

  // 댓글 삭제
  http.delete(`${BASE_URL}/api/v1/comment/:commentId`, ({ params }) => {
    return HttpResponse.json({
      status: 200,
      success: true,
      message: "댓글이 삭제되었습니다.",
    });
  }),
];
