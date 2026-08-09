import { z } from "zod";

import { stripHtml, utf8Length } from "@/lib/utils";

import {
  MAX_BOARD_CONTENT_BYTES,
  MAX_BOARD_CONTENT_LENGTH,
  MAX_BOARD_TITLE_LENGTH,
} from "./constant";

export const BLANK_TITLE_MESSAGE = "제목은 필수입니다.";
export const BLANK_CONTENT_MESSAGE = "내용은 필수입니다.";

/**
 * 프롬프트 작성/수정 폼 스키마. 백엔드 `PromptCreateRequest` 와 짝이다.
 *
 * 길이는 **trim 후** 기준으로 잰다. 서버 `@NotBlank` 는 공백을 걷어내고 판정하므로,
 * 프론트가 원문 길이만 보면 `"   "` 같은 값이 통과한 뒤 400 이 난다.
 * 본문 길이는 서식을 걷어낸 평문 기준 — 그래야 `<strong>` 남발이 글자수를 잡아먹지 않는다.
 */
export const boardSchema = z.object({
  title: z
    .string()
    .refine((val) => val.trim().length > 0, { message: BLANK_TITLE_MESSAGE })
    .refine((val) => val.trim().length <= MAX_BOARD_TITLE_LENGTH, {
      message: `제목은 최대 ${MAX_BOARD_TITLE_LENGTH}자까지 입력 가능합니다.`,
    }),
  category: z.string().min(1, "카테고리는 필수입니다."),
  content: z
    .string()
    .refine((val) => stripHtml(val).length > 0, {
      message: BLANK_CONTENT_MESSAGE,
    })
    .refine((val) => stripHtml(val).length <= MAX_BOARD_CONTENT_LENGTH, {
      message: `내용은 최대 ${MAX_BOARD_CONTENT_LENGTH}자까지 입력 가능합니다.`,
    })
    // 평문은 짧아도 서식·이미지 데이터가 크면 저장에서 걸린다. 서버와 같은 바이트 기준으로 잰다.
    .refine((val) => utf8Length(val) <= MAX_BOARD_CONTENT_BYTES, {
      message:
        "이미지나 서식이 너무 많습니다. 이미지를 빼거나, 붙여넣을 때 Ctrl+Shift+V(서식 없이 붙여넣기)를 사용해 주세요.",
    }),
});

export type BoardFormData = z.infer<typeof boardSchema>;
