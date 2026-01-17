"use client";

import { redirect } from "next/navigation";

import { toasts } from "@/components/shared/toast";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }

  return (
    <div className="w-full ">
      <button
        onClick={() => toasts().success("게시글이 성공적으로 등록되었습니다.")}
      >
        게시글이 성공적으로 등록되었습니다.
      </button>
    </div>
  );
}
