import { useRouter, useSearchParams } from "next/navigation";

export const useSubTabFilters = (rootPath: string = "mypage") => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);

    if (key !== "page") {
      params.set("page", "0");
    }

    const targetPath = rootPath.startsWith("/") ? rootPath : `/${rootPath}`;
    router.push(`${targetPath}?${params.toString()}`, { scroll: false });
  };

  const handleSubTabChange = (sub: "liked" | "posted") => {
    updateParams("sub", sub);
  };

  const handlePageChange = (page: number) => {
    updateParams("page", page.toString());
  };

  return {
    currentSub: searchParams.get("sub") || "liked",
    currentPage: Number(searchParams.get("page")) || 0,
    handleSubTabChange,
    handlePageChange,
  };
};
