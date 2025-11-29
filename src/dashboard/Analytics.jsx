import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Optimized count-up hook with cleanup
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (value === display) return;

    let startTime = null;
    const startValue = display;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const current = Math.round(startValue + (value - startValue) * eased);
      setDisplay(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return display;
}

// Optimized skeleton
function Skeleton({ className = "", shimmer = false }) {
  return (
    <div className={`relative overflow-hidden animate-pulse bg-gray-200/60 rounded-lg ${className}`}>
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}

// Optimized card component
const AnalyticsCard = React.memo(({ 
  children, 
  className = "",
  hoverable = true,
  onClick,
  ...props 
}) => {
  return (
    <motion.div
      className={`bg-white/90 backdrop-blur-xl border border-gray-200/70 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 transition-all duration-300 ${
        hoverable ? 'cursor-pointer' : ''
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverable ? { 
        y: -4, 
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 30 }
      } : {}}
      whileTap={hoverable ? { 
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 30 }
      } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// Optimized stats card component
const StatsCard = React.memo(({ icon: Icon, value, label, trend, className = "" }) => {
  const displayValue = useCountUp(value, 1200);
  const isPositive = trend > 0;

  return (
    <AnalyticsCard hoverable={false} className={`text-center ${className}`}>
      <div className="flex flex-col items-center gap-2 sm:gap-3">
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
          <div className="text-[10px] sm:text-xs text-gray-600 leading-tight">{label}</div>
          
          {trend !== undefined && (
            <motion.div 
              className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isPositive ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>
      </div>
    </AnalyticsCard>
  );
});

/* -------------------------
   Main Component
---------------------------*/
export default function AnalyticsAppleFull({ products = [] }) {
  // SAFE: default to empty array
  const safeProducts = Array.isArray(products) ? products : [];

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("weekly");
  const containerRef = useRef(null);

  // Optimized loading with cleanup
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Memoized data with stable references
  const baseData = useMemo(() => ({
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
  }), []);

  const [trend, setTrend] = useState(() => baseData[range]?.slice() || []);

  // Throttled data updates with proper cleanup
  useEffect(() => {
    if (!baseData[range]) return;
    setTrend(baseData[range].map((d) => ({ ...d })));
  }, [range, baseData]);

  // Optimized interval with robust cleanup
  useEffect(() => {
    let intervalId;
    let timeoutId;
    let mounted = true;

    const updateTrend = () => {
      if (!mounted) return;
      setTrend((t) =>
        t.map((d) => ({
          ...d,
          v: Math.max(0, Math.round(d.v + (Math.random() - 0.45) * 
            (range === "weekly" ? 40 : range === "monthly" ? 80 : 200)))
        }))
      );
    };

    const updateInterval = range === "weekly" ? 2800 : range === "monthly" ? 3200 : 4000;
    
    intervalId = setInterval(() => {
      timeoutId = setTimeout(updateTrend, 50);
    }, updateInterval);

    return () => {
      mounted = false;
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
  const areaData = useMemo(() => 
    trend.map((d) => ({ name: d.label, views: d.v })),
    [trend]
  );

  /* -------------------------
     Safe Countups
  ---------------------------*/
  const viewsAnimated = useCountUp(topProduct.views || 0, 800);
  const totalViewsCount = useCountUp(
    safeProducts.reduce((s, p) => s + (p.views || 0), 0),
    900
  );

  // Memoized styles
  const palette = useMemo(() => ({
    primary: "#007AFF",
    soft: "#66C7FF",
  }), []);

  // Optimized event handlers
  const handleRangeChange = useCallback((newRange) => {
    setRange(newRange);
  }, []);

  // Enhanced stats data
  const statsData = useMemo(() => [
    { 
      icon: FaShoppingBag, 
      value: safeProducts.length, 
      label: "Most Viewed", 
      trend: 12 
    },
    { 
      icon: FaEye, 
      value: safeProducts.reduce((s, p) => s + (p.views || 0), 0), 
      label: "Total Views", 
      trend: 8 
    },
    { 
      icon: FaUsers, 
      value: 830, 
      label: "Profile Views", 
      trend: -2 
    },
  ], [safeProducts]);

  return (
    <div 
      ref={containerRef}
      className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen font-sans text-sm overflow-x-hidden"
    >
      <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-2 min-w-0 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 whitespace-nowrap flex-shrink-0 ml-14 md:0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Analytics
          </motion.h1>
          
          <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
            {/* Range Selector - Fixed for 300px */}
            <div className="relative flex items-center gap-0.5 rounded-lg border border-gray-300/50 px-0.5 py-0.5 bg-white/90 backdrop-blur-xl shadow-sm flex-shrink-0">
              <motion.div 
                className={`absolute top-0.5 bottom-0.5 w-[calc(33.333%-4px)] rounded-md bg-blue-500`}
                initial={false}
                animate={{
                  left: range === "weekly" 
                    ? "1px" 
                    : range === "monthly" 
                    ? "calc(33.333% + 1px)" 
                    : "calc(66.666% + 1px)"
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
              {["weekly", "monthly", "yearly"].map((r) => (
                <motion.button
                  key={r}
                  onClick={() => handleRangeChange(r)}
                  className={`relative px-1.5 py-1 text-[8px] xs:text-[9px] sm:text-xs rounded-md transition-all duration-300 z-10 whitespace-nowrap ${
                    range === r ? "text-white" : "text-gray-600 hover:text-blue-600"
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

        <div className="space-y-3 sm:space-y-4">
          {/* TOP ROW: 4 cards - Fixed grid for 300px */}
          <motion.div 
            className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
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
            {statsData.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="col-span-1"
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}

            {/* Top Product Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1"
            >
              <AnalyticsCard className="h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gray-600 truncate">Top product</div>
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {topProduct.name || "—"}
                    </div>
                  </div>
                  <motion.div 
                    className="text-[10px] text-gray-500 flex items-center gap-0.5 flex-shrink-0 ml-1"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    live
                  </motion.div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.div 
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <img
                      src={topProduct.image || topProduct.img || "/placeholder.png"}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover border border-gray-200/60"
                      loading="lazy"
                    />
                    <motion.div 
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gray-600">Views</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={viewsAnimated}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="text-base font-semibold text-gray-900 truncate"
                      >
                        {viewsAnimated.toLocaleString()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </AnalyticsCard>
            </motion.div>
          </motion.div>

          {/* AREA CHART */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnalyticsCard>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-600">Views Trend</div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900">Recent Views</div>
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

              <div className="h-40 sm:h-56 lg:h-64 min-w-0">
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
                        tick={{ fill: "#374151", fontSize: 10 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#374151", fontSize: 10 }}
                      />

                      <Tooltip
                        animationDuration={200}
                      />

                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke={palette.primary}
                        fill="url(#g1)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 1, stroke: '#fff' }}
                        animationDuration={300}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </AnalyticsCard>
          </motion.div>

          {/* PRODUCT GRID */}
          <motion.div 
            className="mt-4 sm:mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Products Performance</h2>
              <motion.div 
                className="text-xs text-gray-600 flex items-center gap-1"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Updated live
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <AnalyticsCard key={i} hoverable={false}>
                    <Skeleton className="w-full h-32 sm:h-36 rounded-lg" shimmer />
                    <div className="mt-2 sm:mt-3 flex items-center justify-between">
                      <Skeleton className="h-3 sm:h-4 w-2/3" />
                      <Skeleton className="h-3 sm:h-4 w-1/6" />
                    </div>
                    <div className="mt-2 sm:mt-3 h-10 sm:h-12">
                      <Skeleton className="w-full h-full rounded" shimmer />
                    </div>
                  </AnalyticsCard>
                ))
              ) : (
                safeProducts.slice(0, 6).map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    whileHover={{ y: -2 }}
                  >
                    <AnalyticsCard>
                      <motion.img
                        src={p.image || p.img || "/placeholder.png"}
                        alt=""
                        className="w-full h-32 sm:h-36 object-cover rounded-lg border border-gray-200/60"
                        loading="lazy"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      />

                      <div className="mt-2 sm:mt-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">{p.name}</div>
                          <div className="text-xs text-gray-600">
                            {p.reviews || 0} reviews • {p.rating || 0}★
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">
                            {(p.views || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">views</div>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-3 h-10 sm:h-12 min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={Array.isArray(p.spark) ? p.spark.map((v, i) => ({ x: i, v })) : []}
                          >
                            <Area
                              type="monotone"
                              dataKey="v"
                              stroke={palette.primary}
                              fill={palette.soft}
                              strokeWidth={1.5}
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
    </div>
  );
}