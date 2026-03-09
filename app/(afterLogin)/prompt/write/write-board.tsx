"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { Board } from "@/components/board/board";
import { BaseButton } from "@/components/shared/button";
import { BaseInput } from "@/components/shared/inputs";
import { SelectBox } from "@/components/shared/select-box";
import { cn } from "@/lib/utils";
import { PromptCreateRequest } from "@/queries/api/prompts";

import { BoardFormData, boardSchema } from "../board-schema";
import usePromptQuery from "../hook/use-prompt-query";

export function WriteBoard() {
  const layout = cn("mx-auto max-w-7xl lg:px-0 px-5 min-w-90 mx-auto");

  const form = useForm<BoardFormData>({
    mode: "onTouched",
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: "",
      category: "",
      content: "",
    },
  });

  const { mutate: createPrompt } = usePromptQuery();

  const handleSubmit = (data: BoardFormData) => {
    const body: PromptCreateRequest = {
      title: data.title,
      categoryId: data.category,
      content: data.content,
    };

    createPrompt(body);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className={layout}>
        <CLSBox
          text={
            form.formState.errors.title && (
              <p className="text-red-500">
                {form.formState.errors.title.message}
              </p>
            )
          }
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <BaseInput
                className="h-15 border-none"
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
                    { value: "general", label: "General" },
                    { value: "feedback", label: "Feedback" },
                    { value: "question", label: "Question" },
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
          >
            임시저장
          </BaseButton>

          <BaseButton
            type="submit"
            className="w-full md:w-49.25"
            disabled={!form.formState.isValid}
          >
            작성하기
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
