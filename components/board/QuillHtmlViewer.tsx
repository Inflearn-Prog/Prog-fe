"use client";

import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

interface QuillHtmlViewerProps {
  html: string;
  extraCss?: string; // 뷰어 내부에 추가로 주입할 CSS
  className?: string;
}

// 프롬프트/게시글 본문(Quill HTML)을 Shadow DOM으로 격리 렌더링하는 뷰어
export function QuillHtmlViewer({
  html,
  extraCss = "",
  className,
}: QuillHtmlViewerProps) {
  return <ShadowViewer html={html} extraCss={extraCss} className={className} />;
}

// Shadow DOM 방식 - 전역 CSS와 격리하여 본문 서식 스타일을 캡슐화
function ShadowViewer({
  html,
  extraCss,
  className,
}: {
  html: string;
  extraCss?: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    try {
      if (!shadowRef.current) {
        shadowRef.current = hostRef.current.attachShadow({ mode: "open" });
      }
      const sanitized = DOMPurify.sanitize(html, { WHOLE_DOCUMENT: false });

      const wrapper = document.createElement("div");
      const style = document.createElement("style");
      style.textContent = `
        :host { all: initial; display: block; }
        *, *::before, *::after { box-sizing: border-box; }
        body, div { margin: 0; padding: 0; }
        p, ol, ul, li { margin: 0; line-height: 1.5; font-size: var(--text-17); white-space: pre-wrap; word-break: break-word; }
        ${extraCss}
      `;

      wrapper.className = className ?? "quill-viewer-content";
      // 평문/마크다운 형태로 저장된 콘텐츠(블록 태그 없음)의 줄바꿈/공백 보존
      wrapper.style.whiteSpace = "pre-wrap";
      wrapper.style.wordBreak = "break-word";
      wrapper.innerHTML = sanitized;

      // 기존 내용 초기화 후 삽입
      shadowRef.current.innerHTML = "";
      shadowRef.current.appendChild(style);
      shadowRef.current.appendChild(wrapper);
    } catch (e) {
      // 에러 발생 시 fallback 처리
      // eslint-disable-next-line no-console
      console.error("ShadowViewer render error:", e);
      if (shadowRef.current)
        shadowRef.current.innerHTML = "<div>콘텐츠를 표시할 수 없습니다.</div>";
    }
  }, [html, extraCss, className]);

  return <div ref={hostRef} />;
}

export default QuillHtmlViewer;
