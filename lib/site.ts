/**
 * 사이트 절대 URL 단일 소스(Single Source of Truth).
 *
 * `metadataBase`, `robots`, `sitemap` 등 절대 URL이 필요한 모든 곳이 이 값을 참조한다.
 * 배포 환경에서는 `NEXT_PUBLIC_SITE_URL`로 오버라이드하고, 미설정 시 운영 도메인으로 폴백한다.
 */
const FALLBACK_SITE_URL = "https://keep-prog.com";

/** 후행 슬래시가 제거된 절대 URL. 경로 연결(`${SITE_URL}${path}`) 시 이중 슬래시를 방지한다. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_SITE_URL
).replace(/\/+$/, "");
