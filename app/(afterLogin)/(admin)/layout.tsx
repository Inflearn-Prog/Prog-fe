import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // LATER admin auth guard 필요
  return <>{children}</>;
}
