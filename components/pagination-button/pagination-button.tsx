"use client";

import React, { useEffect, useState } from "react";

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
  HIDDEN: "opacity-0 pointer-events-none",
};

interface PaginationButtonProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationButton({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationButtonProps) {
  const [currentBlock, setCurrentBlock] = useState(0);
  const blockSize = 3;

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  useEffect(() => {
    if (totalPages <= 1) {
      setCurrentBlock(0);
      return;
    }
    if (currentPage === 1) {
      setCurrentBlock(0);
    } else if (currentPage === totalPages) {
      setCurrentBlock(Math.max(0, Math.floor((totalPages - 2) / blockSize)));
    } else {
      const newBlock = Math.floor((currentPage - 2) / blockSize);
      setCurrentBlock(Math.max(0, newBlock));
    }
  }, [currentPage, totalPages]);

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
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => handlePageClick(e, 1)}
          >
            1
          </PaginationLink>

          {middlePages.map((page) => (
            <PaginationLink
              key={page}
              href="#"
              isActive={currentPage === page}
              onClick={(e) => handlePageClick(e, page)}
            >
              {page}
            </PaginationLink>
          ))}

          {totalPages > 1 && (
            <PaginationLink
              href="#"
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
