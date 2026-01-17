"use client";

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

/**
 *
 * @param suspenseFallback 로딩 대체 UI
 * @param errorFallback 에러 발생 시 대체 UI
 * @returns
 */
export default function SuspenseErrorBoundaryProviders({
  children,
  suspenseFallback,
  errorFallback,
}: {
  children: React.ReactNode;
  suspenseFallback: React.ReactNode;
  errorFallback: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
