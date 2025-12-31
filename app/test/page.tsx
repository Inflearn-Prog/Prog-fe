import Image from "next/image";
import { redirect } from "next/navigation";

import { BaseInput, IconInput } from "@/components/shared/inputs";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }
  return (
    <div>
      <div className="inline-flex flex-col gap-2 ">
        {/* <Button>테스트 버튼</Button> */}
        <div className="w-[300px] bg-black">
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
            icon={<Image src="/file.svg" alt="search" width={16} height={16} />}
            value=":hover"
            name="search"
          />

          <p className="text-15 text-gray-700">검색어를 입력하세요</p>
        </div>
      </div>
    </div>
  );
}
