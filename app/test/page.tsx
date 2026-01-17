"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { BaseInput } from "@/components/shared/inputs";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }

  const [data, setData] = useState("");

  return (
    <div className="p-4 bg-gray-500">
      <BaseInput
        name={"input"}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </div>
  );
}
