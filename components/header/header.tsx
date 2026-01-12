// 작성날짜: 2026-01-12
// 파일명: header.tsx
// Next.js 공식문서: https://nextjs.org/docs

import Image from "next/image";
import Link from "next/link";

import { STATIC_IMAGES } from "@/lib/static-image";

import { HEADER_NAV_LIST } from "./constant";
import { HeaderSearch } from "./header-search";
import { LoginAndLogoutButton } from "./login-logout-button";

// LATER: 추후 리펙토링 필요
export function Header() {
  return (
    <header className="h-15 flex items-center bg-white w-full" role="banner">
      <div className="max-w-440 mx-auto py-1.5 w-full xl:px-40 md:px-10 px-5 flex justify-between items-center">
        <HeaderLeftSection />
        <HeaderRightSection />
      </div>
    </header>
  );
}

function HeaderLogo() {
  const { logo } = STATIC_IMAGES;
  return (
    <Link href="/" aria-label="홈으로 이동">
      <Image {...logo} priority alt="사이트 로고" />
    </Link>
  );
}

function HeaderNavigation() {
  return (
    <nav aria-label="메인 네비게이션">
      <ul className="flex items-center gap-x-15" role="list">
        {HEADER_NAV_LIST.map((nav) => (
          <li key={nav.href} className="text-gray-900 navigation-large">
            <Link href={nav.href}>{nav.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HeaderLeftSection() {
  return (
    <div className="flex items-center gap-x-15">
      <HeaderLogo />
      <HeaderNavigation />
    </div>
  );
}

function HeaderRightSection() {
  return (
    <div className="flex items-center gap-x-5">
      <HeaderSearch />
      <LoginAndLogoutButton />
    </div>
  );
}
