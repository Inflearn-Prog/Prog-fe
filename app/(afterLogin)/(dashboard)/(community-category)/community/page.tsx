import { Suspense } from "react";

import { CommunityListSection } from "../_components/community-list-section";

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-gray-400">불러오는 중...</div>
      }
    >
      <CommunityListSection />
    </Suspense>
  );
}

/**
 * 커뮤니티 페이지
 * search Params:
 *   category - 카테고리별 게시글 필터링
 *     development | marketing_content | service_planning | hr_general_affairs | design
 *   sort - 정렬 방식
 *     latest (기본값) | popular
 */
