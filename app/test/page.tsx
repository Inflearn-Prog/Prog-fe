import Image from "next/image";
import { redirect } from "next/navigation";

import { BaseInput, IconInput } from "@/components/shared/inputs";
import {
  CategorySidebar,
  CategorySidebarItem,
} from "@/components/sidebar/category-sidebar";
import { ROUTES } from "@/lib/routes";

const categories = [
  {
    label: "카테고리 1",
    href: "/test",
  },
  {
    label: "카테고리 2",
    href: ROUTES.mypage.PROFILE,
  },
  {
    label: "카테고리 3",
    href: ROUTES.mypage.PROFILE,
  },
  {
    label: "카테고리 4",
    href: ROUTES.rank.ROOT,
  },
  {
    label: "카테고리 5",
    href: ROUTES.search.ROOT,
  },
];

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }
  return (
    <div className="w-full grid grid-cols-12 max-w-7xl mx-auto gap-4 p-4">
      <div className="col-span-3">
        <CategorySidebar title="랭킹별직군">
          <CategorySidebarItem categories={categories} />
        </CategorySidebar>
      </div>
      {/* eslint-disable-next-line no-constant-binary-expression */}
      {false && (
        <div className="inline-flex flex-col gap-2 col-span-9">
          {/* <Button>테스트 버튼</Button> */}
          <div className="w-[300px] bg-gray-400 p-4 flex flex-col gap-4">
            <BaseInput
              rounded
              id="phone1"
              name="phone1"
              value="검색어를 입력하세요"
            />
            <BaseInput
              id="phone2"
              name="phone2"
              disabled
              type={"text"}
              value="검색어를 입력하세요"
            />

            <BaseInput
              rounded
              id="phone2"
              name="phone2"
              inputSize="lg"
              type={"text"}
              value="검색어를 입력하세요"
            />
            <BaseInput
              id="phone2"
              name="phone2"
              inputSize="lg"
              disabled
              type={"text"}
              value="검색어를 입력하세요"
            />

            <IconInput
              icon={
                <Image src="/file.svg" alt="search" width={16} height={16} />
              }
              value=":hover"
              name="search"
            />

            <p className="text-15 text-gray-700">검색어를 입력하세요</p>
          </div>
        </div>
      )}
    </div>
  );
}
