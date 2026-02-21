import { PageTitleGroup } from "@/components/shared/page-title-group";

import MypageActivitySection from "./MypageActivity";
import MypageLeftSection from "./MypageLeftSection";
import MypageRightSection from "./MypageRightSection";
import MypageTabButtons from "./MypageTabButtons";

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab = (tab as "profile" | "activity") || "profile";

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 bg-gray-50">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-10">
        <div className="lg:col-start-4 lg:col-span-9 mb-17.5 col-span-4">
          <PageTitleGroup title={"마이페이지"} />
        </div>

        {/* 탭 버튼 영역 */}
        <div className="lg:col-start-4 lg:col-span-9 col-span-4 mb-7">
          <MypageTabButtons activeTab={activeTab} />
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 items-start">
        {/* 왼쪽: 유저 프로필 */}
        <aside className="col-span-4 lg:flex lg:col-span-3 flex-col gap-6">
          <MypageLeftSection />
        </aside>

        {/* 오른쪽: 탭 내용 */}
        <main className="col-span-4 lg:col-span-9 flex flex-col gap-4">
          {activeTab === "profile" ? (
            <MypageRightSection />
          ) : (
            <MypageActivitySection />
          )}
        </main>
      </div>
    </div>
  );
}
