import ky from "ky";
import { NextRequest } from "next/server";

export interface ApiResponse<T> {
  code: string;
  success: boolean;
  data: T;
  timestamp?: string;
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

interface MockGetTokenRequest {
  headers: Record<string, string>;
  cookies: Record<string, string>;
}

export class ApiError extends Error {
  httpStatus: number; // HTTP 상태코드 (API 응답 code와는 다름)
  errorClassName: string;

  constructor(httpStatus: number, errorData: ApiErrorData) {
    super(errorData?.message);
    this.name = "ApiError";
    this.httpStatus = httpStatus;
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
          // 1. 서버 사이드 처리
          try {
            const { getToken } = await import("next-auth/jwt");
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();

            const mockReq: MockGetTokenRequest = {
              headers: Object.fromEntries(request.headers.entries()),
              cookies: Object.fromEntries(
                cookieStore.getAll().map((c) => [c.name, c.value])
              ),
            };

            const tokenData = await getToken({
              req: {
                headers: Object.fromEntries(request.headers.entries()),
                cookies: Object.fromEntries(
                  cookieStore.getAll().map((c) => [c.name, c.value])
                ),
              } as unknown as NextRequest, // 🌟 any 대신 unknown -> NextRequest 구조로 속여넘깁니다.
              secret: process.env.NEXTAUTH_SECRET,
            });

            token = tokenData?.accessToken as string | undefined;
          } catch (error) {
            console.error("Failed to get token on server:", error);
          }
        } else {
          // 2. 클라이언트 사이드 처리
          if (clientInMemoryToken) {
            token = clientInMemoryToken;
          } else {
            try {
              const { getSession } = await import("next-auth/react");
              const session = await getSession();
              token = session?.accessToken || undefined;

              // 찾았다면 다음 요청을 위해 인메모리에 보관
              if (token) setFetcherToken(token);
            } catch (error) {
              console.error("Failed to get session on client:", error);
            }
          }
        }

        // 토큰이 존재할 때만 헤더에 주입
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        } else {
          console.warn(
            `[Fetcher Warning] No token found for URL: ${request.url}`
          );
        }
        return request;
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
