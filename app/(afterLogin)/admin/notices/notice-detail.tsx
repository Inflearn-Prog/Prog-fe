"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { getAdminNoticeDetail } from "@/queries/api/admin";

interface NoticeDetailProps {
  noticeId: number;
  onBack: () => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function NoticeDetail({ noticeId, onBack }: NoticeDetailProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "notices", noticeId],
    queryFn: () => getAdminNoticeDetail(noticeId),
    select: (res) => res.data,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
        <div className="h-40 w-full animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 text-center text-gray-400">
        공지사항을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로 돌아가기
      </button>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">{data.title}</h2>
        <p className="mt-1 text-sm text-gray-400">
          {formatDate(data.createdAt)}
        </p>
        <hr className="my-4" />
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {data.content}
        </p>
      </div>
    </div>
  );
}
