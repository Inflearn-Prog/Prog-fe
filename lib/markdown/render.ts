import DOMPurify from "dompurify";
import { Marked } from "marked";
import markedCjkFriendly from "marked-cjk-friendly";

// 인스턴스를 모듈 스코프에 하나만. 전역 marked 에 use() 하면 다른 곳까지 오염된다.
const md = new Marked({ gfm: true, breaks: true });
md.use(markedCjkFriendly()); // CJK 볼드 발동조건 보정 — 근거: 지시문 §5-②

// Quill 이 만든 블록 태그로 시작하면 레거시 HTML.
// 첫 줄에만 의존한다 — 마크다운 안의 인라인 HTML 을 레거시로 오인하지 않기 위함.
const LEGACY_HTML = /^\s*<(p|h[1-6]|ul|ol|blockquote|pre|div)[\s>]/i;

/** 저장된 본문이 레거시 Quill HTML 인가(마크다운 원문이 아니라). */
export function isLegacyHtml(content: string): boolean {
  return LEGACY_HTML.test(content ?? "");
}

/** 마크다운 원문 또는 레거시 HTML → 렌더 가능한 안전한 HTML. 모든 렌더는 이 함수를 경유한다. */
export function renderContent(content: string): string {
  if (!content) return "";
  const html = isLegacyHtml(content)
    ? content
    : (md.parse(content, { async: false }) as string);
  return DOMPurify.sanitize(html, { WHOLE_DOCUMENT: false });
}
