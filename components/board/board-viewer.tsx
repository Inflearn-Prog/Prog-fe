"use client";

import DOMPurify from "dompurify";

import { cn } from "@/lib/utils";

export default function BoardViewer({
  className,
  content,
}: {
  className?: string;
  content: string;
}) {
  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <div
      className={cn(className, "quill-editor")}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      role="article"
    />
  );
}
