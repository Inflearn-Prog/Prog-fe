export interface Term {
  termId: number;
  title: string;
  isRequired: boolean;
  hasDetails: boolean;
  link: string;
}
// TODO: API 응답 타입 확정 시 TermsResponse 교체 필요
export interface TermsResponse {
  terms: Term[];
}
