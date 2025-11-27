import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
} from "react-icons/fa";

// Ultra-smooth count-up hook with Apple-like easing
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (value === display) return;

    setIsAnimating(true);
    let startTime = null;
    const startValue = display;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apple's signature easing curve
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const current = Math.round(startValue + (value - startValue) * eased);
      setDisplay(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return [display, isAnimating];
}

// Enhanced skeleton with shimmer effect
function Skeleton({ className = "", shimmer = false }) {
  return (
    <div className={`relative overflow-hidden animate-pulse bg-gray-200/60 rounded ${className}`}>
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}

// Optimized card component with micro-interactions
const AnalyticsCard = ({ 
  children, 
  className = "",
  hoverable = true,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`bg-white/80 backdrop-blur-lg border border-gray-200/60 rounded-2xl p-4 transition-all duration-300 ${
        hoverable ? 'cursor-pointer' : ''
      } ${className}`}
      initial="initial"
      animate="enter"
      whileHover={hoverable ? { 
        y: -4, 
        transition: { type: "spring", stiffness: 400, damping: 30 }
      } : {}}
      onHoverStart={() => hoverable && setIsHovered(true)}
      onHoverEnd={() => hoverable && setIsHovered(false)}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

/* -------------------------
   Main Component
---------------------------*/
export default function AnalyticsAppleFull({ products = [] }) {
  // SAFE: default to empty array
  const safeProducts = Array.isArray(products) ? products : [];

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("weekly");
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Optimized loading with progressive enhancement
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Memoized data with useCallback for stability
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

  const [trend, setTrend] = useState(() => baseData[range]?.slice() || []);

  // Throttled data updates for performance
  useEffect(() => {
    if (!baseData[range]) return;
    setTrend(baseData[range].map((d) => ({ ...d })));
  }, [range, baseData]);

  // Optimized interval with cleanup
  useEffect(() => {
    let timeoutId;
    const updateInterval = range === "weekly" ? 2800 : range === "monthly" ? 3200 : 4000;

    const updateTrend = () => {
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
    };

    const intervalId = setInterval(() => {
      timeoutId = setTimeout(updateTrend, 50); // Small delay for batching
    }, updateInterval);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
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
  const [viewsAnimated] = useCountUp(topProduct.views || 0, 800);
  const [totalViewsCount] = useCountUp(
    safeProducts.reduce((s, p) => s + (p.views || 0), 0),
    900
  );

  // Memoized styles and configuration
  const palette = useMemo(() => ({
    primary: "#0A84FF",
    soft: "#66C7FF",
    soft2: "#3B82F6",
  }), []);

  const cardVariant = useMemo(() => ({
    initial: { opacity: 0, y: 8 },
    enter: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      y: -8,
      transition: { duration: 0.2 }
    },
  }), []);

  // Optimized event handlers
  const handleRangeChange = useCallback((newRange) => {
    setRange(newRange);
  }, []);

  const handleProductHover = useCallback((productId) => {
    setHoveredProduct(productId);
  }, []);

  const handleProductLeave = useCallback(() => {
    setHoveredProduct(null);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen font-sans text-sm p-4 sm:p-6">
      {/* Header with enhanced micro-interactions */}
      <motion.header 
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-gray-900"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Analytics
        </motion.h1>
        
        <div className="flex items-center gap-3">
          {/* Original Range Selector with Sliding Animation */}
          <div className="relative flex items-center gap-1 rounded-xl border border-gray-200/60 px-1 py-1 bg-white/80 backdrop-blur-lg shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <motion.div 
              className={`absolute top-1 bottom-1 w-[calc(33.333%-8px)] rounded-lg transition-all duration-300 ease-in-out bg-blue-500`}
              initial={false}
              animate={{
                left: range === "weekly" 
                  ? "4px" 
                  : range === "monthly" 
                  ? "calc(33.333% + 4px)" 
                  : "calc(66.666% + 4px)"
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            {["weekly", "monthly", "yearly"].map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                className={`relative px-3 py-1 text-xs rounded-lg transition-all duration-300 z-10 ${
                  range === r ? "text-white" : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top grid with staggered animations - Updated for mobile */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start"
          initial="initial"
          animate="enter"
          variants={{
            enter: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* AREA CHART - Full width on mobile, 2 cols on lg+ */}
          <motion.div variants={cardVariant} className="lg:col-span-2">
            <AnalyticsCard>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-600">Views Trend</div>
                  <div className="text-lg font-semibold text-gray-900">Recent Views</div>
                </div>
                <motion.div 
                  className="text-xs text-gray-500 flex items-center gap-1"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Live
                </motion.div>
              </div>

              <div className="h-36 min-w-0 min-h-0">
                {loading ? (
                  <Skeleton className="w-full h-full rounded-lg" shimmer />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor={palette.primary} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={palette.primary} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>

                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#374151", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#374151", fontSize: 12 }}
                      />

                      <Tooltip
                        wrapperStyle={{ 
                          borderRadius: 12,
                          backdropFilter: 'blur(20px)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                        contentStyle={{
                          background: 'transparent',
                          border: 'none',
                          borderRadius: 8,
                        }}
                        animationDuration={300}
                      />

                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke={palette.primary}
                        fill="url(#g1)"
                        strokeWidth={2.5}
                        dot={{ fill: palette.primary, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                        animationDuration={300}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </AnalyticsCard>
          </motion.div>

          {/* TOP PRODUCT - Full width on mobile, 1 col on lg+ */}
          <motion.div variants={cardVariant}>
            <AnalyticsCard>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-600">Top product</div>
                  <div className="text-lg font-semibold text-gray-900 truncate">
                    {topProduct.name || "—"}
                  </div>
                </div>
                <div className="text-xs text-gray-500">live</div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <img
                    src={topProduct.image || topProduct.img || "/placeholder.png"}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200/60"
                  />
                  <motion.div 
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <div className="text-xs text-gray-600">Views</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={viewsAnimated}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.1, opacity: 0 }}
                      className="text-2xl font-semibold text-gray-900"
                    >
                      {viewsAnimated.toLocaleString()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="h-24 mt-3 min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData.slice(0, 5)} margin={{ left: 6, right: 6 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip animationDuration={300} />

                    <Bar 
                      dataKey="views" 
                      barSize={20} 
                      radius={[4, 4, 4, 4]}
                      animationDuration={300}
                    >
                      {barData.slice(0, 5).map((_, idx) => {
                        const colors = [palette.primary, palette.soft2, palette.soft];
                        return (
                          <Cell 
                            key={idx} 
                            fill={colors[idx % 3]}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnalyticsCard>
          </motion.div>

          {/* MINI STATS - 3-column grid on mobile, stacked on lg+ */}
          <motion.div variants={cardVariant} className="grid grid-cols-3 gap-3 lg:block lg:space-y-3">
            <AnalyticsCard hoverable={false} className="flex flex-col justify-center">
              <div className="flex flex-col items-center text-center gap-2">
                <motion.div 
                  className="text-xl text-blue-500"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FaShoppingBag />
                </motion.div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {safeProducts.length}
                  </div>
                  <div className="text-xs text-gray-600 leading-tight">
                    Most Viewed Products
                  </div>
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard hoverable={false} className="flex flex-col justify-center">
              <div className="flex flex-col items-center text-center gap-2">
                <motion.div 
                  className="text-xl text-blue-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FaEye />
                </motion.div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {totalViewsCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 leading-tight">
                    Total Product Views
                  </div>
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard hoverable={false} className="flex flex-col justify-center">
              <div className="flex flex-col items-center text-center gap-2">
                <motion.div 
                  className="text-xl text-blue-500"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FaUsers />
                </motion.div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">830</div>
                  <div className="text-xs text-gray-600 leading-tight">
                    Customer Profile Views
                  </div>
                </div>
              </div>
            </AnalyticsCard>
          </motion.div>
        </motion.div>

        {/* PRODUCT GRID with enhanced interactions */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl font-bold text-gray-900">Products Performance</h2>
            <motion.div 
              className="text-xs text-gray-600 flex items-center gap-1"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Updated live
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <AnalyticsCard key={i} hoverable={false}>
                  <Skeleton className="w-full h-36 rounded-lg" shimmer />
                  <div className="mt-3 flex items-center justify-between">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                  <div className="mt-3 h-12">
                    <Skeleton className="w-full h-full rounded" shimmer />
                  </div>
                </AnalyticsCard>
              ))
            ) : (
              safeProducts.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  whileHover={{ 
                    y: -4,
                    transition: { type: "spring", stiffness: 400, damping: 30 }
                  }}
                >
                  <AnalyticsCard
                    onMouseEnter={() => handleProductHover(p.id)}
                    onMouseLeave={handleProductLeave}
                  >
                    <motion.img
                      src={p.image || p.img || "/placeholder.png"}
                      alt=""
                      className="w-full h-36 object-cover rounded-lg border border-gray-200/60"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 truncate">{p.name}</div>
                        <div className="text-xs text-gray-600">
                          {p.reviews || 0} reviews • {p.rating || 0}★
                        </div>
                      </div>

                      <motion.div 
                        className="text-right"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="font-medium text-gray-900">
                          {(p.views || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          views
                        </div>
                      </motion.div>
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
                            animationDuration={300}
                          />
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
  );
}