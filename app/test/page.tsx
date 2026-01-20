"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { Board } from "@/components/board/board";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }
  const [data, setData] = useState("안녕하세요");
  return (
    <div className="inner w-full bg-amber-500/20 p-4">
      <Board value={data} setValue={setData} placeholder="Enter text here..." />
    </div>
  );
}
