"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { use } from "react";

import { promptQueries } from "@/queries/options/prompt-query";

import { PromptForm } from "../../../_components/prompt-form";
import { PromptFormSkeleton } from "../../../_components/prompt-form-skeleton";

export default function PromptEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useQuery(promptQueries.detail(id));

  if (isLoading) {
    return <PromptFormSkeleton />;
  }

  if (isError || !data) {
    return notFound();
  }

  return <PromptForm initialData={data} isEdit />;
}
