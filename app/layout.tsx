import "./styles/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";

import { AuthWatcher } from "@/components/auth/auth-watcher";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/site";

import AuthProvider from "./providers/auth-provider";
import QueryProvider from "./providers/queryProvider";

const pretendard = localFont({
  src: "../public/fonts/pretendard/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PROG - 현직자 프롬프트 공유 커뮤니티",
  description:
    "현직자들이 실제 사용한 프롬프트를 공유하는 커뮤니티. 자소서 작성부터 합격까지, PROG와 함께 도약하세요.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="ko"
      className={`${pretendard.variable}`}
      nonce={nonce}
      suppressHydrationWarning
    >
      <body className={`${pretendard.className} antialiased`}>
        <AuthProvider>
          <AuthWatcher />
          <QueryProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </QueryProvider>
        </AuthProvider>
        <Toaster className="w-full h-20 flex flex-col justify-center relative" />
      </body>
    </html>
  );
}
