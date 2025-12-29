import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function TestPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    redirect("/");
  }
  return (
    <div>
      <Button>테스트 버튼</Button>
    </div>
  );
}
