/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from "msw";

const MOCK_CATEGORIES = [
  { categoryId: 1, name: "개발", description: "개발 관련 프롬프트" },
  { categoryId: 2, name: "마케팅/콘텐츠", description: "마케팅 관련 프롬프트" },
  {
    categoryId: 3,
    name: "서비스기획",
    description: "서비스 기획 관련 프롬프트",
  },
  { categoryId: 4, name: "인사/총무", description: "인사/총무 관련 프롬프트" },
  { categoryId: 5, name: "디자인", description: "디자인 관련 프롬프트" },
];

const MOCK_PROMPTS = [
  {
    promptId: 1,
    userId: 101,
    category: MOCK_CATEGORIES[0],
    title: "React의 가상 DOM 원리",
    content: "가상 DOM에 대해 설명해주세요.",
    createdAt: "2024-03-01T10:00:00",
    updatedAt: "2024-03-01T10:00:00",
  },
  {
    promptId: 2,
    userId: 102,
    category: MOCK_CATEGORIES[0],
    title: "백엔드 아키텍처 설계",
    content: "MSA 아키텍처 설계 방법",
    createdAt: "2024-03-02T11:00:00",
    updatedAt: "2024-03-02T11:00:00",
  },
  {
    promptId: 3,
    userId: 103,
    category: MOCK_CATEGORIES[0],
    title: "오늘의 핫한 AI 프롬프트",
    content: "LLM 최적화 방법",
    createdAt: "2024-03-03T12:00:00",
    updatedAt: "2024-03-03T12:00:00",
  },
];

const MOCK_COMMENTS = [
  {
    commentId: 1,
    nickName: "개발왕",
    comment: "좋은 프롬프트네요!",
    parentId: null,
    createdAt: "2024-03-04T10:00:00",
    updatedAt: "2024-03-04T10:00:00",
  },
  {
    commentId: 2,
    nickName: "코딩맨",
    comment: "동의합니다!",
    parentId: 1,
    createdAt: "2024-03-04T11:00:00",
    updatedAt: "2024-03-04T11:00:00",
  },
];

const getTimestamp = () => new Date().toISOString().split(".")[0];

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
  // 카테고리 목록 조회
  http.get(`${BASE_URL}/categories`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { categories: MOCK_CATEGORIES },
      timestamp: getTimestamp(),
    });
  }),

  // 프롬프트 목록 조회
  http.get(`${BASE_URL}/prompts`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const size = parseInt(url.searchParams.get("size") || "20");

    const start = page * size;
    const end = start + size;
    const slicedData = MOCK_PROMPTS.slice(start, end);

    return HttpResponse.json({
      success: true,
      code: "200",
      data: {
        prompts: slicedData,
        totalCount: MOCK_PROMPTS.length,
      },
      timestamp: getTimestamp(),
    });
  }),

  // 프롬프트 생성
  http.post(`${BASE_URL}/prompts`, async ({ request }) => {
    const body = (await request.json()) as any;
    const category =
      MOCK_CATEGORIES.find((c) => c.categoryId === body.categoryId) ??
      MOCK_CATEGORIES[0];
    return HttpResponse.json({
      success: true,
      code: "200",
      data: {
        promptId: 999,
        userId: 1,
        category,
        title: body.title,
        content: body.content,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      timestamp: getTimestamp(),
    });
  }),

  // 프롬프트 상세 조회
  http.get(`${BASE_URL}/prompts/:promptId`, ({ params }) => {
    const { promptId } = params;
    const prompt =
      MOCK_PROMPTS.find((p) => p.promptId === Number(promptId)) ??
      MOCK_PROMPTS[0];
    return HttpResponse.json({
      success: true,
      code: "200",
      data: prompt,
      timestamp: getTimestamp(),
    });
  }),

  // 프롬프트 수정
  http.put(`${BASE_URL}/prompts/:promptId`, async ({ params, request }) => {
    const { promptId } = params;
    const body = (await request.json()) as any;
    const existing =
      MOCK_PROMPTS.find((p) => p.promptId === Number(promptId)) ??
      MOCK_PROMPTS[0];
    const category = body.categoryId
      ? (MOCK_CATEGORIES.find((c) => c.categoryId === body.categoryId) ??
        existing.category)
      : existing.category;
    return HttpResponse.json({
      success: true,
      code: "200",
      data: {
        ...existing,
        ...body,
        category,
        promptId: Number(promptId),
        updatedAt: getTimestamp(),
      },
      timestamp: getTimestamp(),
    });
  }),

  // 프롬프트 삭제
  http.delete(`${BASE_URL}/prompts/:promptId`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: null,
      timestamp: getTimestamp(),
    });
  }),

  // 최신순 조회
  http.get(`${BASE_URL}/prompts/createDesc`, () => {
    const sorted = [...MOCK_PROMPTS].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { prompts: sorted, totalCount: sorted.length },
      timestamp: getTimestamp(),
    });
  }),

  // 좋아요순 조회
  http.get(`${BASE_URL}/prompts/likeDesc`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { prompts: MOCK_PROMPTS, totalCount: MOCK_PROMPTS.length },
      timestamp: getTimestamp(),
    });
  }),

  // 오늘 핫한 프롬프트
  http.get(`${BASE_URL}/prompts/today-hot`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: MOCK_PROMPTS.slice(0, 5),
      timestamp: getTimestamp(),
    });
  }),

  // 제목 검색
  http.get(`${BASE_URL}/prompts/search/:keyword`, ({ params }) => {
    const { keyword } = params;
    const filtered = MOCK_PROMPTS.filter((p) =>
      p.title.includes(keyword as string)
    );
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { prompts: filtered, totalCount: filtered.length },
      timestamp: getTimestamp(),
    });
  }),

  // 좋아요 토글
  http.post(`${BASE_URL}/prompts/:promptId/like`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { likeStatus: "LIKE" },
      timestamp: getTimestamp(),
    });
  }),

  // 댓글 목록 조회
  http.get(`${BASE_URL}/comment/:promptId`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: {
        content: MOCK_COMMENTS,
        hasNext: false,
        numberOfElements: MOCK_COMMENTS.length,
        size: 20,
        number: 0,
        first: true,
        last: true,
        empty: false,
      },
      timestamp: getTimestamp(),
    });
  }),

  // 댓글 작성
  http.post(`${BASE_URL}/comment/:promptId`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      code: "200",
      data: {
        commentId: 100,
        nickName: "작성자",
        comment: body.comment,
        parentId: null,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      timestamp: getTimestamp(),
    });
  }),

  // 대댓글 작성
  http.post(
    `${BASE_URL}/comment/:promptId/:commentId`,
    async ({ params, request }) => {
      const { commentId } = params;
      const body = (await request.json()) as any;
      return HttpResponse.json({
        success: true,
        code: "200",
        data: {
          commentId: 200,
          nickName: "답글작성자",
          comment: body.comment,
          parentId: Number(commentId),
          createdAt: getTimestamp(),
          updatedAt: getTimestamp(),
        },
        timestamp: getTimestamp(),
      });
    }
  ),

  // 댓글 수정
  http.patch(`${BASE_URL}/comment/:commentId`, async ({ params, request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      code: "200",
      data: {
        commentId: Number(params.commentId),
        nickName: "작성자",
        comment: body.comment,
        parentId: null,
        createdAt: "2024-03-04T10:00:00",
        updatedAt: getTimestamp(),
      },
      timestamp: getTimestamp(),
    });
  }),

  // 댓글 삭제
  http.delete(`${BASE_URL}/comment/:commentId`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: null,
      timestamp: getTimestamp(),
    });
  }),

  // 신고
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
          createdAt: getTimestamp(),
        },
        timestamp: getTimestamp(),
      },
      { status: 201 }
    );
  }),
];
