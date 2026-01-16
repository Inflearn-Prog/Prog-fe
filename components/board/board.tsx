"use client";

import { useState } from "react";

import { BaseButton } from "../shared/button";
import { BaseInput } from "../shared/inputs";
import { SelectBox } from "../shared/select-box";

export function Board() {
  const [selectData, setSelectData] = useState("");
  return (
    <form>
      <div className="flex items-center justify-between">
        <div>{`<-`} 게시글 작성하기</div>
        <div>
          <BaseButton variant="outline">임시저장된 글 1</BaseButton>
        </div>
      </div>

      <div>
        <BaseInput name="postTitle" />
      </div>

      <div>
        <SelectBox
          selectOptions={[
            { label: "카테고리 1", value: "category1" },
            { label: "카테고리 2", value: "category2" },
            { label: "카테고리 3", value: "category3" },
          ]}
          placeholder="카테고리를 선택하세요"
          value={selectData}
          onValueChange={(e: string) => setSelectData(e)}
        />
      </div>

      <div>quill 에디터 자리</div>

      <div className="flex justify-end">
        <BaseButton variant="outline">임시저장</BaseButton>
        <BaseButton>저장하기</BaseButton>
      </div>
    </form>
  );
}
