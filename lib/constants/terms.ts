/**
 * 약관 정적 페이지 매핑.
 *
 * 약관 본문은 `public/terms/{slug}.html` 정적 파일(자체완결 HTML)로 서빙된다.
 * 백엔드 응답의 `term.link`(외부 URL · null 등)에 의존하지 않도록,
 * fetchTerms 어댑터(`queries/api/terms.ts`)에서 termId 기준으로 link을 이 경로로 덮어쓴다.
 *
 * 새 약관이 추가되면 여기 한 곳(단일 진실원)에만 매핑을 추가한다.
 */

/** 약관 termId 상수 (매직넘버 제거용) */
export const TERM_IDS = {
  TERMS: 1,
  PRIVACY: 2,
  MARKETING: 3,
} as const;

/** termId → `public/terms/` 정적 파일 슬러그. Map 사용으로 object-injection 린트 회피. */
const TERM_FILE_MAP = new Map<number, string>([
  [TERM_IDS.TERMS, "terms"],
  [TERM_IDS.PRIVACY, "privacy"],
  [TERM_IDS.MARKETING, "marketing"],
]);

/**
 * termId 에 대응하는 약관 정적 페이지 경로(`/terms/{slug}.html`)를 반환한다.
 * 매핑에 없는 termId 는 null 을 반환하며, 호출부에서 원본 link 으로 폴백한다.
 */
export function toTermLink(termId: number): string | null {
  const slug = TERM_FILE_MAP.get(termId);
  if (!slug) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[terms] 매핑되지 않은 termId: ${termId} — 원본 link 사용`);
    }
    return null;
  }
  return `/terms/${slug}.html`;
}
