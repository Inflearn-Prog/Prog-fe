import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * 루트 `/sitemap.xml`을 생성한다(Next.js 파일 컨벤션).
 *
 * **범위: 정적 공개 라우트만.** 동적 프롬프트 상세(`/prompt/[id]`)는 인증 fetcher 의존으로
 * 빌드시점 수집에 제약이 있어 P1로 유보한다(원장 YT-SEO-001).
 */
const STATIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/community", changeFrequency: "hourly", priority: 0.9 },
  { path: "/rank", changeFrequency: "daily", priority: 0.8 },
  { path: "/search", changeFrequency: "weekly", priority: 0.5 },
  { path: "/terms/faq.html", changeFrequency: "monthly", priority: 0.4 },
  { path: "/terms/terms.html", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms/privacy.html", changeFrequency: "yearly", priority: 0.3 },
] as const satisfies ReadonlyArray<{
  path: string;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  priority: number;
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
