"use client";

import "react-quill-new/dist/quill.snow.css";

import ReactQuill from "react-quill-new";

interface QuillBoardProps {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}
export function QuillBoard({ value, setValue, placeholder }: QuillBoardProps) {
  return (
    <ReactQuill
      modules={{
        toolbar: [],
      }}
      theme="snow"
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      className="quill-no-toolbar"
    />
  );
}
