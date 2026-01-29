"use client";

import "react-quill-new/dist/quill.snow.css";

import ReactQuill from "react-quill-new";

import { cn } from "@/lib/utils";

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
      }}
      {...props}
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      className={cn(`quill-no-toolbar h-160`, className)}
      theme="snow"
    />
  );
}
