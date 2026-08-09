import { type ClassValue, clsx } from "clsx";
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

// 태그로 인정하는 것: `<`+영문자(또는 `</`)로 시작해 `>`로 닫히는 것만.
// 예전엔 /<[^>]*>?/gm 이었는데 `>`가 선택이라 `<` 하나가 문자열 끝까지를 삼켰다.
// "if (x < 10) return;" -> "if (x". 프롬프트 공유 사이트에서 코드 스니펫과
// `<your input here>` 같은 플레이스홀더가 흔한데, 그게 통째로 사라졌다.
// 이 함수의 반환 길이가 본문 5000자 제한의 분모라, 잘못 세면 검증까지 같이 틀린다.
const HTML_COMMENT = /<!--[\s\S]*?-->/g;
const HTML_TAG = /<\/?[a-zA-Z][^>]*>/g;

export function stripHtml(html: string) {
  if (!html) return "";
  return html
    .replace(HTML_COMMENT, "")
    .replace(HTML_TAG, "")
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

/**
 * UTF-8 바이트 수. 백엔드 `ByteLengthValidator.utf8Length` 와 같은 값을 재야 한다.
 * DB 용량은 글자가 아니라 바이트라, 한글 본문은 평문 글자수가 통과해도 바이트에서 걸린다.
 */
export function utf8Length(value: string) {
  if (!value) return 0;
  return new TextEncoder().encode(value).length;
}

/** 공백만으로 이루어졌는가(= 서버 `@NotBlank` 가 거부할 값인가). */
export function isBlank(value: string | null | undefined) {
  return !value || value.trim().length === 0;
}

/** 서식을 걷어낸 뒤에도 남는 글자가 없는가. 에디터가 남긴 `<p><br></p>` 를 잡는다. */
export function isBlankContent(value: string | null | undefined) {
  return !value || stripHtml(value).length === 0;
}

const BLOCK_CLOSE_TAG = /<\/(p|div|h[1-6]|li|blockquote|tr)>/gi;
const BR_TAG = /<br\s*\/?>/gi;

export function htmlToPlainText(html: string) {
  if (!html) return "";
  const withBreaks = html
    .replace(BR_TAG, "\n")
    .replace(BLOCK_CLOSE_TAG, "$&\n");
  return stripHtml(withBreaks)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
