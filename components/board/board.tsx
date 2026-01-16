"use client";

import { BaseButton } from "../shared/button";
import { BaseInput } from "../shared/inputs";

export function Board() {
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

      <div>셀렉트 박스 자리</div>

      <div>quill 에디터 자리</div>

      <div className="flex justify-end">
        <BaseButton variant="outline">임시저장</BaseButton>
        <BaseButton>저장하기</BaseButton>
      </div>
    </form>
  );
}
