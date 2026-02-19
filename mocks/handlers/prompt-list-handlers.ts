import { http, HttpResponse } from "msw";

const MOCK_PROMPTS = [
  // 개발 (development)
  {
    id: 1,
    category: "development",
    title: "신입 프론트엔드 기술 면접 대비 자소서 프롬프트",
    content:
      "React의 가상 DOM 원리와 성능 최적화 경험을 논리적으로 서술해주는 프롬프트입니다.",
    userIcon: "/icons/user1.png",
    userName: "개발왕코딩이",
    userDesc: "네카라쿠배 현직 개발자",
  },
  {
    id: 2,
    category: "development",
    title: "백엔드 아키텍처 설계 역량 강조형 프롬프트",
    content:
      "MSA 환경에서의 트랜잭션 처리 경험을 직무 역량에 맞춰 요약해드립니다.",
    userIcon: "/icons/user2.png",
    userName: "서버마스터",
    userDesc: "10년차 시니어 엔지니어",
  },

  // 디자인 (design)
  {
    id: 3,
    category: "design",
    title: "UI/UX 디자인 포트폴리오 스토리텔링 가이드",
    content:
      "문제 정의부터 해결 과정까지, 논리적인 디자인 프로세스를 자소서에 녹여보세요.",
    userIcon: "/icons/user3.png",
    userName: "픽셀장인",
    userDesc: "에이전시 출신 아트디렉터",
  },
  {
    id: 4,
    category: "design",
    title: "비전공자 출신 디자이너를 위한 직무 전환 프롬프트",
    content:
      "이전 직무의 경험을 디자인적 사고(Design Thinking)로 연결하는 비법입니다.",
    userIcon: "/icons/user4.png",
    userName: "디자인고수",
    userDesc: "대기업 인하우스 디자이너",
  },

  // 마케팅/콘텐츠 (marketing_content)
  {
    id: 5,
    category: "marketing_content",
    title: "데이터 기반 퍼포먼스 마케팅 성과 서술 프롬프트",
    content:
      "ROAS 300% 달성 등 수치화된 성과를 매력적인 문장으로 바꿔드립니다.",
    userIcon: "/icons/user5.png",
    userName: "마케팅천재",
    userDesc: "그로스 해킹 전문가",
  },
  {
    id: 6,
    category: "marketing_content",
    title: "SNS 콘텐츠 기획 및 트렌드 민감도 강조형",
    content:
      "Z세대 트렌드를 분석하고 이를 브랜드 캠페인으로 연결한 경험을 강조합니다.",
    userIcon: "/icons/user6.png",
    userName: "콘텐츠요정",
    userDesc: "유명 브랜드 SNS 매니저",
  },

  // 서비스 기획 (service_planning)
  {
    id: 7,
    category: "service_planning",
    title: "서비스 기획자의 논리적 지표 개선 사례 프롬프트",
    content: "로그 분석을 통해 이탈률을 개선한 PM/PO 핵심 역량을 정리해줍니다.",
    userIcon: "/icons/user7.png",
    userName: "기획의정석",
    userDesc: "핀테크 스타트업 PO",
  },

  // 인사/총무 (hr_general_affairs)
  {
    id: 8,
    category: "hr_general_affairs",
    title: "조직 문화 개선 및 사내 커뮤니케이션 강조 프롬프트",
    content:
      "갈등 관리 사례를 통해 유연한 소통 능력을 증명하는 자소서 가이드입니다.",
    userIcon: "/icons/user8.png",
    userName: "인사통",
    userDesc: "15년차 HR 파트장",
  },
];

const BASE_URL = "http://localhost:8080";

export const promptListHandlers = [
  //API 명세서 업데이트되면 맞춰서 수정해야함.
  http.get(`${BASE_URL}/api/prompts`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let filteredData =
      !category || category === "all"
        ? MOCK_PROMPTS
        : MOCK_PROMPTS.filter((p) => p.category === category);

    const rankedData = filteredData.map((item, index) => ({
      ...item,
      rank: index + 1, // 1등부터 순서대로
    }));

    return HttpResponse.json(rankedData);
  }),
];
