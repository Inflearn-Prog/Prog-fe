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

const MOCK_PROMPTS_DETAIL = [
  {
    promptId: 1,
    userId: 101,
    category: MOCK_CATEGORIES[0],
    title: "React의 가상 DOM 원리",
    content: "가상 DOM에 대해 설명해주세요.",
    createdAt: "2024-03-01T10:00:00",
    updatedAt: "2024-03-01T10:00:00",
    userName: "김개발",
    userIcon: null,
    userDesc: "프론트엔드 개발자입니다.",
    isLiked: false,
    likes: 0,
    visibility: "PUBLIC" as const,
  },
  {
    promptId: 2,
    userId: 102,
    category: MOCK_CATEGORIES[0],
    title: "백엔드 아키텍처 설계",
    content: "MSA 아키텍처 설계 방법",
    createdAt: "2024-03-02T11:00:00",
    updatedAt: "2024-03-02T11:00:00",
    userName: "이서버",
    userIcon: null,
    userDesc: "백엔드 엔지니어입니다.",
    isLiked: false,
    likes: 0,
    visibility: "PUBLIC" as const,
  },
  {
    promptId: 3,
    userId: 103,
    category: MOCK_CATEGORIES[0],
    title: "오늘의 핫한 AI 프롬프트",
    content: "LLM 최적화 방법",
    createdAt: "2024-03-03T12:00:00",
    updatedAt: "2024-03-03T12:00:00",
    userName: "박에이아이",
    userIcon: null,
    userDesc: null,
    isLiked: false,
    likes: 0,
    visibility: "PUBLIC" as const,
  },
  {
    promptId: 100,
    userId: 101,
    category: MOCK_CATEGORIES[1],
    title: "비공개 마케팅 프롬프트",
    content: "비공개 내용입니다.",
    createdAt: "2024-03-04T09:00:00",
    updatedAt: "2024-03-04T09:00:00",
    userName: "김개발",
    userIcon: null,
    userDesc: "프론트엔드 개발자입니다.",
    isLiked: false,
    likes: 0,
    visibility: "PRIVATE" as const,
  },
];

const toSummary = (p: (typeof MOCK_PROMPTS_DETAIL)[number]) => ({
  promptId: p.promptId,
  userId: p.userId,
  nickname: p.userName,
  category: p.category,
  title: p.title,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
  isLiked: p.isLiked,
});

const toDetail = (p: (typeof MOCK_PROMPTS_DETAIL)[number]) => ({
  promptId: p.promptId,
  userId: p.userId,
  category: p.category,
  title: p.title,
  content: p.content,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
  userName: p.userName,
  userIcon: p.userIcon,
  userDesc: p.userDesc,
  isLiked: p.isLiked,
  likes: p.likes,
});

const publicPrompts = () =>
  MOCK_PROMPTS_DETAIL.filter((p) => p.visibility === "PUBLIC");

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

    const all = publicPrompts();
    const start = page * size;
    const end = start + size;
    const slicedData = all.slice(start, end).map(toSummary);

    return HttpResponse.json({
      success: true,
      code: "200",
      data: {
        prompts: slicedData,
        totalCount: all.length,
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
        userName: "작성자",
        userIcon: null,
        userDesc: null,
        isLiked: false,
        likes: 0,
      },
      timestamp: getTimestamp(),
    });
  }),

  // 프롬프트 상세 조회 (비로그인 허용, PRIVATE은 작성자만)
  http.get(`${BASE_URL}/prompts/:promptId`, ({ params }) => {
    const { promptId } = params;
    const prompt = MOCK_PROMPTS_DETAIL.find(
      (p) => p.promptId === Number(promptId)
    );

    if (!prompt) {
      return HttpResponse.json(
        {
          success: false,
          code: "404",
          error: {
            errorClassName: "PROMPT_NOT_FOUND",
            message: "존재하지 않는 프롬프트입니다.",
          },
          timestamp: getTimestamp(),
        },
        { status: 404 }
      );
    }

    if (prompt.visibility === "PRIVATE") {
      return HttpResponse.json(
        {
          success: false,
          code: "403",
          error: {
            errorClassName: "ACCESS_DENIED",
            message: "접근 권한이 없습니다.",
          },
          timestamp: getTimestamp(),
        },
        { status: 403 }
      );
    }

    return HttpResponse.json({
      success: true,
      code: "200",
      data: toDetail(prompt),
      timestamp: getTimestamp(),
    });
  }),

  // 프롬프트 수정
  http.put(`${BASE_URL}/prompts/:promptId`, async ({ params, request }) => {
    const { promptId } = params;
    const body = (await request.json()) as any;
    const existing =
      MOCK_PROMPTS_DETAIL.find((p) => p.promptId === Number(promptId)) ??
      MOCK_PROMPTS_DETAIL[0];
    const category = body.categoryId
      ? (MOCK_CATEGORIES.find((c) => c.categoryId === body.categoryId) ??
        existing.category)
      : existing.category;
    return HttpResponse.json({
      success: true,
      code: "200",
      data: toDetail({
        ...existing,
        ...body,
        category,
        promptId: Number(promptId),
        updatedAt: getTimestamp(),
      }),
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

  // 최신순 조회 (PUBLIC만, 비로그인 허용)
  http.get(`${BASE_URL}/prompts/createDesc`, () => {
    const sorted = publicPrompts().sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { prompts: sorted.map(toSummary), totalCount: sorted.length },
      timestamp: getTimestamp(),
    });
  }),

  // 좋아요순 조회 (PUBLIC만, 비로그인 허용)
  http.get(`${BASE_URL}/prompts/likeDesc`, () => {
    const list = publicPrompts();
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { prompts: list.map(toSummary), totalCount: list.length },
      timestamp: getTimestamp(),
    });
  }),

  // 오늘 핫한 프롬프트 (PUBLIC만, 비로그인 허용)
  http.get(`${BASE_URL}/prompts/today-hot`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: publicPrompts().slice(0, 5).map(toSummary),
      timestamp: getTimestamp(),
    });
  }),

  // 제목 검색 (PUBLIC만, 비로그인 허용)
  http.get(`${BASE_URL}/prompts/search/:keyword`, ({ params }) => {
    const { keyword } = params;
    const filtered = publicPrompts().filter((p) =>
      p.title.includes(keyword as string)
    );
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { prompts: filtered.map(toSummary), totalCount: filtered.length },
      timestamp: getTimestamp(),
    });
  }),

  // 좋아요 토글 (인증 필수)
  http.post(`${BASE_URL}/prompts/:promptId/like`, () => {
    return HttpResponse.json({
      success: true,
      code: "200",
      data: { likeStatus: "LIKED" },
      timestamp: getTimestamp(),
    });
  }),

  // 댓글 목록 조회 (PRIVATE 프롬프트는 작성자만)
  http.get(`${BASE_URL}/comment/:promptId`, ({ params }) => {
    const prompt = MOCK_PROMPTS_DETAIL.find(
      (p) => p.promptId === Number(params.promptId)
    );
    if (prompt?.visibility === "PRIVATE") {
      return HttpResponse.json(
        {
          success: false,
          code: "403",
          error: {
            errorClassName: "ACCESS_DENIED",
            message: "접근 권한이 없습니다.",
          },
          timestamp: getTimestamp(),
        },
        { status: 403 }
      );
    }
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

  // 댓글 작성 (PRIVATE 프롬프트에는 작성 불가)
  http.post(`${BASE_URL}/comment/:promptId`, async ({ params, request }) => {
    const prompt = MOCK_PROMPTS_DETAIL.find(
      (p) => p.promptId === Number(params.promptId)
    );
    if (prompt?.visibility === "PRIVATE") {
      return HttpResponse.json(
        {
          success: false,
          code: "403",
          error: {
            errorClassName: "ACCESS_DENIED",
            message: "접근 권한이 없습니다.",
          },
          timestamp: getTimestamp(),
        },
        { status: 403 }
      );
    }
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

  // 대댓글 작성 (PRIVATE 프롬프트에는 작성 불가)
  http.post(
    `${BASE_URL}/comment/:promptId/:commentId`,
    async ({ params, request }) => {
      const prompt = MOCK_PROMPTS_DETAIL.find(
        (p) => p.promptId === Number(params.promptId)
      );
      if (prompt?.visibility === "PRIVATE") {
        return HttpResponse.json(
          {
            success: false,
            code: "403",
            error: {
              errorClassName: "ACCESS_DENIED",
              message: "접근 권한이 없습니다.",
            },
            timestamp: getTimestamp(),
          },
          { status: 403 }
        );
      }
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
