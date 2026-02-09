const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface ApiError extends Error {
  code?: string;
}
interface ApiErrorData {
  errorClassName: string;
  message: string;
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

export interface PostTermsResponse {
  userId: number;
  isRegistrationComplete: boolean;
  message: string;
}

export async function fetchTerms() {
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  const result = (await res.json()) as CommonResponse<PostTermsResponse>;

  if (!res.ok) {
    let errorData: ApiErrorData | undefined;

    try {
      const result = (await res.json()) as CommonResponse<ApiErrorData>;
      errorData = result.data;
    } catch (error) {
      console.error("Failed to parse error response:", error);
    }

    const error: ApiError = new Error(
      errorData?.message ?? `요청 실패 (${res.status})`
    );
    error.code = errorData?.errorClassName;
    throw error;
  }

  return result.data;
}
