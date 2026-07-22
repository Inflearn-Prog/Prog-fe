import "./styles/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import Script from "next/script";

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
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MD22QF5W');`,
          }}
        />
      </head>
      <body className={`${pretendard.className} antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MD22QF5W"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
