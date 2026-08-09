"use client";

import { useEffect, useState } from "react";

import { renderContent } from "@/lib/markdown/render";
import { cn } from "@/lib/utils";

interface ContentViewerProps {
  content: string;
  className?: string;
}

/**
 * 프롬프트/게시글 본문 뷰어 — 마크다운 원문 또는 레거시 HTML 을 렌더한다.
 * renderContent 는 DOMPurify(브라우저 window 필요)를 타므로 useEffect 안에서만 호출한다.
 * (클라 컴포넌트도 서버에서 초기 렌더되므로, render 본문에서 부르면 SSR 에서 터진다.)
 * 상세 뷰와 에디터 프리뷰가 같은 `.prompt-prose` 클래스를 공유 = 출력 사양 단일화.
 */
export function ContentViewer({ content, className }: ContentViewerProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    setHtml(renderContent(content));
  }, [content]);

  return (
    <div
      className={cn("prompt-prose", className)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default ContentViewer;
