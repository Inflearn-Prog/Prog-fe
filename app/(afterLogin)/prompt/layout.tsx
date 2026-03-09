import { Header } from "@/components/header/header";

export default function AfterLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-gray-50">
      <Header />
      {children}
    </div>
  );
}
