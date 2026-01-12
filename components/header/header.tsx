import Image from "next/image";
import Link from "next/link";

import { STATIC_IMAGES } from "@/lib/static-image";

import { HEADER_NAV_LIST } from "./constant";
import { HeaderSearch } from "./header-search";
import { LoginAndLogoutButton } from "./login-logout-button";

// LATER 추후 반응형 작업
export default function Header() {
  const { logo } = STATIC_IMAGES;
  return (
    <header className="h-15 flex items-center bg-white w-full">
      <div className="max-w-440 mx-auto py-1.5 w-full xl:px-40 md:px-10 px-5 flex justify-between items-center">
        <div className="flex items-center gap-x-15">
          <Image {...logo} />
          <nav>
            <ul className="flex items-center gap-x-15">
              {HEADER_NAV_LIST.map((nav) => (
                <li key={nav.href} className="text-gray-900 navigation-large">
                  <Link href={nav.href}>{nav.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-x-5">
          <HeaderSearch />
          <LoginAndLogoutButton />
        </div>
      </div>
    </header>
  );
}
