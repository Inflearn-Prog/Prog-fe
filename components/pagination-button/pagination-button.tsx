"use client";

import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGINATION_STYLE = {
  CONTAINER: "gap-2 min-w-[400px] justify-between",
  ARROW_GROUP: "flex flex-row gap-1 transition-opacity duration-300",
  NUMBER_GROUP: "flex flex-row gap-1 items-center justify-center min-w-[232px]",
  HIDDEN: "opacity-0 pointer-events-none invisible",
};

interface PaginationButtonProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  onPageChange: (page: number) => void;
}

export function PaginationButton({
  currentPage,
  totalPages,
  baseUrl,
  onPageChange,
}: PaginationButtonProps) {
  const blockSize = 3;

  const createPageHref = (page: number) => {
    return baseUrl ? `${baseUrl}?page=${page}` : `?page=${page}`;
  };
  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  //변수로 선언하여 렌더링 과정에서 계산하도록 변경
  let currentBlock = 0;
  if (totalPages > 1) {
    if (currentPage === 1) {
      currentBlock = 0;
    } else if (currentPage === totalPages) {
      currentBlock = Math.max(0, Math.floor((totalPages - 2) / blockSize));
    } else {
      currentBlock = Math.max(0, Math.floor((currentPage - 2) / blockSize));
    }
  }

  const getMiddlePages = () => {
    const start = 2 + currentBlock * blockSize;
    const pages = [];
    for (let i = 0; i < blockSize; i++) {
      const pageNum = start + i;
      if (pageNum > 1 && pageNum < totalPages) pages.push(pageNum);
    }
    return pages;
  };

  const middlePages = getMiddlePages();

  const getArrowClass = (isHidden: boolean) =>
    `${PAGINATION_STYLE.ARROW_GROUP} ${isHidden ? PAGINATION_STYLE.HIDDEN : ""}`;

  return (
    <Pagination>
      <PaginationContent className={PAGINATION_STYLE.CONTAINER}>
        {/* 왼쪽 화살표 */}
        <PaginationItem className={getArrowClass(currentPage === 1)}>
          <PaginationFirst href="#" onClick={(e) => handlePageClick(e, 1)} />
          <PaginationPrevious
            href="#"
            onClick={(e) => handlePageClick(e, currentPage - 1)}
          />
        </PaginationItem>

        {/* 숫자 그룹 */}
        <PaginationItem className={PAGINATION_STYLE.NUMBER_GROUP}>
          <PaginationLink
            href={createPageHref(1)}
            isActive={currentPage === 1}
            onClick={(e) => handlePageClick(e, 1)}
          >
            1
          </PaginationLink>

          {middlePages.map((page) => (
            <PaginationLink
              key={page}
              href={createPageHref(page)}
              isActive={currentPage === page}
              onClick={(e) => handlePageClick(e, page)}
            >
              {page}
            </PaginationLink>
          ))}

          {totalPages > 1 && (
            <PaginationLink
              href={createPageHref(totalPages)}
              isActive={currentPage === totalPages}
              onClick={(e) => handlePageClick(e, totalPages)}
            >
              {totalPages}
            </PaginationLink>
          )}
        </PaginationItem>

        {/* 오른쪽 화살표 */}
        <PaginationItem className={getArrowClass(currentPage === totalPages)}>
          <PaginationNext
            href="#"
            onClick={(e) => handlePageClick(e, currentPage + 1)}
          />
          <PaginationLast
            href="#"
            onClick={(e) => handlePageClick(e, totalPages)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
