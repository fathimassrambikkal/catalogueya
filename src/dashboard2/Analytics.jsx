import React, { useState, lazy, Suspense } from "react";

/* ===== Lazy-loaded heavy sections ===== */
const AnalyticsTopPortion = lazy(() => import("./AnalyticsTopPortion"));
const AnalyticsSummary = lazy(() => import("./AnalyticsSummary"));
const AnalyticsStatus = lazy(() => import("./AnalyticsStatus"));
const AnalyticsAllProductCard = lazy(() =>
  import("./AnalyticsAllProductCard")
);

const Analytics = () => {

  const [range, setRange] = useState("Last 7 days");

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Suspense fallback={<AnalyticsPageSkeleton />}>
        {/* ================= TOP ================= */}
        <div className="space-y-6">
          <AnalyticsTopPortion range={range} setRange={setRange} />
        </div>

        {/* ================= MIDDLE ================= */}
        <div>
          <AnalyticsSummary range={range} />
        </div>

        {/* ================= BOTTOM ================= */}
        <AnalyticsStatus range={range} />
        <AnalyticsAllProductCard range={range} />
      </Suspense>
    </div>
  );
};

export default Analytics;

/* ===== Page Skeleton (Layout-safe, no UI change) ===== */
function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-40 rounded-3xl bg-gray-200 animate-pulse" />
      <div className="h-32 rounded-3xl bg-gray-200 animate-pulse" />
      <div className="h-64 rounded-3xl bg-gray-200 animate-pulse" />
      <div className="h-72 rounded-3xl bg-gray-200 animate-pulse" />
    </div>
  );
}
