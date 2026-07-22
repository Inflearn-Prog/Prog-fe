import { Suspense } from "react";

import { AdminContent } from "./admin-content";

export default function AdminPage() {
  return (
    <Suspense>
      <AdminContent />
    </Suspense>
  );
}
