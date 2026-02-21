import React, { useState, lazy, Suspense, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import { getCompanyProducts, getImageUrl } from "../companyDashboardApi";

/* ===== Lazy-loaded Analytics Cards (PERF ONLY) ===== */
const AnalyticsRevenue = lazy(() => import("./AnalyticsRevenue"));
const AnalyticsSummary = lazy(() => import("./AnalyticsSummary"));
const AnalyticsReviews = lazy(() => import("./AnalyticsReviews"));
const AnalyticsStatus = lazy(() => import("./AnalyticsStatus"));

/* ===== Non-lazy (instant UI) ===== */
import AnalyticsCalendar from "./AnalyticsCalendar";

function MoreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /* ===== SINGLE SOURCE OF TRUTH ===== */
  const [range, setRange] = useState("Last 7 days");
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    if (!product && id) {
      fetchProduct();
    }
  }, [id, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getCompanyProducts();
      let foundProduct = null;
      if (res.data?.data) {
        const list = Array.isArray(res.data.data) ? res.data.data : (res.data.data.products || []);
        foundProduct = list.find(p => String(p.id) === String(id));
      } else if (Array.isArray(res.data)) {
        foundProduct = res.data.find(p => String(p.id) === String(id));
      }

      if (foundProduct) {
        setProduct(foundProduct);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/company-dashboard", {
      state: { restoreTab: location.state?.fromTab || "Analytics" },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-gray-500">
        <p>Product not found</p>
        <button onClick={handleBack} className="mt-4 text-blue-600 font-medium hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  // Derived Data for Analytics Cards
  const productPrice = parseFloat(product.price || 0);
  const salesCount = parseInt(product.sold || 0, 10);
  const revenue = productPrice * salesCount;

  // Construct status data object for AnalyticsStatus component
  // Since AnalyticsStatus expects a specific structure, we map this product's stats to it
  const statusData = {
    low_in_stock: product.quantity < 10 && product.quantity > 0 ? 1 : 0,
    out_of_stock: product.quantity === 0 || product.quantity === '0' ? 1 : 0,
    sales: salesCount, // Show actual sales count
    new_arrivals: 0, // Not applicable for single view usually, or check date
    limited_edition: 0
  };

  const productImage = getImageUrl(product.image);

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
        <div className="mb-6 flex flex-row gap-4 sm:items-center">
          {/* Product Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0">
              {productImage ? (
                <img
                  src={productImage}
                  alt={product.name_en || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-xs text-gray-400">No Img</div>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {product.name_en || product.name || "Product Name"}
              </h1>
              <div className="mt-1 text-sm text-gray-500">
                Category: {product.category_name || "General"}
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
                <AnalyticsRevenue value={revenue} currency="QAR" trend="up" />
              </EnterpriseCard>
            </div>

            {/* Status */}
            <div className="lg:col-span-8 h-full">
              <EnterpriseCard className="h-full">
                <AnalyticsStatus range={range} data={statusData} />
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

/* =====  Card Wrapper ===== */
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
