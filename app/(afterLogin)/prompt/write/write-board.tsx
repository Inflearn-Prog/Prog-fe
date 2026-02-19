"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Board } from "@/components/board/board";
import { BaseInput } from "@/components/shared/inputs";

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
      {form.formState.errors.content && <span>This field is required</span>}

      <button type="submit">submit</button>
    </form>
  );
}
