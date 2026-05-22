import ky from "ky";

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
}

export interface PagedResponse<T> {
  prompts: T[];
  totalCount: number;
  pageable: {
    pageNumber: number;
  };
}

export interface ApiErrorData {
  errorClassName: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  errorClassName: string;

  constructor(status: number, errorData: ApiErrorData) {
    super(errorData?.message);
    this.name = "ApiError";
    this.status = status;
    this.errorClassName = errorData?.errorClassName;
  }
}

let clientInMemoryToken: string | null = null;

export const setFetcherToken = (token: string | null) => {
  clientInMemoryToken = token;
};

export const fetcher = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined;

        if (typeof window === "undefined") {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            token = cookieStore.get("fetcherToken")?.value;
          } catch (error) {
            console.error("Failed to get cookies on server:", error);
          }
        } else {
          token = clientInMemoryToken || undefined;
        }

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          const errorData = (await response.json()) as {
            success: boolean;
            code: string;
            error: ApiErrorData;
            timestamp: string;
          } | null;

          if (errorData && errorData.success === false) {
            if (
              ["TOKEN_EXPIRED", "INVALID_TOKEN"].includes(
                errorData.error.errorClassName
              )
            ) {
              if (typeof window !== "undefined") {
                try {
                  const { getSession, signOut } =
                    await import("next-auth/react");

                  const event = new MessageEvent("message", {
                    data: { trigger: "getSession", event: "session" },
                  });
                  window.dispatchEvent(event);

                  const newSession = await getSession();

                  if (newSession?.error === "AccessTokenExpired") {
                    await signOut({ callbackUrl: "/signin" });
                  } else if (newSession?.accessToken) {
                    setFetcherToken(newSession.accessToken);
                    request.headers.set(
                      "Authorization",
                      `Bearer ${newSession.accessToken}`
                    );
                    return ky(request);
                  }
                } catch (nextAuthError) {
                  console.error(
                    "NextAuth 세션 갱신 중 에러 발생:",
                    nextAuthError
                  );
                }
              }
            }

            throw new ApiError(response.status, errorData.error);
          }

          throw new Error(
            `서버 에러가 발생했습니다. (Status: ${response.status})`
          );
        }
        return response;
      },
    ],
  },
  retry: 0,
  timeout: 1000 * 10,
});
