import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  FaEye,
  FaUsers,
  FaShoppingBag,
  FaThumbsUp,
  FaThumbsDown,
  FaMoon,
  FaSun,
} from "react-icons/fa";

/* -------------------------
   Count-up hook
---------------------------*/
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    let start = null;
    const from = Number(display);
    const to = Number(value);
    const raf = { id: 0 };

    function step(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(from + (to - from) * eased);
      setDisplay(cur);
      if (t < 1) raf.id = requestAnimationFrame(step);
    }

    raf.id = requestAnimationFrame(step);
    const p = setTimeout(() => setPulseKey((k) => k + 1), duration + 40);

    return () => {
      cancelAnimationFrame(raf.id);
      clearTimeout(p);
    };
  }, [value]);

  return [display, pulseKey];
}

/* -------------------------
   Skeleton
---------------------------*/
function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200/60 dark:bg-gray-700/40 rounded ${className}`} />
  );
}

/* -------------------------
   Main Component
---------------------------*/
export default function AnalyticsAppleFull({ products = [] }) {
  // SAFE: default to empty array
  const safeProducts = Array.isArray(products) ? products : [];

  const [theme, setTheme] = useState("light");
  const [compact, setCompact] = useState(true);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("weekly");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const baseData = useMemo(
    () => ({
      weekly: Array.from({ length: 7 }, (_, i) => ({
        label: `D${i + 1}`,
        v: Math.floor(Math.random() * 500 + 200),
      })),
      monthly: Array.from({ length: 30 }, (_, i) => ({
        label: `D${i + 1}`,
        v: Math.floor(Math.random() * 500 + 200),
      })),
      yearly: Array.from({ length: 12 }, (_, i) => ({
        label: `M${i + 1}`,
        v: Math.floor(Math.random() * 6000 + 4000),
      })),
    }),
    []
  );

  const [trend, setTrend] = useState(baseData[range]?.slice() || []);

  useEffect(() => {
    if (!baseData[range]) return;
    setTrend(baseData[range].map((d) => ({ ...d })));
  }, [range, baseData]);

  useEffect(() => {
    const id = setInterval(() => {
      setTrend((t) =>
        t.map((d) => ({
          ...d,
          v: Math.max(
            0,
            Math.round(
              d.v +
                (Math.random() - 0.45) *
                  (range === "weekly" ? 40 : range === "monthly" ? 80 : 200)
            )
          ),
        }))
      );
    }, 2800);

    return () => clearInterval(id);
  }, [range]);

  /* -------------------------
   Safe Top Product
---------------------------*/
  const topProduct = useMemo(() => {
    if (safeProducts.length === 0) return {};
    return safeProducts.reduce((a, b) => (b.views > a.views ? b : a));
  }, [safeProducts]);

  /* -------------------------
     Safe chart data
  ---------------------------*/
  const areaData = useMemo(
    () => trend.map((d) => ({ name: d.label, views: d.v })),
    [trend]
  );

  const barData = useMemo(
    () =>
      safeProducts.map((p) => ({
        name: p.name,
        views: p.views || 0,
      })),
    [safeProducts]
  );

  /* -------------------------
     Safe Countups
  ---------------------------*/
  const [viewsAnimated, viewsPulse] = useCountUp(topProduct.views || 0, 800);

  const [totalViewsCount] = useCountUp(
    safeProducts.reduce((s, p) => s + (p.views || 0), 0),
    900
  );

  /* -------------------------
     Styles - Updated to match Messages theme
  ---------------------------*/
  const palette = {
    primary: "#0A84FF",
    soft: "#66C7FF",
    soft2: "#3B82F6",
  };

  const containerBg = "bg-gradient-to-br from-gray-50 to-blue-50/30";
  const cardBase = "bg-white/80 backdrop-blur-lg border border-gray-200/60";
  const textSub = "text-gray-600";
  const muted = "text-gray-500";

  const cardVariant = {
    initial: { opacity: 0, y: 6 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
  };

  return (
    <div className={`${containerBg} min-h-screen font-sans text-sm mt-10 p-4 sm:p-6`}>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Analytics
        </h1>
<div className="flex items-center gap-3">
  {/* Range Selector with Sliding Animation */}
  <div className="relative flex items-center gap-1 rounded-xl border border-gray-200/60 px-1 py-1 bg-white/80 backdrop-blur-lg
    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
    <div 
      className={`absolute top-1 bottom-1 w-[calc(33.333%-8px)] rounded-lg transition-all duration-300 ease-in-out ${
        range === "weekly" 
          ? "left-1 bg-blue-500" 
          : range === "monthly" 
          ? "left-[calc(33.333%+4px)] bg-blue-500" 
          : "left-[calc(66.666%+8px)] bg-blue-500"
      }`}
    />
    {["weekly", "monthly", "yearly"].map((r) => (
      <button
        key={r}
        onClick={() => setRange(r)}
        className={`relative px-3 py-1 text-xs rounded-lg transition-all duration-300 z-10 ${
          range === r ? "text-white" : "text-gray-600 hover:text-blue-500"
        }`}
      >
        {r[0].toUpperCase() + r.slice(1)}
      </button>
    ))}
  </div>
</div>
      </header>

      <div className={`max-w-7xl mx-auto ${compact ? "space-y-4" : "space-y-6"}`}>
        {/* Top grid */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-4 gap-4 ${
            compact ? "mb-3" : "mb-6"
          } items-start`}
        >
          {/* AREA CHART */}
          <motion.div
            variants={cardVariant}
            initial="initial"
            animate="enter"
            className={`lg:col-span-2 rounded-2xl p-4 ${cardBase}
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className={`text-xs ${textSub}`}>Views Trend</div>
                <div className="text-lg font-semibold text-gray-900">Recent Views</div>
              </div>
              <div className={`text-xs ${muted}`}>Live</div>
            </div>

            <div className={`min-w-0 min-h-0 ${compact ? "h-36" : "h-44"}`}>
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor={palette.primary} stopOpacity={0.28} />
                        <stop offset="95%" stopColor={palette.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#374151" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#374151" }}
                    />

                    <Tooltip
                      wrapperStyle={{ borderRadius: 8 }}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke={palette.primary}
                      fill="url(#g1)"
                      strokeWidth={2.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* TOP PRODUCT */}
          <motion.div
            variants={cardVariant}
            initial="initial"
            animate="enter"
            className={`rounded-2xl p-4 ${cardBase}
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`text-xs ${textSub}`}>Top product</div>
                <div className="text-lg font-semibold text-gray-900">{topProduct.name || "—"}</div>
              </div>
              <div className={`text-xs ${muted}`}>live</div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <img
                src={topProduct.image || topProduct.img || "/placeholder.png"}
                alt=""
                className="w-16 h-16 rounded-lg object-cover border border-gray-200/60"
              />
              <div>
                <div className={`text-xs ${textSub}`}>Views</div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewsPulse}
                    initial={{ scale: 0.98 }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.7 }}
                    className="text-2xl font-semibold text-gray-900"
                  >
                    {viewsAnimated.toLocaleString()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="h-24 mt-3 min-w-0 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: 6, right: 6 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />

                  <Bar dataKey="views" barSize={20} radius={[6, 6, 6, 6]}>
                    {barData.map((_, idx) => {
                      const colors = [
                        palette.primary,
                        palette.soft2,
                        palette.soft,
                      ];
                      return <Cell key={idx} fill={colors[idx % 3]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* MINI STATS */}
          <div className="space-y-3">
            <motion.div
              variants={cardVariant}
              initial="initial"
              animate="enter"
              className={`${cardBase} rounded-2xl p-3
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]`}
            >
              <div className="flex items-center gap-3">
                <div className="text-xl text-blue-500">
                  <FaShoppingBag />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {safeProducts.length}
                  </div>
                  <div className="text-xs text-gray-600">
                    Most Viewed Products
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariant}
              initial="initial"
              animate="enter"
              className={`${cardBase} rounded-2xl p-3
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]`}
            >
              <div className="flex items-center gap-3">
                <div className="text-xl text-blue-500">
                  <FaEye />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {totalViewsCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    Total Product Views
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariant}
              initial="initial"
              animate="enter"
              className={`${cardBase} rounded-2xl p-3
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]`}
            >
              <div className="flex items-center gap-3">
                <div className="text-xl text-blue-500">
                  <FaUsers />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900">830</div>
                  <div className="text-xs text-gray-600">
                    Customer Profile Views
                  </div>

                  <div className="flex gap-2 mt-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200/60 text-sm bg-white/60">
                      <FaThumbsUp className="text-blue-500" />{" "}
                      <span className="text-gray-700">{topProduct.likes || 0}</span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200/60 text-sm bg-white/60">
                      <FaThumbsDown className="text-blue-400" />{" "}
                      <span className="text-gray-700">{topProduct.dislikes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Products Performance</h2>
            <div className="text-xs text-gray-600">
              Updated live
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`${cardBase} rounded-2xl p-4
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]`}
                >
                  <Skeleton className="w-full h-36 object-cover rounded-lg" />
                  <div className="mt-3 flex items-center justify-between">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                  <div className="mt-3 h-12">
                    <Skeleton className="w-full h-full rounded" />
                  </div>
                </div>
              ))
            ) : (
              safeProducts.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -6 }}
                  className={`${cardBase} rounded-2xl p-4 cursor-pointer transition-all duration-200
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                    hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]`}
                >
                  <img
                    src={p.image || p.img || "/placeholder.png"}
                    alt=""
                    className="w-full h-36 object-cover rounded-lg border border-gray-200/60"
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-600">
                        {p.reviews || 0} reviews • {p.rating || 0}★
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {(p.views || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        views
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 h-12 min-w-0 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={
                          Array.isArray(p.spark)
                            ? p.spark.map((v, i) => ({ x: i, v }))
                            : []
                        }
                      >
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke={palette.primary}
                          fill={palette.soft}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}