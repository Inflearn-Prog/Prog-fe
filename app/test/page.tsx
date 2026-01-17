"use client";

import { redirect } from "next/navigation";

import { LabelWrapper } from "@/components/forms/label-wrapper";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }

  return (
    <>
      <LabelWrapper label="Test Label" htmlFor="test-input">
        123
      </LabelWrapper>
    </>
  );
}
