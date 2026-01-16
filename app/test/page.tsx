import { redirect } from "next/navigation";

import { Board } from "@/components/board/board";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }
  return (
    <div className="inner w-full">
      <div className="w-full">
        <Board />
      </div>
    </div>
  );
}
