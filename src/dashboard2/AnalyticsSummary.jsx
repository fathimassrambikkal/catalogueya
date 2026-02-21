import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  ProductIcon,
  ViewsIcon,
  FollowersIcon,
  HeartIcon,
  ReviewIcon,
  ShareIcon,
} from "./AnalyticsIcons";
const iconMap = {
  Products: ProductIcon,
  Views: ViewsIcon,
  Followers: FollowersIcon,
  Favourite: HeartIcon,
  Reviews: ReviewIcon,
  Shares: ShareIcon,
};

// Hook for smooth count-up animation
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (typeof value !== 'number') {
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

      // spring-like easing
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
  }, [value, duration, display]);

  return display;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, range }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl p-3 sm:p-4 shadow-2xl min-w-[140px]">
        <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">{label}</div>
        <div className="text-lg sm:text-2xl font-bold text-blue-600">
          {payload[0].value.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {range === 'weekly' && `Day ${data.dayNumber}`}
          {range === 'monthly' && `Month ${data.monthNumber}`}
          {range === 'daily' && data.name}
        </div>
      </div>
    );
  }
  return null;
};

function AnalyticsSummary({ range }) {
  const normalizedRange = useMemo(() => {
    switch (range) {
      case "Last 7 days":
        return "weekly";
      case "Last month":
        return "monthly";
      case "Last 90 days":
        return "quarterly";
      case "Last year":
        return "yearly";
      default:
        return "weekly";
    }
  }, [range]);

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  // Summary data from your screenshot
const summaryData = [
  { key: "products", label: "Products", value: 67, trend: "up" },
  { key: "views", label: "Views", value: 560, trend: "up" },
  { key: "followers", label: "Followers", value: 200, trend: "up" },
  { key: "favourite", label: "Favourite", value: 65, trend: "down" },
  { key: "reviews", label: "Reviews", value: 120, trend: "down" },
  { key: "shares", label: "Shares", value: 69, trend: "neutral" },
];


  // Current value (using Views from screenshot)
  const currentValue = 560;
  const previousValue = useMemo(() => {
    // For demo, let's say previous was 520 (approx 7.7% increase)
    return 520;
  }, []);

  const animatedValue = useCountUp(currentValue, 1200);
  const animatedPrevious = useCountUp(previousValue, 1200);

  const isPositive = currentValue >= previousValue;

  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (!previousValue || previousValue === 0) return 0;
    return ((currentValue - previousValue) / previousValue * 100).toFixed(1);
  }, [currentValue, previousValue]);

  useEffect(() => {
    const generateData = () => {
      if (normalizedRange === "weekly") {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const values = [420, 480, 510, 560, 590, 520, 470];

        return days.map((d, i) => ({
          name: d,
          label: d,
          value: values[i],
          dayNumber: i + 1,
        }));
      }

      if (normalizedRange === "monthly") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
        const values = [320, 380, 420, 460, 510, 530, 560];

        return months.map((m, i) => ({
          name: m,
          label: m,
          value: values[i],
          monthNumber: i + 1,
        }));
      }

      if (normalizedRange === "quarterly") {
        // 🔥 90 DAYS → GROUPED BY WEEK (Enterprise standard)
        return Array.from({ length: 13 }, (_, i) => ({
          name: `W${i + 1}`,
          label: `Week ${i + 1}`,
          value: Math.floor(Math.random() * 900 + 600),
          weekNumber: i + 1,
        }));
      }

      if (normalizedRange === "yearly") {
        return Array.from({ length: 12 }, (_, i) => ({
          name: `M${i + 1}`,
          label: `Month ${i + 1}`,
          value: Math.floor(Math.random() * 5000 + 2000),
          monthNumber: i + 1,
        }));
      }

      return [];
    };

    setLoading(true);
    const t = setTimeout(() => {
      setChartData(generateData());
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, [normalizedRange]);

  // Custom Y-axis tick formatter
  const formatYAxis = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  // Get Y-axis domain based on data
  const getYAxisDomain = () => {
    if (!chartData.length) return [0, 100];
    const values = chartData.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = max * 0.1;
    return [Math.max(0, min - padding), max + padding];
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 font-sans rounded-xl w-full overflow-hidden">
      <div className="max-w-[2000px] mx-auto px-1.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-3 sm:py-5 md:py-6 lg:py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-3 sm:gap-6 lg:gap-8 mb-4 sm:mb-8">
          <div className="w-full">
            {/* ================= PRODUCTS SUMMARY TITLE ================= */}
<div className="mb-2 sm:mb-3">
  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
    Products Summary
  </h2>
</div>

       {/* ===== Enterprise KPI Strip ===== */}
<div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-1 sm:gap-2 md:gap-2.5 w-full mb-3 sm:mb-6">
  {summaryData.map((item) => (
    <div
      key={item.key}
      className="
        flex items-center gap-1.5 sm:gap-3
        px-1.5 sm:px-3 md:px-3.5 py-1 sm:py-2
        rounded-lg
        bg-white/70
        backdrop-blur-md
        border border-gray-200/60
        shadow-[0_1px_0_rgba(0,0,0,0.04)]
        transition
        min-w-0
        overflow-hidden
      "
    >
      {/* Icon */}
      <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md bg-blue-50">
        {React.createElement(iconMap[item.label], {
          className:
            "w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-blue-600",
        })}
      </span>

      {/* Metric */}
      <div className="flex flex-col leading-tight min-w-0 flex-1">
        <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-gray-500 uppercase tracking-wide truncate">
          {item.label}
        </span>

        <div className="flex items-center gap-1">
          <span className="text-xs xs:text-sm sm:text-[15px] md:text-[16px] lg:text-[17px] font-semibold text-gray-900 tabular-nums truncate">
            {item.value}
          </span>

          {/* Indicator */}
          {item.trend === "up" && (
            <span className="text-green-600 text-[10px] sm:text-xs font-semibold">
              ▲
            </span>
          )}

          {item.trend === "down" && (
            <span className="text-red-600 text-[10px] sm:text-xs font-semibold">
              ▼
            </span>
          )}

          
        </div>
      </div>
    </div>
  ))}
</div>

          </div>
        </div>

        {/* Chart Section */}
        <motion.div
          className="bg-white/95 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-4 md:p-6 lg:p-8 xl:p-10 border border-gray-200 shadow-lg sm:shadow-xl w-full overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="mb-3 sm:mb-6 md:mb-8">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Views Trend</h2>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
              {normalizedRange === 'weekly' && 'Last 7 days'}
              {normalizedRange === 'monthly' && 'Last month'}
              {normalizedRange === "quarterly" && "Last 90 days"}
              {normalizedRange === 'yearly' && 'Last year'}
            </p>
          </div>

          <div className="relative h-44 xs:h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96 pl-6 sm:pl-8 md:pl-10 lg:pl-12 pb-4 sm:pb-6 md:pb-8 w-full overflow-visible">
            {/* Y-axis Label - Only show on larger screens */}
            <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 -rotate-90 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
              Views Count
            </div>
            
            {loading ? (
              <div className="h-full w-full bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 bg-[length:200%_100%] rounded-lg animate-pulse" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ 
                      top: 5, 
                      right: 5, 
                      left: 5, 
                      bottom: 5 
                    }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="2 2" 
                      stroke="rgba(0, 0, 0, 0.05)"
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fill: '#6b7280', 
                        fontSize: 8,
                        fontWeight: 500 
                      }}
                      padding={{ left: 2, right: 2 }}
                      interval="preserveStartEnd"
                      minTickGap={2}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fill: '#6b7280', 
                        fontSize: 8,
                        fontWeight: 500 
                      }}
                      tickFormatter={formatYAxis}
                      domain={getYAxisDomain()}
                      width={24}
                      mirror={false}
                    />
                    <Tooltip 
                      content={<CustomTooltip range={normalizedRange} />}
                      animationDuration={200}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={1.5}
                      fill="url(#colorValue)"
                      animationDuration={1500}
                      animationEasing="ease-out"
                      dot={{ 
                        stroke: '#3b82f6', 
                        strokeWidth: 1, 
                        r: 1.5, 
                        fill: '#fff' 
                      }}
                      activeDot={{ 
                        stroke: '#fff', 
                        strokeWidth: 1.5, 
                        r: 2.5, 
                        fill: '#3b82f6',
                        style: { filter: 'drop-shadow(0 1px 3px rgba(59, 130, 246, 0.3))' }
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                
                {/* X-axis Label */}
                <div className="text-center text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 mt-1.5 sm:mt-2 md:mt-3 lg:mt-4 px-1">
                  {normalizedRange === "weekly" && "Days of Week"}
                  {normalizedRange === "monthly" && "Months"}
                  {normalizedRange === "quarterly" && "Weeks (Last 90 Days)"}
                  {normalizedRange === "yearly" && "Months"}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AnalyticsSummary;