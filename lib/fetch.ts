import ky from "ky";

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = (await response.json()) as ApiResponse<any>;

        if (!body.success || !response.ok) {
          const errorData = body.data as ApiErrorData;

          // 이부분에 에러 코드 및 상황에 따른 처리 로직 추가
          // 예시 `/users/me` 호출 시 토큰 만료 처리
          if (errorData?.errorClassName === "ACCESS_TOKEN_EXPIRED") {
            // 로그아웃 처리 등
          }

          throw new ApiError(body.status, errorData);
        }

        return response;
      },
    ],
  },
  retry: 0,
  timeout: 1000 * 10,
});
