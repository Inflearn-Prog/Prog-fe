import { Header } from "@/components/header/header";
import { cn } from "@/lib/utils";

export default function AfterLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layout = cn("mx-auto max-w-7xl lg:px-0 px-5 min-w-90 mx-auto");

  return (
    <div className="w-full bg-gray-50">
      <Header />
      <div className={layout}>{children}</div>
    </div>
  );
}
