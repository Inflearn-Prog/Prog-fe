const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface ApiError extends Error {
  code?: string;
}

export interface PutBasicParams {
  education: string;
  major: string;
  career: number;
}
export interface PutCareerParams {
  currentStatuses: string[];
  targetJobRoles: string[];
}

export async function putBasic(
  { education, major, career }: PutBasicParams,
  token: string
) {
  const res = await fetch(`${BASE_URL}/users/me/onboarding/basic`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ education, major, career }),
  });

  const result = await res.json();

  if (!res.ok) {
    const errorData = result.data;
    const error: ApiError = new Error(errorData?.message);
    error.code = errorData?.errorClassName;
    throw error;
  }

  return result.data;
}

export async function putCareer(params: PutCareerParams, token: string) {
  const res = await fetch(`${BASE_URL}/users/me/onboarding/career`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const result = await res.json();

  if (!res.ok) {
    const errorData = result.data;
    const error: ApiError = new Error(errorData?.message);
    error.code = errorData?.errorClassName;
    throw error;
  }

  return result.data;
}
