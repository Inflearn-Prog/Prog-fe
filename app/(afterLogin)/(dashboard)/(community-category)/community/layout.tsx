import React, { Suspense } from "react";

import { CommunityPageTitle } from "../_components/community-page-title";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5.5">
      <Suspense>
        <CommunityPageTitle />
      </Suspense>
      {children}
    </div>
  );
}
