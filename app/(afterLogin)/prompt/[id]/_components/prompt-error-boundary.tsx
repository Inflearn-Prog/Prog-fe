"use client";

import Link from "next/link";
import { Component, type ReactNode } from "react";

import { BaseButton } from "@/components/shared/button";
import { ApiError } from "@/lib/fetcher";
interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class PromptErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error) {
      const isAccessDenied =
        error instanceof ApiError && error.httpStatus === 403;

      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <h2 className="heading-medium text-gray-900">
            {isAccessDenied
              ? "접근이 제한된 프롬프트입니다."
              : "프롬프트를 불러올 수 없습니다."}
          </h2>
          <p className="body-medium text-gray-500">
            {isAccessDenied
              ? "비공개 프롬프트이거나 접근 권한이 없습니다."
              : "잠시 후 다시 시도해주세요."}
          </p>
          <BaseButton asChild size="lg">
            <Link href="/community">프롬프트 목록으로 돌아가기</Link>
          </BaseButton>
        </div>
      );
    }

    return this.props.children;
  }
}
