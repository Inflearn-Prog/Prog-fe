import { fetcher } from "@/lib/fetcher";

export const postAuth = async ({
  provider,
  authCode,
}: {
  provider: string;
  authCode: string;
}) => {
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/auth/social-login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, authCode }),
    }
  );

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`Request failed with status ${response.status}`);
    }
    throw errorData;
  }
  return response.json();
};

// 로그아웃은 refresh_token 쿠키를 실어야 해서 서버에서 처리한다.
// app/actions/auth-actions.ts 의 logoutOnServer 를 쓸 것.

export interface WithdrawRequest {
  reason?: string;
}

export const deleteUserAccount = async (data?: WithdrawRequest) => {
  const response = await fetcher.delete("users/me", { json: data });
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    console.error("Failed to parse deleteUserAccount response:", text);
    return null;
  }
};
