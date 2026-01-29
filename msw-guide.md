# MSW & TanStack Query 안내 문서

<!-- 작성날짜: 2026년 1월 29일 -->
<!-- 파일명: msw-guide.md -->

## 소개

이 문서는 프로젝트에서 MSW(Mock Service Worker)와 TanStack Query를 사용하여 API 모킹과 데이터 관리를 설정하는 방법을 안내합니다. MSW는 실제 API 서버 없이 네트워크 요청을 모킹하여 개발 및 테스트를 용이하게 합니다. TanStack Query는 데이터 캐싱, 동기화, 에러 처리를 제공합니다.

## MSW 설정

MSW는 브라우저와 서버 환경에서 API 요청을 가로채 모킹 데이터를 반환합니다.

### 1. 설치
프로젝트에 MSW가 이미 설치되어 있습니다. 추가 설치가 필요하다면:
```bash
npm install msw --save-dev
```

### 2. 핸들러 작성
`mocks/handlers/` 폴더에 도메인별로 핸들러를 분리하세요.

예시: `mocks/handlers/user.ts`
```typescript
// mocks/handlers/user.ts
// 작성날짜: 2026년 1월 29일
// 파일명: user.ts
// 사용자 관련 API 핸들러 모음

import { http, HttpResponse } from "msw";

export const userHandlers = [
  http.get("https://api.example.com/api/user", () => {
    try {
      return HttpResponse.json({
        data: {
          name: "handongryong",
          age: 25,
        },
      });
    } catch (error) {
      return HttpResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
  }),

  http.get("https://api.example.com/api/user/:id", (req) => {
    try {
      const { id } = req.params;
      return HttpResponse.json({
        data: {
          id,
          name: "handongryong",
          age: 25,
        },
      });
    } catch (error) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }
  }),
];
```

`mocks/handlers/index.ts`에서 모든 핸들러를 합치세요:
```typescript
// mocks/handlers/index.ts
// 작성날짜: 2026년 1월 29일
// 파일명: index.ts
// 모든 핸들러를 합쳐서 export

import { userHandlers } from "./user";

export const handlers = [
  ...userHandlers,
  // 추가 핸들러 병합
];
```

### 3. MSW 초기화
`mocks/index.ts`의 `initMsw` 함수를 사용하여 환경별로 초기화하세요.

```typescript
// mocks/index.ts
// 작성날짜: 2026년 1월 29일
// 파일명: index.ts
// MSW 초기화 함수

export async function initMsw() {
  if (typeof window === "undefined") {
    // 서버 사이드: MSW 서버 시작
    const { server } = await import("./server");
    server.listen();
  } else {
    // 클라이언트 사이드: MSW 워커 시작
    const { worker } = await import("./browser");
    await worker.start();
  }
}
```

### 4. 프로바이더 설정
`app/providers/msw-provider.tsx`에서 클라이언트 초기화를 처리하세요.

```tsx
// app/providers/msw-provider.tsx
// 작성날짜: 2026년 1월 29일
// 파일명: msw-provider.tsx
// MSW 프로바이더 컴포넌트

"use client";

import { useEffect, useState } from "react";

export default function MswProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_MSW_ENABLED === "true") {
          const initMsw = await import("@/mocks/index").then((res) => res.initMsw);
          await initMsw();
          setMswReady(true);
        } else {
          setMswReady(true);
        }
      } catch (error) {
        console.error("MSW 초기화 실패:", error);
        setMswReady(true);
      }
    };

    if (!mswReady) {
      init();
    }
  }, [mswReady]);

  return <>{children}</>;
}
```

`app/layout.tsx`에서 프로바이더를 감싸세요.

## TanStack Query 설정

TanStack Query는 데이터 페칭, 캐싱, 동기화를 관리합니다.

### 1. 설치
이미 설치되어 있습니다. 추가 설치 시:
```bash
npm install @tanstack/react-query
```

### 2. 프로바이더 설정
`app/providers/queryProvider.tsx`에서 QueryClient를 설정하세요.

```tsx
// app/providers/queryProvider.tsx
// 작성날짜: 2026년 1월 29일
// 파일명: queryProvider.tsx
// TanStack Query 프로바이더

"use client";

import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

const CONFIG = {
  STALE_TIME: 1000 * 60 * 5,  // 5분
  GC_TIME: 1000 * 60 * 30,    // 30분
  // ... 기타 설정
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CONFIG.STALE_TIME,
        gcTime: CONFIG.GC_TIME,
        // ... 기타 옵션
      },
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
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### 3. 쿼리 옵션 작성
`queries/` 폴더에 쿼리 키와 옵션을 정의하세요.

예시: `queries/test/test-queries.ts`
```typescript
// queries/test/test-queries.ts
// 작성날짜: 2026년 1월 29일
// 파일명: test-queries.ts

import { queryOptions } from "@tanstack/react-query";
import { testFetcherAll, testFetcherDetail } from "./test-fetcher";

export const testQueries = {
  all: () =>
    queryOptions({
      queryKey: ["test"],
      queryFn: testFetcherAll,
    }),
  list: () =>
    queryOptions({
      queryKey: ["test", "list"],
      queryFn: testFetcherAll,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ["test", "detail", id],
      queryFn: () => testFetcherDetail(id),
    }),
};
```

### 4. 페처 함수 작성
`queries/test/test-fetcher.ts`에서 API 호출 로직을 작성하세요.

```typescript
// queries/test/test-fetcher.ts
// 작성날짜: 2026년 1월 29일
// 파일명: test-fetcher.ts

export async function testFetcherAll() {
  try {
    const res = await fetch("https://api.example.com/api/user", {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = (await res.json()) as { name: string; age: number }[];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function testFetcherDetail(id: string) {
  try {
    const res = await fetch(`https://api.example.com/api/user/${id}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = (await res.json()) as { name: string; age: number };
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
```

## 사용 예시

### 클라이언트 컴포넌트에서 쿼리 사용
```tsx
// components/UserList.tsx
// 작성날짜: 2026년 1월 29일
// 파일명: UserList.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { testQueries } from "@/queries";

export default function UserList() {
  const { data, isLoading, error } = useQuery(testQueries.list());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 쿼리 무효화
```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// 특정 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ["test", "list"] });

// 부모 쿼리 무효화 (자식도 함께)
queryClient.invalidateQueries({ queryKey: ["test"] });
```

## 문제 해결

### SSR 에러 (fetch failed)
- **원인**: 서버에서 MSW가 초기화되지 않아 실제 API 호출.
- **해결**: `prefetchQuery`를 제거하거나, 서버 초기화를 추가하세요. (위 설정 참고)

### MSW가 작동하지 않음
- 환경 변수를 확인하세요: `NEXT_PUBLIC_MSW_ENABLED=true`
- 브라우저 콘솔에서 MSW 워커가 시작되었는지 확인.

### 쿼리 키 중첩
- `["test"]`와 `["test", "list"]`는 계층적입니다. 부모 키로 무효화 시 자식도 함께 무효화됩니다.

## 참고 자료
- MSW 공식 문서: https://mswjs.io/docs/getting-started/install
- TanStack Query 공식 문서: https://tanstack.com/query/latest/docs/framework/react/overview
- Next.js MSW 통합: https://mswjs.io/docs/getting-started/integrate/nextjs