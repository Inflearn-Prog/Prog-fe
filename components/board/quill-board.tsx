"use client";

import "react-quill-new/dist/quill.snow.css";

import ReactQuill from "react-quill-new";

import { cn } from "@/lib/utils";

// 본문에 이미지를 넣을 수 없도록 허용 포맷에서 image/video 를 제외한다.
// 툴바가 비어 있어 이미지 버튼은 없지만, Quill 은 드롭·붙여넣기로 들어온 이미지를
// base64 로 본문에 박아 넣는다(uploader 모듈이 기본 활성).
// 50KB 사진 한 장이면 base64 로 약 68,000자가 되어 content 컬럼(TEXT, 65,535 bytes)을
// 그대로 넘긴다. 저장은 실패하는데 사용자는 이유를 알 수 없다. (P2-18)
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
        // 허용 MIME 을 비워 드롭·붙여넣기한 이미지 파일이 base64 로 변환되지 않게 한다.
        // 모듈 자체를 끄면 clipboard 가 quill.uploader 를 참조하다 터지므로 남겨둔다.
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
