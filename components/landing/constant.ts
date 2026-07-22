import { ROUTES } from "@/lib/routes";

export const STATS_DATA = [
  {
    id: "logs",
    icon: "UserCheck",
    label: "공유된 합격 로그",
    value: "250,000+",
  },
  {
    id: "time",
    icon: "Timer",
    label: "작성 시간 단축",
    value: "2시간 → 5분",
  },
  {
    id: "satisfaction",
    icon: "Heart",
    label: "프롬프트 만족도",
    value: "97.97%",
  },
] as const;

export const TESTIMONIAL_CARDS = [
  {
    id: 1,
    role: "주니어 기획자",
    name: "도전하는사자",
    content:
      "포트폴리오에 제 강점을 어떻게 녹여낼지 고민이었는데, 논리적인 구조를 잡는 데 정말 큰 도움이 되었습니다.",
    tag: "기획",
    title: "서비스 기획자를 위한 역량 강조 프롬프트",
    tagVariant: "blue" as const,
  },
  {
    id: 2,
    role: "백엔드 개발자",
    name: "성장하는고래",
    content:
      "기술 면접 준비가 막막했는데, PROG의 합격 로그들을 보면서 면접관의 의도를 파악하는 법을 배웠어요.",
    tag: "기술면접",
    title: "백엔드 핵심 기술 질문 및 답변 가이드",
    tagVariant: "blue" as const,
  },
  {
    id: 3,
    role: "마케팅 전문가",
    name: "티레벨인재",
    content:
      "수치 중심의 성과 정리가 어려웠는데, 프롬프트가 가이드해준 대로 입력하니 압도적인 자소서가 완성됐어요.",
    tag: "마케팅",
    title: "데이터 기반 마케팅 성과 수치 최적화",
    tagVariant: "orange" as const,
  },
  {
    id: 4,
    role: "신입 디자이너",
    name: "꿈꾸는기린",
    content:
      "비전공자라 직무 이해도가 낮았지만, 현직자들의 프롬프트를 통해 업계 용어와 핵심 역량을 빠르게 습득했습니다.",
    tag: "디자인",
    title: "UX/UI 디자이너 포트폴리오 스토리텔링",
    tagVariant: "blue" as const,
  },
] as const;

export const COMPARISON_OLD = [
  {
    title: "빈 화면에서 시작하는 막막함",
    description: "무엇부터 써야 할지 몰라 커서만 깜빡이며 보내는 수많은 시간",
  },
  {
    title: "추상적인 경험 나열",
    description:
      "열심히는 했지만 정작 직무 핵심 역량과는 연결되지 않는 에피소드",
  },
  {
    title: "논리가 결여된 문장 구성",
    description:
      "앞뒤 문맥이 어색하여 읽는 이에게 전문성을 전달하기 어려운 구조",
  },
  {
    title: "반복되는 탈락과 자존감 하락",
    description: "원인을 몰라 답답한 탈락의 굴레와 점차 위축되는 지원 심리",
  },
] as const;

export const COMPARISON_NEW = [
  {
    title: "키워드 입력 시 5분 내 초안 완성",
    description: "나의 핵심 경험 몇 가지만 넣으면 AI가 즉시 논리적인 조언 작성",
  },
  {
    title: "직무 역량 중심의 성과 강조",
    description: "현직자가 선호하는 핵심 키워드를 자동 배치하여 전문성 부각",
  },
  {
    title: "합격 사례 기반의 문장 최적화",
    description:
      "수만 건의 데이터로 검증된 합격권 문장 스타일로 문맥 자동 교정",
  },
  {
    title: "성공적인 서류 통과 경험",
    description: "서류 합격률의 드라마틱한 상승을 통해 얻는 실전 면접의 기회",
  },
] as const;

export const CTA_LINKS = {
  explore: ROUTES.rank.ROOT,
  share: ROUTES.prompt.WRITE,
  login: ROUTES.auth.SIGNIN,
} as const;
