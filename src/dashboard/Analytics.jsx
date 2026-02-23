import React, { useState, useEffect, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { getAnalytics } from "../companyDashboardApi";

/* ===== Import Revenue and Summary directly (not lazy) ===== */
import AnalyticsRevenue from "./AnalyticsRevenue";
import AnalyticsSummary from "./AnalyticsSummary";
import AnalyticsCalendar from "./AnalyticsCalendar"; 

/* ===== Lazy-loaded sections ===== */
const AnalyticsImgCards = lazy(() => import("./AnalyticsImgCards"));
const AnalyticsAllProductCard = lazy(() => import("./AnalyticsAllProductCard"));
const AnalyticsProductDetail = lazy(() => import("./AnalyticsProductDetail"));

const Analytics = ({ companyId, companyInfo }) => {
  const companyName = companyInfo?.companyName || "Company Dashboard";

  const [range, setRange] = useState("Last 7 days");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchAnalytics();
    }
  }, [range, companyId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Correct mapping based on user request
      let days = 7;
      if (range === "Last 7 days") days = 7;
      if (range === "Last month") days = 30;
      if (range === "Last 3 months") days = 90;
      if (range === "Last year") days = 365;
      if (typeof range === 'number') days = range;

      // Call API with the required body
      const res = await getAnalytics({
        days: days,
        sort_by: "view",
        order: "desc",
        per_page: 10
      });

      const fetchedData = res.data || {};
      setData(fetchedData);

      // If we have a selected product, update it with fresh stats from the new list
      if (selectedProduct) {
        const items = fetchedData?.products_analytics?.items || [];
        const updated = items.find(p => String(p.id) === String(selectedProduct.id));
        if (updated) {
          setSelectedProduct(updated);
        }
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedProduct) {
    return (
      <Suspense fallback={<AnalyticsPageSkeleton />}>
        <AnalyticsProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          range={range}
          setRange={setRange}
          summaryData={data?.company_analytics || {}}
        />
      </Suspense>
    );
  }
return (
  <div
    className={`${
      selectedProduct ? "h-full overflow-hidden" : "min-h-full"
    } relative flex flex-col px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-8 sm:pb-10`}
  >
    {/* Premium Glass Blur Overlay  */}
    <div className="absolute inset-0 backdrop-blur-[120px] bg-gradient-to-br from-white/40 via-white/30 to-blue-50/20 pointer-events-none" />
    
    {/* Subtle grid pattern overlay  */}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSJyZ2JhKDU5LDEzMCwyNDYsMC4wMykiLz48L2c+PC9zdmc+')] opacity-40 pointer-events-none" />

    <div className="relative z-10">

      {/* ================= HEADER ================= */}
    <div className="relative z-10 max-w-[1600px] mx-auto w-full">

  {/* Header Section */}
  <div className="mb-10 sm:mb-12 md:mb-14 lg:mb-16">

    {/* Top subtle badge */}
    <div className="flex items-center gap-2 mb-4 sm:mb-5 mt-20 md:mt-4">
      <div className="h-0.5 w-6 sm:w-8 bg-blue-600/30 rounded-full" />
      <span className="text-[10px] sm:text-xs font-medium text-blue-600/70 uppercase tracking-[0.2em]">
        Dashboard Overview
      </span>
      <div className="h-0.5 w-6 sm:w-8 bg-blue-600/30 rounded-full" />
    </div>

    {/* Main header row */}
    <div className="flex flex-col gap-3 ">

      {/* Row 1 → Analytics + Calendar (same line mobile + desktop) */}
      <div className="flex items-center justify-between">

        <h1 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight ">
          Analytics
        </h1>

        <div className="relative">
          <AnalyticsCalendar range={range} setRange={setRange} />
          <div className="absolute -inset-1 bg-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

      </div>

      {/* Row 2 → Company name BELOW (only mobile visually different) */}
      <div className="flex items-center gap-2">

        <div className="group relative">
          <div className="px-3 sm:px-4 py-1.5 sm:py-1 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {companyName}
            </span>
          </div>

          <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        </div>

      </div>

      {/* Description */}
      <div className="relative max-w-2xl">
        <p className="text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed">
          Track your business performance with real-time insights and detailed analytics
        </p>
        <div className="absolute -bottom-2 left-0 w-16 sm:w-24 h-0.5 bg-gradient-to-r from-blue-600/40 via-indigo-600/40 to-transparent rounded-full" />
      </div>

    </div>

    {/* Decorative lines */}
    <div className="relative mt-6 sm:mt-8">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute left-1/4 right-1/4 top-px h-px bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />
    </div>

  </div>
</div>

      {/* ================= KPI SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 md:mb-16 items-stretch">

        {/* Revenue Card */}
        <div className="transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <AnalyticsRevenue
            value={data?.company_analytics?.revenue?.value || 0}
            currency={data?.company_analytics?.revenue?.currency || "QR"}
            trend={data?.company_analytics?.revenue?.trend || "up"}
            range={range}
          />
        </div>

        {/* Summary Card */}
        <div className="transform transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1">
          <AnalyticsSummary
            range={range}
            data={data?.company_analytics || {}}
          />
        </div>

      </div>

      {/* ================= TOP ANALYTICS + TABLE ================= */}
      <Suspense fallback={<AnalyticsPageSkeleton />}>

        {/* Top Products Section */}
        <div className="relative mb-8 sm:mb-10 md:mb-12">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-6">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 tracking-tight">
              Top Performing Products
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
              {range}
            </span>
          </div>
          
          <AnalyticsImgCards
            range={range}
            setRange={setRange}
            companyName={companyName}
            data={data?.company_analytics?.your_top_products || {}}
            summaryData={data?.company_analytics || {}}
            companyAnalytics={data?.company_analytics || {}}
          />
        </div>

        {/* ================= ALL PRODUCTS TABLE ================= */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-6 sm:mt-8">
          
          {/* Section header */}
          <div className="flex items-center gap-3">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 tracking-tight">
              All Products Overview
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            <button className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
              View all →
            </button>
          </div>

          <AnalyticsAllProductCard
            range={range}
            data={data?.products_analytics?.items || []}
            onProductClick={setSelectedProduct}
          />
        </div>

      </Suspense>

      {/*  subtle footer accent */}
      <div className="relative mt-8 sm:mt-10 md:mt-12">
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute left-1/3 right-1/3 bottom-px h-px bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />
      </div>

    </div>
  </div>
);


};

export default Analytics;

function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-32 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-32 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
      <div className="h-40 rounded-3xl bg-gray-200 animate-pulse" />
      <div className="h-64 rounded-3xl bg-gray-200 animate-pulse" />
      <div className="h-72 rounded-3xl bg-gray-200 animate-pulse" />
    </div>
  );
}