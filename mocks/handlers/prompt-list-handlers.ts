import { http, HttpResponse } from "msw";

const MOCK_PROMPTS = [
  // 개발 (development) - 4개
  {
    id: "1",
    category: "development",
    title: "신입 프론트엔드 기술 면접 대비 자소서 프롬프트",
    content:
      "React의 가상 DOM 원리와 성능 최적화 경험을 논리적으로 서술해주는 프롬프트입니다.",
    userIcon: "/icons/user1.png",
    userName: "개발왕코딩이",
    userDesc: "네카라쿠배 현직 개발자",
    likes: 120,
  },
  {
    id: "2",
    category: "development",
    title: "백엔드 아키텍처 설계 역량 강조형 프롬프트",
    content:
      "MSA 환경에서의 트랜잭션 처리 경험을 직무 역량에 맞춰 요약해드립니다.",
    userIcon: "/icons/user2.png",
    userName: "서버마스터",
    userDesc: "10년차 시니어 엔지니어",
    likes: 85,
  },
  {
    id: "9",
    category: "development",
    title: "Next.js 14 App Router 마이그레이션 경험 정리",
    content:
      "서버 컴포넌트 도입을 통해 얻은 성능 이점을 기술적으로 기술하는 가이드입니다.",
    userIcon: "/icons/user9.png",
    userName: "풀스택조아",
    userDesc: "스타트업 CTO",
    likes: 42,
  },
  {
    id: "10",
    category: "development",
    title: "코드 리뷰 문화 정착 및 협업 능력 강조 프롬프트",
    content:
      "팀원들과의 기술적 소통과 코드 퀄리티 향상을 위한 노력을 자소서에 녹여냅니다.",
    userIcon: "/icons/user10.png",
    userName: "리뷰어킴",
    userDesc: "금융권 IT 보안팀",
    likes: 33,
  },

  // 디자인 (design) - 3개
  {
    id: "3",
    category: "design",
    title: "UI/UX 디자인 포트폴리오 스토리텔링 가이드",
    content:
      "문제 정의부터 해결 과정까지, 논리적인 디자인 프로세스를 자소서에 녹여보세요.",
    userIcon: "/icons/user3.png",
    userName: "픽셀장인",
    userDesc: "에이전시 출신 아트디렉터",
    likes: 95,
  },
  {
    id: "4",
    category: "design",
    title: "비전공자 출신 디자이너를 위한 직무 전환 프롬프트",
    content:
      "이전 직무의 경험을 디자인적 사고(Design Thinking)로 연결하는 비법입니다.",
    userIcon: "/icons/user4.png",
    userName: "디자인고수",
    userDesc: "대기업 인하우스 디자이너",
    likes: 77,
  },
  {
    id: "11",
    category: "design",
    title: "디자인 시스템 구축 및 협업 효율화 사례",
    content:
      "컴포넌트 단위 디자인을 통해 개발 생산성을 높인 경험을 설명해줍니다.",
    userIcon: "/icons/user11.png",
    userName: "시스템러버",
    userDesc: "유니콘 기업 프로덕트 디자이너",
    likes: 56,
  },

  // 마케팅/콘텐츠 (marketing_content) - 4개
  {
    id: "5",
    category: "marketing_content",
    title: "데이터 기반 퍼포먼스 마케팅 성과 서술 프롬프트",
    content:
      "ROAS 300% 달성 등 수치화된 성과를 매력적인 문장으로 바꿔드립니다.",
    userIcon: "/icons/user5.png",
    userName: "마케팅천재",
    userDesc: "그로스 해킹 전문가",
    likes: 110,
  },
  {
    id: "6",
    category: "marketing_content",
    title: "SNS 콘텐츠 기획 및 트렌드 민감도 강조형",
    content:
      "Z세대 트렌드를 분석하고 이를 브랜드 캠페인으로 연결한 경험을 강조합니다.",
    userIcon: "/icons/user6.png",
    userName: "콘텐츠요정",
    userDesc: "유명 브랜드 SNS 매니저",
    likes: 64,
  },
  {
    id: "12",
    category: "marketing_content",
    title: "B2B 마케팅 리드 생성 및 전환 가이드",
    content:
      "웨비나와 뉴스레터를 활용해 잠재 고객을 확보한 전략적 접근법을 정리합니다.",
    userIcon: "/icons/user12.png",
    userName: "비투비킹",
    userDesc: "SaaS 마케팅 리더",
    likes: 29,
  },
  {
    id: "13",
    category: "marketing_content",
    title: "브랜드 아이덴티티 구축 및 팬덤 마케팅",
    content:
      "단순 판매를 넘어 브랜드의 가치를 전달하고 커뮤니티를 활성화한 사례입니다.",
    userIcon: "/icons/user13.png",
    userName: "브랜더",
    userDesc: "F&B 브랜드 디렉터",
    likes: 48,
  },

  // 서비스 기획 (service_planning) - 3개
  {
    id: "7",
    category: "service_planning",
    title: "서비스 기획자의 논리적 지표 개선 사례 프롬프트",
    content: "로그 분석을 통해 이탈률을 개선한 PM/PO 핵심 역량을 정리해줍니다.",
    userIcon: "/icons/user7.png",
    userName: "기획의정석",
    userDesc: "핀테크 스타트업 PO",
    likes: 88,
  },
  {
    id: "14",
    category: "service_planning",
    title: "신규 서비스 런칭을 위한 MVP 기획 및 검증",
    content:
      "최소 기능 제품으로 가설을 검증하고 피벗(Pivot)한 과정을 논리적으로 서술합니다.",
    userIcon: "/icons/user14.png",
    userName: "런칭머신",
    userDesc: "연쇄 창업가 & 기획자",
    likes: 52,
  },
  {
    id: "15",
    category: "service_planning",
    title: "사용자 중심의 UX 라이팅 및 흐름 개선",
    content:
      "복잡한 금융 프로세스를 사용자 언어로 풀어내어 가입 전환율을 높인 사례입니다.",
    userIcon: "/icons/user15.png",
    userName: "유엑스피엠",
    userDesc: "커머스 플랫폼 PM",
    likes: 39,
  },

  // 인사/총무 (hr_general_affairs) - 2개
  {
    id: "8",
    category: "hr_general_affairs",
    title: "조직 문화 개선 및 사내 커뮤니케이션 강조 프롬프트",
    content:
      "갈등 관리 사례를 통해 유연한 소통 능력을 증명하는 자소서 가이드입니다.",
    userIcon: "/icons/user8.png",
    userName: "인사통",
    userDesc: "15년차 HR 파트장",
    likes: 45,
  },
  {
    id: "16",
    category: "hr_general_affairs",
    title: "직무 전문성 강화를 위한 사내 교육 프로그램 기획",
    content:
      "임직원의 이탈률을 낮추고 만족도를 높인 교육 시스템 구축 경험을 정리합니다.",
    userIcon: "/icons/user16.png",
    userName: "교육전문가",
    userDesc: "글로벌 IT 기업 HRD",
    likes: 21,
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

const BASE_URL = "http://localhost:8080";

export const promptListHandlers = [
  //API 명세서 업데이트되면 맞춰서 수정해야함.
  http.get(`${BASE_URL}/api/prompts`, ({ request }) => {
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
  http.post(`${BASE_URL}/api/prompts/like/:promptId`, ({ params }) => {
    const { promptId } = params;

    console.log(`Prompt ${promptId} 좋아요 처리됨`);

    return HttpResponse.json(
      {
        message: "좋아요 처리가 완료되었습니다.",
        id: promptId,
      },
      { status: 200 }
    );
  }),
  http.delete(`${BASE_URL}/api/prompts/like/:promptId`, ({ params }) => {
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
  http.post(`${BASE_URL}/api/reports`, async ({ request }) => {
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
];
