/**
 * 약관 정적 페이지 매핑 (단일 진실원).
 *
 * 약관 본문은 `public/terms/{slug}.html` 정적 파일(자체완결 HTML)로 서빙되며,
 * "보기"는 이 파일을 새 탭에서 바로 연다(백엔드에서 원문을 가져오지 않는다).
 *
 * 표시 제목(title)과 링크(link) 모두 FE가 termId 기준으로 소유한다.
 * - link  : 백엔드 응답의 term.link(제거 예정)에 의존하지 않는다.
 * - title : 백엔드 term.title 은 DB 데이터 손상(공백, P0-01)으로 신뢰할 수 없어 FE가 소유한다.
 *           제목 문구는 각 정적 페이지의 <h1> 과 일치시킨다.
 *
 * 새 약관이 추가되면 여기 한 곳에만 매핑을 추가한다.
 */

/** 약관 termId 상수 (매직넘버 제거용) */
export const TERM_IDS = {
  TERMS: 1,
  PRIVACY: 2,
  MARKETING: 3,
} as const;

interface TermMeta {
  /** public/terms/{slug}.html */
  slug: string;
  /** 체크박스에 표시할 약관 제목 (정적 페이지 <h1> 과 일치) */
  title: string;
}

/** termId → 정적 파일 슬러그 + 표시 제목. Map 사용으로 object-injection 린트 회피. */
const TERM_META = new Map<number, TermMeta>([
  [TERM_IDS.TERMS, { slug: "terms", title: "서비스 이용약관" }],
  [TERM_IDS.PRIVACY, { slug: "privacy", title: "개인정보 처리방침" }],
  [TERM_IDS.MARKETING, { slug: "marketing", title: "마케팅 정보 수신 동의" }],
]);

/**
 * termId 에 대응하는 약관 정적 페이지 경로(`/terms/{slug}.html`)를 반환한다.
 * 매핑에 없는 termId 는 null 을 반환하며, 호출부에서 "보기"를 노출하지 않는다.
 */
export function toTermLink(termId: number): string | null {
  const meta = TERM_META.get(termId);
  if (!meta) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[terms] 매핑되지 않은 termId: ${termId} — 링크 미노출`);
    }
    return null;
  }
  return `/terms/${meta.slug}.html`;
}

/**
 * termId 에 대응하는 약관 표시 제목을 반환한다.
 * 매핑에 없는 termId 는 null 을 반환하며, 호출부에서 백엔드 title 로 폴백한다.
 */
export function toTermTitle(termId: number): string | null {
  return TERM_META.get(termId)?.title ?? null;
}
