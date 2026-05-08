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

export const fetcher = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined;

        // [SSR / Server Action / Route Handler]
        if (typeof window === "undefined") {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            token = cookieStore.get("accessToken")?.value;
          } catch (error) {
            console.error("Failed to get cookies on server:", error);
          }
          // [CSR / Client Component]
        } else {
          token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];
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
              // 예: 로그아웃 처리 또는 토큰 재발급 로직 호출
            }

            // 커스텀 ApiError 던지기
            throw new ApiError(response.status, errorData.error);
          }

          // 3. 만약 백엔드에서 정의한 에러 포맷이 아닐 경우의 폴백(Fallback)
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
