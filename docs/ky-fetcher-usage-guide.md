// 작성일: 2026년 2월 19일
// 파일명: docs/ky-fetcher-usage-guide.md

# Ky fetcher & React Query 사용 가이드

이 문서는 ky 기반 fetcher와 React Query를 활용한 API 호출 예시 및 베스트 프랙티스를 안내합니다.

---

## 1. GET 요청 예시 (with Suspense Query)

```tsx
"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetch";

export default function UserDetail() {
  // user/11 데이터 조회
  const { data } = useSuspenseQuery({
    queryKey: ["user", 11],
    queryFn: async () => {
      // 반드시 .json() 호출로 파싱된 데이터 반환
      const response = await fetcher.get("user/11").json();
      return response;

      // .json()을 사용하지 않으면 따로 .json() 사용
      const response = await fetcher.get("user/11")

      ...

      const result = await response.json();
      return result;
    },
  });

  return (
    <div>
      <h2>유저 정보</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

---

## 2. POST 요청 예시

```tsx
import { fetcher } from "@/lib/fetch";

async function createUser() {
  const response = await fetcher
    .post("user", {
      json: {
        name: "John Doe",
        email: "123@kakao.com",
        age: 30,
      },
    })
    .json();
  // response: 생성된 유저 데이터
  return response;
}
```

---

## 3. 주의사항 및 베스트 프랙티스

- ky fetcher 사용 시 항상 `.json()`을 호출하여 파싱된 데이터를 반환받으세요.
- prefixUrl이 설정되어 있으므로, 경로는 슬래시(`/`) 없이 작성합니다. (예: `user/11`)
- React Query의 Suspense Query와 함께 사용하면, 로딩/에러 상태 관리가 쉬워집니다.
- POST/PUT 등 요청 시, body는 `{ json: { ... } }` 형태로 전달합니다.
- 에러 응답은 ApiErrorData 타입에 맞춰 처리하세요.

---

공식문서 참고

- [ky .json() 사용법](https://github.com/sindresorhus/ky#json)
- [TanStack React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
