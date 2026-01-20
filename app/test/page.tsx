"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { SelectLabel } from "@/components/forms";
import { InputLabel } from "@/components/forms/input-label";
import { LabelWrapper } from "@/components/forms/ui/label-wrapper";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }

  const [select, setSelect] = useState("");
  const [input, setInput] = useState("");
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
      <div className="w-full">
        <InputLabel
          label="Test Input"
          htmlFor="test-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="input test"
          maxLength={20}
          viewLength
        />
      </div>

      <LabelWrapper label="Test Label" htmlFor="test-input">
        123
      </LabelWrapper>
    </>
  );
}
