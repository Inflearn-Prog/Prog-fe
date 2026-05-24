"use client";

import { ChevronRightIcon, MenuIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useLogout } from "@/hooks/use-logout";
import { ROUTES } from "@/lib/routes";

import { BaseButton } from "../shared/button";
import { HeaderSearch } from "./header-search";
import { LoginAndLogoutButton } from "./login-logout-button";

export function HeaderRightSection() {
  const { data: session } = useSession();

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
        <LoginAndLogoutButton user={session?.user} />
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
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center px-4 h-16 shadow-md">
        <div className="w-full">
          <HeaderSearch onClose={() => setIsSearchOpen(false)} />
        </div>
      </div>
    );
  }
  return (
    <button onClick={() => setIsSearchOpen(true)}>
      <SearchIcon width={36} height={36} className="size-9" />
    </button>
  );
}

function HeaderMoreButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: logout } = useLogout();
  const isLogin = !!session?.user && !!session?.accessToken;

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
          {/* 로그인 유무에 따른 UI변경 */}
          {!isLogin ? (
            <DrawerClose asChild>
              <BaseButton
                className="w-full text-white bg-frog-600 hover:bg-frog-700"
                shape="round"
                onClick={() => router.push(ROUTES.auth.SIGNIN)}
              >
                로그인
              </BaseButton>
            </DrawerClose>
          ) : (
            <BaseButton
              className="w-full text-gray-700 border-gray-200 hover:bg-gray-50"
              variant="outline"
              shape="round"
              onClick={() => logout()}
            >
              로그아웃
            </BaseButton>
          )}

          <div className="flex flex-col">
            <LinkItem href={ROUTES.rank.ROOT} label="랭킹" />
            <LinkItem href={ROUTES.community.ROOT} label="커뮤니티" />
            <LinkItem href={ROUTES.question.ROOT} label="자주 묻는 질문" />
            {isLogin && (
              <LinkItem href={ROUTES.mypage.ROOT} label="마이페이지" />
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function LinkItem({ href, label }: { href: string; label: string }) {
  return (
    <DrawerClose asChild>
      <Link className="h-12 flex items-center justify-between" href={href}>
        <span className="label-medium">{label}</span>
        <ChevronRightIcon
          className="size-5"
          color="#111111"
          width={7}
          height={5}
        />
      </Link>
    </DrawerClose>
  );
}
