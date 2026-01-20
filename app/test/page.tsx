"use client";
import "react-quill-new/dist/quill.snow.css";

import { useState } from "react";

import { Board, BoardViewer } from "@/components/board/board";
import { BoardSkeleton } from "@/components/ui/skeleton";

export default function TestPage() {
  // const isDevelopment = process.env.NODE_ENV === "development";
  // if (!isDevelopment) {
  //   redirect("/");
  // }
  const [data, setData] = useState("안녕하세요 반갑습니다");
  console.log(data);
  return (
    <div className="inner w-full bg-amber-100 p-4">
      <div className="h-200">
        <Board
          value={data}
          setValue={setData}
          placeholder="Enter text here..."
        />
      </div>
      <BoardViewer content={data} />

      <BoardSkeleton />
    </div>
  );
}
