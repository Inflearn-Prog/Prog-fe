"use client";

import { useState } from "react";

import { BaseButton } from "../shared/button";
import { BaseInput } from "../shared/inputs";
import { SelectBox } from "../shared/select-box";
import { QuillBoard } from "./quill-board";

export function Board() {
  const [selectData, setSelectData] = useState("");
  const [textData, setTextData] = useState("");
  return (
    <form className="p-5 bg-gray-300">
      <div className="flex items-center justify-between">
        <div>{`<-`} 게시글 작성하기</div>
        <div>
          <BaseButton variant="outline">임시저장된 글 1</BaseButton>
        </div>
      </div>

      <div>
        <BaseInput name="postTitle" />
      </div>

      <div className="">
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

      <div className="my-5">
        <QuillBoard
          value={textData}
          setValue={(e: string) => setTextData(e)}
          placeholder="검색어를 입력해람"
        />
      </div>

      <div className="flex justify-end">
        <BaseButton variant="outline">임시저장</BaseButton>
        <BaseButton>저장하기</BaseButton>
      </div>
    </form>
  );
}
