import React, { useMemo, lazy, Suspense, useState, useEffect } from "react";
import { getImageUrl } from "../companyDashboardApi";
import { BackIcon } from "./CompanySvg";
import { getProductReviews } from "../api";

/* ===== Lazy-loaded Analytics Cards ===== */
const AnalyticsRevenue = lazy(() => import("./AnalyticsRevenue"));
const AnalyticsSummary = lazy(() => import("./AnalyticsSummary"));
const AnalyticsReviews = lazy(() => import("./AnalyticsReviews"));

import AnalyticsCalendar from "./AnalyticsCalendar";

export default function AnalyticsProductDetail({ product, onBack, range, setRange, summaryData }) {
    const [reviewData, setReviewData] = useState(null);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // Derived Data from product stats
    const productPrice = parseFloat(product.price || 0);
    const salesCount = parseInt(product.sold || 0, 10);
    const revenue = productPrice * salesCount;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoadingReviews(true);
                const res = await getProductReviews(product.id);
                if (res.data) {
                    setReviewData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setLoadingReviews(false);
            }
        };

        if (product?.id) {
            fetchReviews();
        }
    }, [product?.id]);

    const productImage = getImageUrl(product.image);

return (
  <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 relative p-4 sm:p-6 md:p-8">

    {/* ================= SMALL TOP COVER ================= */}
    <div className="relative w-full h-28 sm:h-36 md:h-40  overflow-hidden shadow-md">

      {productImage ? (
        <img
          src={productImage}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-center px-6 sm:px-10">
        <button
          onClick={onBack}
          className="p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all border border-white/20 active:scale-95"
        >
          <BackIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h1 className="ml-4 text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
          {product.name}
        </h1>
      </div>
    </div>


    {/* ================= DETAIL ANALYSIS HEADER ================= */}
    <div className="flex flex-row sm:items-center justify-between gap-4">

      {/* Left Title */}
      <div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          Detail Analysis
        </h2>
       
      </div>

      {/* Right Calendar */}
      <div>
        <AnalyticsCalendar range={range} setRange={setRange} />
      </div>

    </div>


    {/* ================= REVENUE + SUMMARY ================= */}
    <div
      className="
        grid 
        grid-cols-1 
        lg:grid-cols-[1fr_1.5fr] 
        gap-4 sm:gap-5 md:gap-6
        items-stretch
      "
    >

      {/* Revenue */}
      <EnterpriseCard className="p-5 sm:p-6">
        <AnalyticsRevenue
          value={revenue}
          currency="QAR"
          trend="up"
        />
      </EnterpriseCard>

      {/* Summary */}
      <EnterpriseCard className="p-5 sm:p-6">
        <AnalyticsSummary
          range={range}
          data={summaryData}
           hideFollowers
        />
      </EnterpriseCard>

    </div>


    {/* ================= REVIEWS SECTION ================= */}
    <div className="flex-1 min-h-0">

      <EnterpriseCard className="h-full p-5 sm:p-6 overflow-hidden">

        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Customer Reviews
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Recent feedback for this product
          </p>
        </div>

        <div className="h-full overflow-y-auto pr-2 scrollbar-hide">
          <AnalyticsReviews
            data={reviewData}
            loading={loadingReviews}
            range={range}
          />
        </div>

      </EnterpriseCard>

    </div>

  </div>
);


}

function DetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full p-4">
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="h-[25%] rounded-[40px] bg-gray-100 animate-pulse" />
                <div className="flex-1 rounded-[40px] bg-gray-100 animate-pulse" />
            </div>
            <div className="lg:col-span-4 rounded-[40px] bg-gray-100 animate-pulse" />
        </div>
    );
}

function EnterpriseCard({ children, className = "" }) {
    return (
        <div className={`bg-white/95 backdrop-blur-xl rounded-[40px] border border-gray-100 shadow-sm ${className}`}>
            {children}
        </div>
    );
}
