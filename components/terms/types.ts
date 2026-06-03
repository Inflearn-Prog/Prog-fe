export interface Term {
  termId: number;
  title: string;
  isRequired: boolean;
  hasDetails: boolean;
  link: string | null;
}

export interface TermsResponse {
  terms: Term[];
}
