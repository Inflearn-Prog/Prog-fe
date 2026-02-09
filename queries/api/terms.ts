const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface ApiError extends Error {
  code?: string;
}

export interface Term {
  termId: number;
  title: string;
  isRequired: boolean;
  hasDetails: boolean;
  link: string;
}

interface CommonResponse<T> {
  status: number;
  success: boolean;
  data: T;
}

export async function fetchTerms() {
  const res = await fetch(`${BASE_URL}/terms`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("약관 목록을 불러오는데 실패했습니다.");
  }
  const result = (await res.json()) as CommonResponse<{ terms: Term[] }>;
  return result.data;
}

export async function postTerms(termIds: number[], token: string) {
  const res = await fetch(`${BASE_URL}/users/me/terms-agreements`, {
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
    let errorData;
    try {
      const result = await res.json();
      errorData = result.data;
    } catch {
      // JSON 파싱 실패 시 기본 에러
    }
    const error: ApiError = new Error(
      errorData?.message ?? `요청 실패 (${res.status})`
    );
    error.code = errorData?.errorClassName;
    throw error;
  }

  const result = await res.json();
  return result.data;
}
