import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { useGetPrompts } from "@/hooks/use-prompt-list";

import { SearchSection } from "./_components/search-section";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const queryClient = new QueryClient();

  if (q) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["prompts", "search", q],
      queryFn: () => useGetPrompts(q),
      initialPageParam: 0,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchSection q={q} />
    </HydrationBoundary>
  );
}
