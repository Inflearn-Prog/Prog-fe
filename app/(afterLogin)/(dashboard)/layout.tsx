import { Header } from "@/components/header/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div>{children}</div>
    </div>
  );
}
