"use client";

import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }

  return (
    <>
      <button onClick={() => toast("asd")}>asd</button>
    </>
  );
}
