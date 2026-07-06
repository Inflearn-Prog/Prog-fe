import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

import BoardNavigate from "../board-navigate";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 글쓰기/수정은 로그인 전용. 비로그인 사용자는 진입 즉시 로그인 화면으로 보낸다.
  // (write·[id]/edit를 함께 감싸는 그룹 레이아웃이므로 두 경로 모두 가드된다.)
  const session = await auth();
  if (!session?.accessToken) {
    redirect(ROUTES.auth.SIGNIN);
  }

  return (
    <div>
      <BoardNavigate />
      {children}
    </div>
  );
}
