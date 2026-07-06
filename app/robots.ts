import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * 루트 `/robots.txt`를 생성한다(Next.js 파일 컨벤션).
 * 공개 콘텐츠는 허용하고, 어드민·마이페이지·API·작성/수정 등 비공개 경로는 차단한다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/mypage",
        "/api/",
        "/prompt/write",
        "/prompt/*/edit",
        "/auth-callback",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
