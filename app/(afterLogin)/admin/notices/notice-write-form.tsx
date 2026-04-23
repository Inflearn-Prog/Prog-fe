"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { toasts } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { createNotice } from "@/queries/api/admin";

interface NoticeWriteFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function NoticeWriteForm({ onBack, onSuccess }: NoticeWriteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: createNotice,
    onSuccess: () => {
      toasts.success("공지가 성공적으로 등록되었습니다.");
      onSuccess();
    },
    onError: () => {
      toasts.error("공지 등록에 실패했습니다.");
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    mutation.mutate({ title: title.trim(), content: content.trim() });
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로 돌아가기
      </button>

      <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <input
            type="text"
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            className="w-full border-b border-gray-200 pb-3 text-lg outline-none placeholder:text-gray-400 focus:border-frog-600"
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {title.length}/50
          </p>
        </div>

        <div>
          <textarea
            placeholder="내용을 입력해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={5000}
            rows={15}
            className="w-full resize-none rounded-md border border-gray-200 p-4 text-sm outline-none placeholder:text-gray-400 focus:border-frog-600"
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {content.length}/5000
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || !title.trim() || !content.trim()}
            variant="outline"
          >
            {mutation.isPending ? "등록 중..." : "작성하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
