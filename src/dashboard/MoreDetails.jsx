import React, { useState, lazy, Suspense } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";

/* ===== Lazy-loaded Analytics Cards (PERF ONLY) ===== */
const AnalyticsRevenue = lazy(() => import("./AnalyticsRevenue"));
const AnalyticsSummary = lazy(() => import("./AnalyticsSummary"));
const AnalyticsReviews = lazy(() => import("./AnalyticsReviews"));
const AnalyticsStatus = lazy(() => import("./AnalyticsStatus"));

/* ===== Non-lazy (instant UI) ===== */
import AnalyticsCalendar from "./AnalyticsCalendar";

/* ===== Demo Product Data ===== */
const products = [
  {
    id: 1,
    name: "Golden Barrel Cactus",
    sku: "PLT-001",
    category: "Plants",
    image: "https://via.placeholder.com/96",
  },
  {
    id: 2,
    name: "Cycas in Kolambi Pot",
    sku: "PLT-002",
    category: "Plants",
    image: "https://via.placeholder.com/96",
  },
  {
    id: 3,
    name: "Epidendrum Orchid",
    sku: "PLT-003",
    category: "Orchid",
    image: "https://via.placeholder.com/96",
  },
  {
    id: 4,
    name: "Hibiscus Pink",
    sku: "PLT-004",
    category: "Flowering",
    image: "https://via.placeholder.com/96",
  },
];

function MoreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /* ===== SINGLE SOURCE OF TRUTH ===== */
  const [range, setRange] = useState("Last 7 days");

  const product = products.find((p) => p.id === Number(id));
  if (!product) return <div className="p-6">Product not found</div>;

  const handleBack = () => {
    navigate("/company-dashboard", {
      state: { restoreTab: location.state?.fromTab || "Analytics" },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
        {/* ===== Floating Back Button ===== */}
        <BackButton
          variant="absolute"
          className="top-16"
          onClick={handleBack}
        />

        {/* ===== Top Header ===== */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
          {/* Product Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>
              <div className="mt-1 text-sm text-gray-500">
                Category: {product.category}
              </div>
            </div>
          </div>

          {/* ===== Calendar (Parent Controlled) ===== */}
          <div className="sm:ml-auto">
            <AnalyticsCalendar range={range} setRange={setRange} />
          </div>
        </div>

        {/* ===== LAZY CONTENT (NO UI CHANGE) ===== */}
        <Suspense fallback={<AnalyticsSkeleton />}>
          {/* ===== Revenue + Status (1/3 : 2/3) ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
            {/* Revenue */}
            <div className="lg:col-span-4 h-full">
              <EnterpriseCard className="h-full">
                <AnalyticsRevenue range={range} />
              </EnterpriseCard>
            </div>

            {/* Status */}
            <div className="lg:col-span-8 h-full">
              <EnterpriseCard className="h-full">
                <AnalyticsStatus range={range} />
              </EnterpriseCard>
            </div>
          </div>

          {/* ===== Summary ===== */}
          <div className="mt-6">
            <EnterpriseCard>
              <AnalyticsSummary range={range} />
            </EnterpriseCard>
          </div>

          {/* ===== Reviews ===== */}
          <div className="mt-6">
            <EnterpriseCard>
              <AnalyticsReviews />
            </EnterpriseCard>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

/* ===== Invisible Skeleton (Layout-safe) ===== */
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 h-40 rounded-3xl bg-gray-100 animate-pulse" />
        <div className="lg:col-span-8 h-40 rounded-3xl bg-gray-100 animate-pulse" />
      </div>

      <div className="h-32 rounded-3xl bg-gray-100 animate-pulse" />
      <div className="h-48 rounded-3xl bg-gray-100 animate-pulse" />
    </div>
  );
}

/* ===== Apple-Level Card Wrapper ===== */
function EnterpriseCard({ children, className = "" }) {
  return (
    <div
      className={`
        relative
        bg-white/85
        backdrop-blur-xl
        rounded-3xl
        border border-gray-200/70
        shadow-[0_1px_1px_rgba(0,0,0,0.04)]
        p-2
        transition
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)]
        ${className}
      `}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      {children}
    </div>
  );
}

export default MoreDetails;
