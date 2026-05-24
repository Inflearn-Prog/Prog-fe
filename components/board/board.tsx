"use client";

import dynamic from "next/dynamic";

import { MAX_BOARD_CONTENT_LENGTH } from "@/app/(afterLogin)/prompt/constant";
import { stripHtml } from "@/lib/utils";

import { BoardSkeleton } from "../ui/skeleton";

const QuillBoardDynamic = dynamic(
  async () => {
    return import("./quill-board");
  },
  {
    ssr: false,
    loading: () => <BoardSkeleton />,
  }
);

const QuillViewerDynamic = dynamic(
  async () => {
    return import("./QuillHtmlViewer");
  },
  {
    // ssr: false,
    // loading: () => <BoardSkeleton />,
  }
);
export interface BoardProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  error?: boolean; // 에러 상태 prop 추가
}

export function Board({
  value,
  setValue,
  placeholder = "",
  error = false,
}: BoardProps) {
  const borderColor = error ? "border border-red-500" : "";

  return (
    <div className={`rounded ${borderColor} relative`}>
      <QuillBoardDynamic
        value={value}
        setValue={setValue}
        placeholder={placeholder}
        className="bg-white"
      />
      <div className="flex absolute bottom-1 right-2 w-full justify-end px-2 py-1">
        <p
          className={`text-xs ${stripHtml(value).length > MAX_BOARD_CONTENT_LENGTH ? "text-red-500 font-semibold" : "text-gray-500"}`}
        >
          {stripHtml(value).length} / {MAX_BOARD_CONTENT_LENGTH}
        </p>
      </div>
    </div>
  );
}

export function BoardViewer({ content }: { content: string }) {
  return <QuillViewerDynamic html={content} />;
}
