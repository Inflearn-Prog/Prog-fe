"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";

import { Board } from "@/components/board/board";
import { BaseButton } from "@/components/shared/button";
import { BaseInput } from "@/components/shared/inputs";
import { SelectBox } from "@/components/shared/select-box";
import { cn, isBlank, isBlankContent } from "@/lib/utils";
import {
  PromptCreateRequest,
  PromptResponse,
  PromptUpdateRequest,
} from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

import {
  BLANK_CONTENT_MESSAGE,
  BLANK_TITLE_MESSAGE,
  BoardFormData,
  boardSchema,
} from "../board-schema";
import usePromptQuery from "../hook/use-prompt-query";

interface PromptFormProps {
  initialData?: PromptResponse;
  isEdit?: boolean;
}

export function PromptForm({ initialData, isEdit = false }: PromptFormProps) {
  const router = useRouter();
  const layout = cn("max-w-7xl lg:px-0 px-5 min-w-90 mx-auto");

  const { data: categories = [] } = useQuery({
    ...promptQueries.categories(),
  });

  const form = useForm<BoardFormData>({
    mode: "onTouched",
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category.categoryId.toString() || "",
      content: initialData?.content || "",
    },
  });

  // 폼 전체에 걸리는 오류(빈 값 등)는 필드 밑이 아니라 폼 상단에 띄운다.
  // 본문 에디터가 화면을 길게 먹어서, 필드 밑 메시지는 스크롤 밖으로 밀려 안 보인다.
  const [formError, setFormError] = useState<string | null>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        category: initialData.category.categoryId.toString(),
        content: initialData.content,
      });
    }
  }, [initialData, form]);

  // 사용자가 뭔가 고치기 시작하면 상단 경고는 치운다 — 이미 고친 걸 계속 지적하지 않도록.
  useEffect(() => {
    const subscription = form.watch(() => setFormError(null));
    return () => subscription.unsubscribe();
  }, [form]);

  const { createPrompt, updatePrompt, isCreating, isUpdating } =
    usePromptQuery();

  const rejectSubmit = (message: string) => {
    setFormError(message);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = (data: BoardFormData) => {
    // 마지막 관문. 서버 @NotBlank 는 trim 후에 판정하므로 보내는 값도 trim 해서 맞춘다.
    // 스키마가 이미 걸러주지만, 여기서 한 번 더 보는 이유는 보내는 값 자체를 바꾸기 때문이다
    // ("  제목  " 이 그대로 저장되면 목록·검색이 어긋난다).
    const title = data.title.trim();
    const content = data.content;

    if (isBlank(title)) {
      rejectSubmit(BLANK_TITLE_MESSAGE);
      return;
    }
    if (isBlankContent(content)) {
      rejectSubmit(BLANK_CONTENT_MESSAGE);
      return;
    }

    setFormError(null);
    const categoryId = Number(data.category);

    if (isEdit && initialData) {
      const body: PromptUpdateRequest = {
        title,
        categoryId,
        content,
      };
      updatePrompt({ id: initialData.promptId, data: body });
    } else {
      const body: PromptCreateRequest = {
        title,
        categoryId,
        content,
      };
      createPrompt(body);
    }
  };

  // 스키마가 막은 경우에도 같은 자리에 이유를 띄운다. 제목→카테고리→본문 순으로 첫 건만.
  const handleInvalid = (errors: FieldErrors<BoardFormData>) => {
    const message =
      errors.title?.message ??
      errors.category?.message ??
      errors.content?.message;
    rejectSubmit(message ?? "입력값을 확인해주세요.");
  };

  const isPending = isCreating || isUpdating;

  const selectOptions = useMemo(
    () =>
      categories.map((c) => ({
        value: c.categoryId.toString(),
        label: c.name,
      })),
    [categories]
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}>
      <div className={layout}>
        <div ref={formTopRef} className="scroll-mt-24">
          {formError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 rounded-[6px] border border-red-300 bg-red-50 px-4 py-3 body-medium text-red-600"
            >
              {formError}
            </div>
          )}
        </div>

        <CLSBox
          text={
            form.formState.errors.title && (
              <span className="text-red-500">
                {form.formState.errors.title.message}
              </span>
            )
          }
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <BaseInput
                className="h-15 border-none font-bold text-2xl"
                {...field}
                placeholder="제목을 입력해주세요"
                viewLength
              />
            )}
          />
        </CLSBox>

        <CLSBox
          text={
            form.formState.errors.category && (
              <p className="text-red-500">
                {form.formState.errors.category.message}
              </p>
            )
          }
        >
          <Controller
            name="category"
            control={form.control}
            render={({ field }) => (
              <div className="w-full md:max-w-76.25 ">
                <SelectBox
                  {...field}
                  onValueChange={field.onChange}
                  selectOptions={selectOptions}
                />
              </div>
            )}
          />
        </CLSBox>

        <CLSBox
          text={
            form.formState.errors.content && (
              <p className="text-red-500">
                {form.formState.errors.content.message}
              </p>
            )
          }
        >
          <Controller
            name="content"
            control={form.control}
            render={({ field }) => (
              <Board
                value={field.value}
                setValue={field.onChange}
                error={!!form.formState.errors.content}
              />
            )}
          />
        </CLSBox>
      </div>

      <div className="py-5 bg-white flex items-center">
        <div
          className={cn(
            layout,
            "flex justify-end gap-x-2 flex-1 flex-wrap gap-y-5"
          )}
        >
          <BaseButton
            type="button"
            className="w-full md:w-49.25"
            variant="secondary"
            onClick={() => router.back()}
          >
            취소
          </BaseButton>

          {/* 버튼을 잠그지 않는다 — 잠그면 사용자는 "왜 안 눌리는지" 모른 채 막힌다.
              누르게 두고, 막힌 이유를 폼 상단에 글로 말해준다. */}
          <BaseButton
            type="submit"
            className="w-full md:w-49.25"
            disabled={isPending}
          >
            {isEdit ? "수정하기" : "작성하기"}
          </BaseButton>
        </div>
      </div>
    </form>
  );
}

function CLSBox({
  children,
  text,
}: {
  children: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="relative pb-7.5">
      {children}
      <p className="absolute bottom-1 left-0">{text}</p>
    </div>
  );
}
