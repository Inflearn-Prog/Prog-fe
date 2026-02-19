import { Suspense } from "react";

import Count from "./_components/count";
import KyTest from "./_components/KyTest";

export const dynamic = "force-dynamic";

export default function page() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div>
      <h1>테스트 페이지</h1>
      <p>이 페이지는 테스트용 페이지입니다.</p>

      <Count />
      <Suspense fallback={<div>Loading...</div>}>
        <KyTest />
      </Suspense>
    </div>
  );
}
