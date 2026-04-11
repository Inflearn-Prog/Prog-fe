"use client";

import { PendingReportsTable } from "./pending-reports-table";
import { StatsCards } from "./stats-cards";

export function DashboardTab() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold">주요 지표</h2>
        <StatsCards />
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold">미처리 신고</h2>
        <PendingReportsTable />
      </section>
    </div>
  );
}
