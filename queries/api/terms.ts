import { Term } from "@/components/terms/types";
import { toTermLink, toTermTitle } from "@/lib/constants/terms";
import { ApiResponse } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
if (!BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_BACKEND_API_URL 환경 변수가 설정되지 않았습니다."
  );
}

interface ApiError extends Error {
  code?: string;
}
interface ApiErrorData {
  errorClassName: string;
  message: string;
}

export interface PostTermsResponse {
  userId: number;
  isRegistrationComplete: boolean;
  message: string;
}

export async function fetchTerms() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const res = await fetch(`${BASE_URL}/terms/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("약관 목록을 불러오는데 실패했습니다.");
  }
  const result = (await res.json()) as ApiResponse<{ terms: Term[] }>;
  // 제목·링크는 FE 소유. 약관 본문은 정적 페이지(public/terms/*.html)로 새 탭에서 서빙하고,
  // 백엔드 title 은 DB 손상(공백, P0-01)으로 신뢰하지 않는다. termId 기준으로 FE가 덮되,
  // 매핑에 없는 termId 일 때만 원본 값으로 폴백한다.
  return result.data.terms.map((term) => ({
    ...term,
    title: toTermTitle(term.termId) ?? term.title,
    link: toTermLink(term.termId),
  }));
}

export async function postTerms(termIds: number[], token: string) {
  const res = await fetch(`${BASE_URL}/users/terms-agreement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      agreedTermIds: termIds,
    }),
  });

  if (!res.ok) {
    let errorData: ApiErrorData | undefined;

    try {
      const result = (await res.json()) as { error: ApiErrorData };
      errorData = result.error;
    } catch (error) {
      console.error("Failed to parse error response:", error);
    }

    const error: ApiError = new Error(
      errorData?.message ?? `요청 실패 (${res.status})`
    );
    error.code = errorData?.errorClassName;
    throw error;
  }

  const result = (await res.json()) as ApiResponse<PostTermsResponse>;
  return result.data;
}
