"use client";

import { ChevronRightIcon, MenuIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ROUTES } from "@/lib/routes";

import { BaseButton } from "../shared/button";
import { HeaderSearch } from "./header-search";
import { LoginAndLogoutButton } from "./login-logout-button";

export function HeaderRightSection() {
  return (
    <div>
      <div className="lg:flex items-center gap-x-5 hidden">
        <Suspense
          fallback={
            <div className="w-64 h-10 bg-gray-50 rounded-full animate-pulse" />
          }
        >
          <HeaderSearch />
        </Suspense>
        <LoginAndLogoutButton />
      </div>
      <div className="flex lg:hidden items-center gap-x-5">
        <Suspense
          fallback={
            <div className="size-9 bg-gray-50 rounded-full animate-pulse" />
          }
        >
          <HeaderSearchMobile />
        </Suspense>
        <HeaderMoreButton />
      </div>
    </div>
  );
}

function HeaderSearchMobile() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (isSearchOpen) {
    return <HeaderSearch />;
  }
  return (
    <button onClick={() => setIsSearchOpen(true)}>
      <SearchIcon width={36} height={36} className="size-9" />
    </button>
  );
}

const isLogin = true;

function HeaderMoreButton() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button className="size-9">
          <MenuIcon className="size-9" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="min-w-74! w-full">
        <DrawerHeader className="flex items-center justify-between flex-row h-15 px-5 border-b">
          <DrawerTitle className="heading-small">전체 메뉴</DrawerTitle>
          <DrawerClose asChild>
            <button>
              <XIcon width={24} height={24} className="size-6" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-5 py-5 space-y-5">
          {/* LATER 로그인 유무에 따른 UI변경 */}
          {isLogin ? (
            <BaseButton className="w-full rounded-[6px] text-white">
              로그인
            </BaseButton>
          ) : (
            <BaseButton className="rounded-[6px] text-gray-700">
              로그아웃
            </BaseButton>
          )}

          <>
            <LinkItem href={ROUTES.rank.ROOT} label="랭킹" />
            <LinkItem href={ROUTES.community.ROOT} label="커뮤니티" />
            <LinkItem href={ROUTES.question.ROOT} label="자주 묻는 질문" />
            {/* // LATER 로그인 유무에 따른 히든 여부 */}
            {isLogin && (
              <LinkItem href={ROUTES.mypage.ROOT} label="마이페이지" />
            )}
          </>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function LinkItem({ href, label }: { href: string; label: string }) {
  return (
    <Link className="h-12 flex items-center justify-between" href={href}>
      <span className="label-medium">{label}</span>
      <ChevronRightIcon
        className="size-5"
        color="#111111"
        width={7}
        height={5}
      />
    </Link>
  );
}
