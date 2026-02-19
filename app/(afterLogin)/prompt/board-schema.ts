import { z } from "zod";

import { stripHtml } from "@/lib/utils";

import { MAX_BOARD_CONTENT_LENGTH } from "./constant";

export const boardSchema = z.object({
  title: z
    .string()
    .min(1, "제목은 필수입니다.")
    .max(100, "제목은 최대 100자까지 입력 가능합니다."),
  content: z
    .string()
    .min(1, "내용은 필수입니다.")
    .refine((val) => stripHtml(val).length <= MAX_BOARD_CONTENT_LENGTH, {
      message: `내용은 최대 ${MAX_BOARD_CONTENT_LENGTH}자까지 입력 가능합니다.`,
    }),
  // category:
});

export type BoardFormData = z.infer<typeof boardSchema>;
