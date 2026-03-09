"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Board } from "@/components/board/board";
import { BaseButton } from "@/components/shared/button";
import { BaseInput } from "@/components/shared/inputs";
import { SelectBox } from "@/components/shared/select-box";
import { cn } from "@/lib/utils";
import {
  PromptCreateRequest,
  PromptResponse,
  PromptUpdateRequest,
} from "@/queries/api/prompts";

import { BoardFormData, boardSchema } from "../board-schema";
import usePromptQuery from "../hook/use-prompt-query";

interface PromptFormProps {
  initialData?: PromptResponse;
  isEdit?: boolean;
}

export function PromptForm({ initialData, isEdit = false }: PromptFormProps) {
  const router = useRouter();
  const layout = cn("mx-auto max-w-7xl lg:px-0 px-5 min-w-90 mx-auto");

  const form = useForm<BoardFormData>({
    mode: "onTouched",
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "",
      content: initialData?.content || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        category: initialData.category,
        content: initialData.content,
      });
    }
  }, [initialData, form]);

  const { createPrompt, updatePrompt, isCreating, isUpdating } =
    usePromptQuery();

  const handleSubmit = (data: BoardFormData) => {
    if (isEdit && initialData) {
      const body: PromptUpdateRequest = {
        title: data.title,
        categoryId: data.category,
        content: data.content,
      };
      updatePrompt({ id: initialData.id, data: body });
    } else {
      const body: PromptCreateRequest = {
        title: data.title,
        categoryId: data.category,
        content: data.content,
      };
      createPrompt(body);
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className={layout}>
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
                  selectOptions={[
                    { value: "BACKEND", label: "Backend" },
                    { value: "FRONTEND", label: "Frontend" },
                    { value: "AI", label: "AI" },
                    { value: "ETC", label: "ETC" },
                  ]}
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

          <BaseButton
            type="submit"
            className="w-full md:w-49.25"
            disabled={!form.formState.isValid || isPending}
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
