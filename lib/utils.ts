import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  //파스텔톤 컬러 적용
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 60%)`;
}

export function formatRelativeDate(dateString: string) {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

const HTML_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  // 붙여넣기(워드/웹) 등으로 자주 유입되는 타이포그래픽 엔티티
  mdash: "—",
  ndash: "–",
  hellip: "…",
  middot: "·",
  bull: "•",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  copy: "©",
  reg: "®",
  trade: "™",
  deg: "°",
};

// String.fromCodePoint은 유효 범위(0~0x10FFFF) 밖 값에 RangeError를 던진다.
// stripHtml은 무검증 콘텐츠(백엔드 contentSummary 등)를 렌더 도중 처리하므로,
// 잘못된 숫자 엔티티가 렌더를 크래시시키지 않도록 가드한다.
function safeFromCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

export function stripHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&#(\d+);/g, (_, n) => safeFromCodePoint(Number(n)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, n) =>
      safeFromCodePoint(parseInt(n, 16))
    )
    .replace(
      /&([a-zA-Z]+);/g,
      (m, name) => HTML_ENTITIES[name.toLowerCase()] ?? m
    )
    .trim();
}

export const clearAuthCookiesClientSide = () => {
  const cookiesToClear = [
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.session-token",
    "__Host-next-auth.csrf-token",
  ];

  cookiesToClear.forEach((cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  });
};
