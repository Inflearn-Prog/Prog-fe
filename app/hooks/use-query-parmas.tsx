"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * URL 쿼리 파라미터를 추가, 수정, 삭제할 수 있는 유틸 훅
 *
 * @example
 * const { getParam, setParam, setParams, deleteParam, deleteParams, clearParams } = useQueryParams();
 *
 * getParam("q")                          // 특정 파라미터 값 조회
 * setParam("q", "검색어")                // 단일 파라미터 추가 / 수정
 * setParams({ q: "검색어", sort: "hot" }) // 다중 파라미터 추가 / 수정
 * deleteParam("q")                       // 단일 파라미터 삭제
 * deleteParams(["q", "sort"])            // 다중 파라미터 삭제
 * clearParams()                          // 전체 파라미터 초기화
 */
export default function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** 현재 searchParams를 복사하여 변경 가능한 URLSearchParams 인스턴스 반환 */
  const createParams = useCallback(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  /** 특정 쿼리 파라미터 값 조회 */
  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  /** 단일 쿼리 파라미터 추가 / 수정 후 URL 이동 */
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = createParams();
      params.set(key, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [createParams, pathname, router]
  );

  /** 다중 쿼리 파라미터 추가 / 수정 후 URL 이동 */
  const setParams = useCallback(
    (entries: Record<string, string>) => {
      const params = createParams();
      Object.entries(entries).forEach(([key, value]) => {
        params.set(key, value);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [createParams, pathname, router]
  );

  /** 단일 쿼리 파라미터 삭제 후 URL 이동 */
  const deleteParam = useCallback(
    (key: string) => {
      const params = createParams();
      params.delete(key);
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [createParams, pathname, router]
  );

  /** 다중 쿼리 파라미터 삭제 후 URL 이동 */
  const deleteParams = useCallback(
    (keys: string[]) => {
      const params = createParams();
      keys.forEach((key) => params.delete(key));
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [createParams, pathname, router]
  );

  /** 전체 쿼리 파라미터 초기화 후 URL 이동 */
  const clearParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    getParam,
    setParam,
    setParams,
    deleteParam,
    deleteParams,
    clearParams,
  };
}
