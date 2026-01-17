"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { SelectLabel } from "@/components/forms";
import { LabelWrapper } from "@/components/forms/ui/label-wrapper";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }

  const [select, setSelect] = useState("");
  return (
    <>
      <div className="w-full">
        <SelectLabel
          label="Test Label"
          htmlFor="test-select"
          selectOptions={[
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ]}
          value={select}
          onValueChange={setSelect}
          placeholder="test 55"
        />
      </div>
      <LabelWrapper label="Test Label" htmlFor="test-input">
        123
      </LabelWrapper>
    </>
  );
}
