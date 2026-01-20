"use client";

import dynamic from "next/dynamic";

import { BoardSkeleton } from "../ui/skeleton";

const QuillBoardDynamic = dynamic(
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return import("./quill-board");
  },
  {
    ssr: false,
    loading: () => <BoardSkeleton />,
  }
);
export interface BoardProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}

export function Board({ value, setValue, placeholder = "" }: BoardProps) {
  return (
    <QuillBoardDynamic
      value={value}
      setValue={setValue}
      placeholder={placeholder}
    />
  );
}
