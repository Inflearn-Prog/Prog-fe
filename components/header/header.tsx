"use client";

import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";
import { STATIC_IMAGES } from "@/lib/static-image";

import { HEADER_NAV_LIST } from "./constant";
import { HeaderRightSection } from "./header-right-section";

// LATER: 추후 리펙토링 필요
export function Header() {
  return (
    <header
      className="h-15 flex items-center border-b bg-white w-full border-b-gray-100"
      role="banner"
    >
      <div className="max-w-440 mx-auto py-1.5 w-full xl:px-40 md:px-10 px-5 flex justify-between items-center">
        <HeaderLeftSection />
        <HeaderRightSection />
      </div>
    </header>
  );
}

export function HeaderLogo() {
  const { logo } = STATIC_IMAGES;
  return (
    <Link className="min-w-11" href="/" aria-label="홈으로 이동">
      <Image {...logo} priority alt="사이트 로고" />
    </Link>
  );
}

export function HeaderNavigation() {
  return (
    <nav aria-label="메인 네비게이션">
      <ul className="flex items-center gap-x-15" role="list">
        {HEADER_NAV_LIST.map((nav) => {
          // LATER: 실제 로그인 상태에 따른 조건 처리 필요
          const isLogin = true;
          const isMypage = nav.href === ROUTES.mypage.ROOT;
          if (isLogin && isMypage) {
            return null;
          }
          return (
            <li
              key={nav.href}
              className="text-gray-900 navigation-large hover:text-frog-600"
            >
              <Link href={nav.href}>{nav.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function HeaderLeftSection() {
  return (
    <div className="flex items-center gap-x-15">
      <HeaderLogo />
      <div className="hidden md:block">
        <HeaderNavigation />
      </div>
    </div>
  );
}
