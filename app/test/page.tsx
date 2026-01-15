"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { SelectBox, SelectOption } from "@/components/shared/select-box";

const SAMPLE_OPTIONS: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];
export default function TestPage() {
  const [data, setData] = useState<string>("");
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }

  return (
    <div className="border p-4 w-full">
      <SelectBox
        value={data}
        onValueChange={(value) => {
          setData(value);
        }}
        selectOptions={SAMPLE_OPTIONS}
      />
    </div>
  );
}
