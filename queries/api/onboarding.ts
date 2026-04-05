const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface ApiError extends Error {
  code?: string;
}

export interface PutBasicParams {
  education: string;
  career: number;
}
export interface PutCareerParams {
  currentStatuses: string[];
  targetJobRoles: string[];
}

export async function postNickname(nickname: string, token: string) {
  const res = await fetch(`${BASE_URL}/users/nickname`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nickname }),
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
export async function putBasic(
  { education, career }: PutBasicParams,
  token: string
) {
  const res = await fetch(`${BASE_URL}/users/me/onboarding/basic`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ education, career }),
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

export async function putCareer(params: PutCareerParams, token: string) {
  const res = await fetch(`${BASE_URL}/users/me/onboarding/career`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
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

export async function postComplete(token: string) {
  const res = await fetch(`${BASE_URL}/users/me/onboarding/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
