"use client";

import { Suspense, use } from "react";

import { PromptFormSkeleton } from "../../../_components/prompt-form-skeleton";
import { EditPromptForm } from "./edit-prompt-form";

export default function PromptEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<PromptFormSkeleton />}>
      <EditPromptForm id={id} />
    </Suspense>
  );
}
