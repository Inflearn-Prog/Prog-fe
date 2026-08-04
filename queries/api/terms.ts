import { Term } from "@/components/terms/types";
import { toTermLink } from "@/lib/constants/terms";
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
  // 약관 본문은 사내 정적 페이지(public/terms/*.html)로 서빙한다. link은 FE가 소유하며
  // termId 기준으로 생성한다. 백엔드 응답의 link은 사용하지 않는다(제거 예정).
  return result.data.terms.map((term) => ({
    ...term,
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
