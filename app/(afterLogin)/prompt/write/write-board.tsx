"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Board } from "@/components/board/board";
import { BaseInput } from "@/components/shared/inputs";
import { SelectBox } from "@/components/shared/select-box";

import { BoardFormData, boardSchema } from "../board-schema";

export function WriteBoard() {
  const form = useForm<BoardFormData>({
    mode: "onTouched",
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleSubmit = (data: BoardFormData) => {
    console.log("submit ", data);
  };
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="">
      {/* <BaseInput></BaseInput> */}
      <Controller
        name="title"
        control={form.control}
        render={({ field }) => <BaseInput {...field} />}
      />
      {form.formState.errors.title && (
        <p className="text-red-500">{form.formState.errors.title.message}</p>
      )}

      <Controller
        name="category"
        control={form.control}
        render={({ field }) => (
          <SelectBox
            {...field}
            onValueChange={field.onChange}
            selectOptions={[
              { value: "general", label: "General" },
              { value: "feedback", label: "Feedback" },
              { value: "question", label: "Question" },
            ]}
          />
        )}
      />
      {form.formState.errors.category && (
        <p className="text-red-500">{form.formState.errors.category.message}</p>
      )}
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
      {form.formState.errors.content && (
        <p className="text-red-500">{form.formState.errors.content.message}</p>
      )}
      <button type="submit">submit</button>
    </form>
  );
}
