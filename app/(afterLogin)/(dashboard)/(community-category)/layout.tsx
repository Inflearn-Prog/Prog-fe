import Link from "next/link";
import { Suspense } from "react";

import { BaseButton } from "@/components/shared/button";
import { ProgSidebar } from "@/components/sidebar/category-sidebar";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 bg-gray-50">
      <section className="lg:hidden mb-12">
        {session && (
          <BaseButton asChild full size="lg">
            <Link href={ROUTES.community.WRITE}>글쓰기</Link>
          </BaseButton>
        )}
      </section>

      <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 items-start">
        {/* 왼쪽: 사이드바 */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 pt-29.5">
          {session && (
            <BaseButton asChild full size="lg">
              <Link href={ROUTES.community.WRITE}>글쓰기</Link>
            </BaseButton>
          )}
          <Suspense>
            <ProgSidebar />
          </Suspense>
        </aside>

        {/* 오른쪽: 메인 아이템 */}
        <main className="col-span-4 lg:col-span-9 flex flex-col gap-4">
          {children}
        </main>
      </div>
    </div>
  );
}
