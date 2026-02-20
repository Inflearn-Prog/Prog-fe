import { Header } from "@/components/header/header";

import BoardNavigate from "./board-navigate";

export default function AfterLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-gray-50">
      <Header />
      <div>
        <div className="w-full bg-white h-15 flex items-center mb-12.5">
          <BoardNavigate />
        </div>
        {children}
      </div>
    </div>
  );
}
