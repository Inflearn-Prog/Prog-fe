import { ApiResponse, fetcher } from "@/lib/fetcher";

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

export const postLogout = async () => {
  return await fetcher.post("auth/logout").json<ApiResponse<object>>();
};

export interface WithdrawRequest {
  reason?: string;
}

export const deleteUserAccount = async (
  uid: string | number,
  data?: WithdrawRequest
) => {
  return await fetcher.delete(`users/${uid}`, { json: data }).json<
    ApiResponse<{
      uid: string;
      unlinkedProvider: string;
      terminatedAt: string;
    }>
  >();
};
