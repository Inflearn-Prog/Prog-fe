"use client";

import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

interface QuillHtmlViewerProps {
  html: string;
  extraCss?: string; // 뷰어 내부에 추가로 주입할 CSS
  className?: string;
}

// 상위 컴포넌트: mode에 따라 렌더러 선택
export function QuillHtmlViewer({
  html,
  extraCss = "",
  className,
}: QuillHtmlViewerProps) {
  return <ShadowViewer html={html} extraCss={extraCss} className={className} />;
}

// 1) Shadow DOM 방식 - 가볍고 스타일 캡슐화 효과
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
        p, ol, ul, li { margin: 0; line-height: 1.5; font-size: var(--text-17);}
        ${extraCss}
      `;

      wrapper.className = className ?? "quill-viewer-content";
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
