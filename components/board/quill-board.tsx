"use client";

import "react-quill-new/dist/quill.snow.css";

import ReactQuill from "react-quill-new";

import { cn } from "@/lib/utils";

// 툴바에 이미지 버튼이 없어도 Quill 은 드롭·붙여넣기한 이미지를 base64 로 본문에
// 삽입한다. image/video 를 빼서 막는다.
const ALLOWED_FORMATS = [
  "bold",
  "italic",
  "underline",
  "strike",
  "script",
  "code",
  "code-block",
  "blockquote",
  "header",
  "list",
  "indent",
  "align",
  "direction",
  "link",
  "color",
  "background",
  "font",
  "size",
];

interface QuillBoardProps extends Omit<
  React.ComponentProps<typeof ReactQuill>,
  "onChange"
> {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  className?: string;
}

export default function QuillBoard({
  value,
  setValue,
  placeholder,
  className,
  ...props
}: QuillBoardProps) {
  return (
    <ReactQuill
      modules={{
        toolbar: [],
        // uploader: false 로 끄면 clipboard 가 quill.uploader 를 참조하다 터진다.
        // 모듈은 남기고 허용 MIME 만 비운다.
        uploader: { mimetypes: [] },
      }}
      formats={ALLOWED_FORMATS}
      {...props}
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      className={cn(`quill-no-toolbar h-160`, className)}
      theme="snow"
    />
  );
}
