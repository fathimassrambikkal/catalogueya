import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { getCompanyAnalytics } from "../companyApi";
import Cookies from "js-cookie";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

const getImageUrl = (path) => {
  if (!path || path === "null") return "";
  let finalPath = path;
  if (typeof finalPath === 'string' && finalPath.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(finalPath);
      finalPath = parsed.webp || parsed.avif || parsed[Object.keys(parsed)[0]];
    } catch (e) { }
  } else if (typeof finalPath === 'object' && finalPath !== null) {
    finalPath = finalPath.webp || finalPath.avif || finalPath[Object.keys(finalPath)[0]];
  }
  if (!finalPath || typeof finalPath !== 'string' || finalPath === "null") return "";
  if (finalPath.startsWith("http")) return finalPath;
  const lang = Cookies.get("lang") || "en";
  const cleanPath = finalPath.startsWith('/') ? finalPath.substring(1) : finalPath;
  return `${API_BASE_URL}/${lang}/storage/${cleanPath}`;
};

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaEye,
  FaUsers,
  FaShoppingBag,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

// -----------------------------
// Hook: smooth count up with cleanup
// -----------------------------
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplay(0);
      return;
    }
    if (value === display) return;

    let start = null;
    const startValue = display;

    const tick = (time) => {
      if (!start) start = time;
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      // smooth easing (easeInOutCubic-like)
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const current = Math.round(startValue + (value - startValue) * eased);
      setDisplay(current);

      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return display;
}

// -----------------------------
// Small skeleton & card helpers
// -----------------------------
function Skeleton({ className = "", shimmer = false }) {


  return (
    <div
      className={`relative overflow-hidden animate-pulse bg-gray-200/60 rounded-lg ${className}`}
      aria-hidden
    >
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}

const AnalyticsCard = React.memo(function AnalyticsCard({
  children,
  className = "",
  hoverable = true,
  onClick,
  ...props
}) {
  return (
    <motion.div
      className={`bg-white/90 backdrop-blur-xl border border-gray-200/70 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 transition-all duration-300 ${hoverable ? "cursor-pointer" : ""
        } ${className} min-w-0 max-w-full overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        hoverable
          ? {
            y: -4,
            scale: 1.01,
            transition: { type: "spring", stiffness: 400, damping: 30 },
          }
          : {}
      }
      whileTap={hoverable ? { scale: 0.98 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// -----------------------------
// Stats card
// -----------------------------
const StatsCard = React.memo(function StatsCard({
  icon: Icon,
  value,
  label,
  trend,
  className = "",
}) {
  const displayValue = useCountUp(Number(value) || 0, 1200);
  const isPositive = !!trend && trend > 0;

  return (
    <AnalyticsCard hoverable={false} className={`text-center ${className}`}>
      <div className="flex flex-col items-center gap-2 sm:gap-3 min-w-0">
        <motion.div
          className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-50"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="text-lg sm:text-xl text-blue-600" />
        </motion.div>

        <div className="space-y-1">
          <motion.div
            className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900"
            key={displayValue}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {displayValue.toLocaleString()}
          </motion.div>
          <div className="text-[10px] sm:text-xs text-gray-600 leading-tight break-words">
            {label}
          </div>

          {typeof trend !== "undefined" && (
            <motion.div
              className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"
                }`}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isPositive ? (
                <FaArrowUp className="text-[8px]" />
              ) : (
                <FaArrowDown className="text-[8px]" />
              )}
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>
      </div>
    </AnalyticsCard>
  );
});

// -----------------------------
// Main Component
// -----------------------------
export default function AnalyticsAppleFull({ products = [] }) {
  const { user } = useSelector((state) => state.auth);
  const companyId = user?.id;

  const [analytics, setAnalytics] = useState(null);
  const safeProducts = Array.isArray(products) ? products : [];
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("month");
  const containerRef = useRef(null);

  const statsData = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        icon: FaShoppingBag,
        value: analytics.kpis?.total_search_appearances ?? 0,
        label: "Search Appearances",
        trend: 0,
      },
      {
        icon: FaEye,
        value: analytics.kpis?.total_views ?? 0,
        label: "Total Views",
        trend: 0,
      },
      {
        icon: FaUsers,
        value: analytics.kpis?.total_favorites ?? 0,
        label: "Favorites",
        trend: 0,
      },
    ];
  }, [analytics]);


  // loading simulation cleanup
  useEffect(() => {
    if (!companyId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const filterMap = {
          weekly: "week",
          monthly: "month",
          yearly: "year",
          week: "week",
          month: "month",
          year: "year"
        };

        const res = await getCompanyAnalytics({
          company_id: companyId,
          filter: filterMap[range] || range
        });

        const data = res.data?.data || res.data;

        // Normalize product data
        if (data?.top_products?.items) {
          data.top_products.items = data.top_products.items.map(p => ({
            ...p,
            name: Cookies.get("lang") === 'ar' ? (p.name_ar || p.name) : (p.name_en || p.name),
            image: getImageUrl(p.image)
          }));
        }

        setAnalytics(data);
      } catch (err) {
        console.error("❌ Analytics API failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [companyId, range]);








  // top product safely computed
  const topProduct = useMemo(() => {
    return analytics?.top_products?.items?.[0] || {};
  }, [analytics]);


  const areaData = useMemo(() => {
    if (!analytics?.trends?.labels) return [];
    return analytics.trends.labels.map((label, idx) => ({
      name: label,
      views: analytics.trends.series?.[0]?.data?.[idx] || 0,
    }));
  }, [analytics]);


  const viewsAnimated = useCountUp(Number(topProduct.views) || 0, 800);
  const totalViewsCount = useCountUp(
    analytics?.kpis?.total_views || 0,
    900
  );

  const palette = useMemo(
    () => ({
      primary: "#007AFF",
      soft: "#66C7FF",
    }),
    []
  );

  const handleRangeChange = useCallback((newRange) => {
    setRange(newRange);
  }, []);



  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen font-sans text-sm overflow-x-hidden"
    >
      <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto min-w-0">
        {/* Header */}
        <motion.header
          className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-2 min-w-0 w-full overflow-x-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words flex-shrink-0 ml-0 md:ml-0 min-w-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Analytics
          </motion.h1>

          <div className="flex items-center gap-1 min-w-0 flex-1 justify-end overflow-x-hidden">
            <div className="relative flex items-center gap-0.5 rounded-lg border border-gray-300/50 px-0.5 py-0.5 bg-white/90 backdrop-blur-xl shadow-sm flex-shrink-0 min-w-0 max-w-[200px]">
              <motion.div
                className="absolute top-0.5 bottom-0.5 w-[calc(33.333%-4px)] rounded-md bg-blue-500"
                initial={false}
                animate={{
                  left:
                    range === "weekly"
                      ? "1px"
                      : range === "monthly"
                        ? "calc(33.333% + 1px)"
                        : "calc(66.666% + 1px)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
              {["weekly", "monthly", "yearly"].map((r) => (
                <motion.button
                  key={r}
                  onClick={() => handleRangeChange(r)}
                  className={`relative px-1.5 py-1 text-[8px] xs:text-[9px] sm:text-xs rounded-md transition-all duration-300 z-10 break-words min-w-0 ${range === r ? "text-white" : "text-gray-600 hover:text-blue-600"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.header>

        <div className="space-y-3 sm:space-y-4 min-w-0">
          {/* Top row stats */}
          <motion.div
            className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 overflow-x-hidden"
            initial="initial"
            animate="enter"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="col-span-1 min-w-0"
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}

            {/* Top product card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1 min-w-0"
            >
              <AnalyticsCard className="h-full">
                <div className="flex items-start justify-between mb-2 min-w-0">
                  <div className="flex-1 min-w-0 overflow-x-hidden">
                    <div className="text-[10px] text-gray-600 truncate break-words">Top product</div>
                    <div className="text-sm font-semibold text-gray-900 truncate break-words min-w-0">
                      {topProduct.name || "—"}
                    </div>
                  </div>
                  <motion.div
                    className="text-[10px] text-gray-500 flex items-center gap-0.5 flex-shrink-0 ml-1 min-w-0"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    live
                  </motion.div>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <img
                      src={topProduct.image || topProduct.img || "/placeholder.png"}
                      alt={topProduct.name || "product"}
                      className="w-8 h-8 rounded-lg object-cover border border-gray-200/60"
                      loading="lazy"
                    />
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  <div className="flex-1 min-w-0 overflow-x-hidden">
                    <div className="text-[10px] text-gray-600 break-words">Views</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={viewsAnimated}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="text-base font-semibold text-gray-900 truncate break-words min-w-0"
                      >
                        {viewsAnimated.toLocaleString()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </AnalyticsCard>
            </motion.div>
          </motion.div>

          {/* Area chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <AnalyticsCard>
              <div className="flex items-center justify-between mb-3 min-w-0">
                <div className="min-w-0 overflow-x-hidden">
                  <div className="text-xs text-gray-600 break-words">Views Trend</div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900 break-words">Recent Views</div>
                </div>
                <motion.div
                  className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0 min-w-0"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Live
                </motion.div>
              </div>

              <div className="h-40 sm:h-56 lg:h-64 min-w-0">
                {loading ? (
                  <Skeleton className="w-full h-full rounded-lg" shimmer />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
                      <defs>
                        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor={palette.primary} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={palette.primary} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>

                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#374151", fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#374151", fontSize: 10 }} />
                      <Tooltip animationDuration={200} />
                      <Area type="monotone" dataKey="views" stroke={palette.primary} fill="url(#g1)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 1, stroke: "#fff" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </AnalyticsCard>
          </motion.div>

          {/* Product grid */}
          <motion.div className="mt-4 sm:mt-6 overflow-x-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words min-w-0">Products Performance</h2>
              <motion.div className="text-xs text-gray-600 flex items-center gap-1 flex-shrink-0 min-w-0" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Updated live
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-x-hidden">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <AnalyticsCard key={i} hoverable={false}>
                    <Skeleton className="w-full h-32 sm:h-36 rounded-lg" shimmer />
                    <div className="mt-2 sm:mt-3 flex items-center justify-between min-w-0">
                      <Skeleton className="h-3 sm:h-4 w-2/3" />
                      <Skeleton className="h-3 sm:h-4 w-1/6" />
                    </div>
                    <div className="mt-2 sm:mt-3 h-10 sm:h-12 min-w-0">
                      <Skeleton className="w-full h-full rounded" shimmer />
                    </div>
                  </AnalyticsCard>
                ))
              ) : (
                (analytics?.top_products?.items || []).slice(0, 6).map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    whileHover={{ y: -2 }}
                    className="min-w-0"
                  >
                    <AnalyticsCard>
                      <motion.img
                        src={p.image || p.img || "/placeholder.png"}
                        alt={p.name || "product"}
                        className="w-full h-32 sm:h-36 object-cover rounded-lg border border-gray-200/60 min-w-0"
                        loading="lazy"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      />

                      <div className="mt-2 sm:mt-3 flex items-center justify-between min-w-0">
                        <div className="flex-1 min-w-0 overflow-x-hidden">
                          <div className="font-semibold text-gray-900 truncate text-sm sm:text-base break-words">{p.name}</div>
                          <div className="text-xs text-gray-600 break-words">{(p.reviews || 0)} reviews • {(p.rating || 0)}★</div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-2 min-w-0">
                          <div className="font-medium text-gray-900 text-sm sm:text-base break-words">{(Number(p.views_count || p.views) || 0).toLocaleString()}</div>
                          <div className="text-xs text-gray-600 break-words">views</div>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-3 h-10 sm:h-12 min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={Array.isArray(p.spark) ? p.spark.map((v, i) => ({ x: i, v })) : []}>
                            <Area type="monotone" dataKey="v" stroke={palette.primary} fill={palette.soft} strokeWidth={1.5} animationDuration={300} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </AnalyticsCard>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
