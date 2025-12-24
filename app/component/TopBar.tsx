"use client";

import Link from "next/link";
import Image from "next/image";

export default function TopBar() {
  return (
    <div className="grid grid-cols-12 w-full h-[60px] bg-white border-b border-gray-100 items-center">
      <div className="col-start-1 col-end-13 px-6 md:px-16 flex flex-row justify-between items-center w-full">
        
        {/* 왼쪽 섹션: 로고 + 메뉴 */}
        <div className="flex flex-row items-center">
          <div className="mr-8 lg:mr-12">
            <Link href={"/"}>
              <Image src="/심볼.svg" height={40} width={44} alt="plog" priority />
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="flex flex-row gap-2 lg:gap-4">
              <li className="navigation-large text-gray-900 px-3 py-2 hover:text-frog-600 transition-colors">
                <Link href={"/ranking"}>랭킹</Link>
              </li>
              <li className="navigation-large text-gray-900 px-3 py-2 hover:text-frog-600 transition-colors">
                <Link href={"/community"}>커뮤니티</Link>
              </li>
              <li className="navigation-large text-gray-900 px-3 py-2 hover:text-frog-600 transition-colors">
                <Link href={"/qna"}>자주 묻는 질문</Link>
              </li>
              <li className="navigation-large text-gray-900 px-3 py-2 hover:text-frog-600 transition-colors">
                <Link href={"/mypage"}>마이페이지</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* 오른쪽 섹션: 검색 + 로그인 버튼 */}
        <div className="flex flex-row items-center gap-3">
          <div className="hidden sm:flex flex-row items-center h-10 bg-gray-50 border border-gray-100 rounded-full px-4 gap-2 focus-within:bg-white focus-within:border-frog-300 transition-all">
            <Image src="/search_icon.svg" height={18} width={18} alt="search icon" />
            <input
              className="bg-transparent focus:outline-none body-small text-gray-900 placeholder:text-gray-400 w-32 lg:w-48"
              type="text"
              placeholder="검색어를 입력하세요"
            />
          </div>

          {/* 로그인 버튼 */}
          <Link href={"/auth/sign-in"}>
            <button
              type="button"
              className="h-10 bg-frog-600 hover:bg-frog-700 text-white px-5 rounded-full transition-colors label-small whitespace-nowrap"
            >
              로그인
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}