"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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

      <button type="submit">submit</button>
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
