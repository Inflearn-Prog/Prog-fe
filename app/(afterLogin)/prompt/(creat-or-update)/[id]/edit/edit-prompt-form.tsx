import { useSuspenseQuery } from "@tanstack/react-query";

import { promptQueries } from "@/queries/options/prompt-query";

import { PromptForm } from "../../../_components/prompt-form";

export function EditPromptForm({ id }: { id: string }) {
  const { data } = useSuspenseQuery(promptQueries.detail(id));
  return <PromptForm initialData={data} isEdit />;
}
