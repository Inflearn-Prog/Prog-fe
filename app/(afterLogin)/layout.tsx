export default function AfterLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //  auth guard 필요
  return <>{children}</>;
}
