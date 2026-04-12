"use client";

import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { getStatsSummary } from "@/queries/api/admin";

import { MetricInfo } from "../types";

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

function MetricCard({
  label,
  metric,
  hasError,
}: {
  label: string;
  metric: MetricInfo | undefined;
  hasError?: boolean;
}) {
  if (hasError) {
    return (
      <div className="flex-1 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{label}</span>
          <span className="text-xs font-medium text-red-500">(오류 발생)</span>
        </div>
        <div className="mt-2 flex items-end justify-end gap-2">
          <span className="mb-1 text-xs text-gray-400">▲ 0 (0.0%)</span>
          <span className="text-3xl font-bold">0</span>
        </div>
      </div>
    );
  }

  if (!metric) {
    return (
      <div className="flex-1 rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  const isPositive = metric.increment > 0;
  const isNegative = metric.increment < 0;

  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-2 flex items-end justify-end gap-2">
        {metric.increment !== 0 && (
          <span
            className={cn(
              "mb-1 text-xs",
              isPositive && "text-blue-600",
              isNegative && "text-red-500"
            )}
          >
            {isPositive ? "▲" : "▼"} {formatNumber(Math.abs(metric.increment))}{" "}
            ({metric.percentage.toFixed(1)}%)
          </span>
        )}
        <span className="text-3xl font-bold">{formatNumber(metric.count)}</span>
      </div>
    </div>
  );
}

export function StatsCards() {
  const { data, isError } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => getStatsSummary(),
    select: (res) => res.data,
  });

  return (
    <div className="flex gap-4">
      <MetricCard
        label="오늘 가입자"
        metric={data?.newUsers}
        hasError={isError}
      />
      <MetricCard
        label="오늘 등록된 프롬프트"
        metric={data?.newPrompts}
        hasError={isError}
      />
      <MetricCard
        label="오늘 복사"
        metric={data?.copyCount}
        hasError={isError}
      />
    </div>
  );
}
