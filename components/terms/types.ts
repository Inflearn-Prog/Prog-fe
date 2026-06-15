export interface Term {
  termId: number;
  title: string;
  isRequired: boolean;
  /**
   * (deprecated) 상세 문서 존재 플래그 — FE는 더 이상 사용하지 않는다.
   * "보기" 노출은 link(= FE 정적 페이지) 존재로 판단(terms-check.tsx).
   * 백엔드 응답·DB에서 제거 예정 → optional.
   */
  hasDetails?: boolean;
  /**
   * 약관 상세 페이지 링크 — **FE 소유**.
   * `queries/api/terms.ts`의 fetchTerms가 termId 기준으로
   * `/terms/{slug}.html`(public/terms/)을 채운다. 매핑 없는 termId는 null(= "보기" 미노출).
   * 백엔드 응답의 link은 더 이상 사용하지 않으며 제거 예정(deprecated) → optional.
   */
  link?: string | null;
}

export interface TermsResponse {
  terms: Term[];
}
