"use client";

import { useRouter } from "next/navigation";

import { SelectBox } from "@/components/shared/select-box";
import { RANK_CATEGORY_LIST } from "@/components/sidebar/constant";
import { Label } from "@/components/ui/label";

export default function RankSelectBar({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const router = useRouter();
  const currentItem = RANK_CATEGORY_LIST.items.find((item) => {
    if (defaultValue === "all") return item.label === "전체";
    return item.href.includes(`category=${defaultValue}`);
  });

  return (
    <div className="flex flex-col gap-2">
      <Label className="heading-small font-bold!">직군별 랭킹</Label>
      <SelectBox
        value={currentItem?.href as string}
        onValueChange={(href) => router.push(href)}
        selectOptions={RANK_CATEGORY_LIST.items.map((item) => ({
          label: item.label,
          value: item.href,
        }))}
      />
    </div>
  );
}
