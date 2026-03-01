// 2026-02-27 rank/layout.tsx
// Next.js layout은 searchParams를 지원하지 않으므로 단순 래퍼로만 사용합니다.
// 참고: https://nextjs.org/docs/app/api-reference/file-conventions/layout

export default function RankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-5.5">{children}</div>;
}
