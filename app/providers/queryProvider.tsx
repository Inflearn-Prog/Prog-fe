"use client";

import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

// 상수 관리 (가독성을 위해 객체로 묶는 것도 방법입니다)
const CONFIG = {
  STALE_TIME: 1000 * 60 * 5,
  GC_TIME: 1000 * 60 * 30,
  RETRY: {
    SERVER: 1,
    NETWORK: 3,
    DELAY_BASE: 1000,
    DELAY_MAX: 30000,
  },
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CONFIG.STALE_TIME,
        gcTime: CONFIG.GC_TIME,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount: number, error: unknown) => {
          // 서버 에러 처리
          if (
            typeof error === "object" &&
            error !== null &&
            "status" in error &&
            typeof (error as { status?: number }).status === "number"
          ) {
            return failureCount < CONFIG.RETRY.SERVER;
          }
          // 네트워크 에러 처리
          if (
            typeof error === "object" &&
            error !== null &&
            "name" in error &&
            (error as { name?: string }).name === "NetworkError"
          ) {
            return failureCount < CONFIG.RETRY.NETWORK;
          }
          return false;
        },
        retryDelay: (attemptIndex) =>
          Math.min(
            CONFIG.RETRY.DELAY_BASE * 2 ** attemptIndex,
            CONFIG.RETRY.DELAY_MAX
          ),
      },
      // SSR 시 하이드레이션 설정
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 노출되도록 환경변수 체크를 추가하면 좋습니다 */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
