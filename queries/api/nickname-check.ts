const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface ApiError extends Error {
  code?: string;
  status?: number;
}

interface NicknameAvailabilityResponse {
  isAvailable: boolean;
}

interface CommonResponse<T> {
  status: number;
  success: boolean;
  data: T;
}

export async function nicknameCheck(
  nickname: string,
  token?: string
): Promise<boolean> {
  const res = await fetch(
    `${BASE_URL}/users/nickname/availability?nickname=${encodeURIComponent(nickname)}`,
    {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error: ApiError = new Error(
      errorData.data?.message || "닉네임 확인 중 오류가 발생했습니다."
    );
    error.status = res.status;
    error.code = errorData.data?.errorClassName;
    throw error;
  }

  const result =
    (await res.json()) as CommonResponse<NicknameAvailabilityResponse>;
  return result.data.isAvailable;
}
