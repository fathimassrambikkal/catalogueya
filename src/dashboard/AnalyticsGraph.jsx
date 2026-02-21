import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function AnalyticsGraph({ data, range = "weekly", title = "Analytics Overview" }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [data]);

  // Apple physics blue theme colors
  const colors = {
    views: "#3b82f6",      // Blue-500
    sold: "#5E5CE6",       // Indigo
    fav: "#64D2FF",        // Light blue
    shares: "#BF5AF2",     // Purple
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl p-2 sm:p-3 md:p-4 shadow-2xl min-w-[120px] xs:min-w-[140px] sm:min-w-[160px]"
        >
          <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-2 xs:gap-3 sm:gap-4 text-[9px] xs:text-[10px] sm:text-xs mb-1.5 last:mb-0">
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                <div
                  className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-gray-500 font-medium capitalize">
                  {entry.name}:
                </span>
              </div>
              <span className="font-bold text-gray-900 tabular-nums">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          {/* Add day/week info like in AnalyticsSummary */}
          {range && (
            <div className="text-[8px] xs:text-[9px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 pt-1 border-t border-gray-100">
              {range === 'weekly' && data?.dayNumber && `Day ${data.dayNumber}`}
              {range === 'monthly' && data?.monthNumber && `Month ${data.monthNumber}`}
              {range === 'quarterly' && data?.weekNumber && `Week ${data.weekNumber}`}
            </div>
          )}
        </motion.div>
      );
    }
    return null;
  };

  // Format Y-axis values - matching AnalyticsSummary
  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  // Get domain for Y-axis
  const getYAxisDomain = () => {
    if (!data?.length) return [0, 100];
    const values = data.flatMap(item => [
      item.views || 0,
      item.sold || 0,
      item.fav || 0,
      item.shares || 0
    ]).filter(Boolean);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = max * 0.1;
    return [Math.max(0, min - padding), max + padding];
  };

  // Get range label - matching AnalyticsSummary
  const getRangeLabel = () => {
    switch (range) {
      case "weekly": return "Last 7 days";
      case "monthly": return "Last month";
      case "quarterly": return "Last 90 days";
      case "yearly": return "Last year";
      default: return "Last 7 days";
    }
  };

  // Add day/week numbers to data for tooltip
  const enhancedData = data?.map((item, index) => ({
    ...item,
    dayNumber: index + 1,
    weekNumber: index + 1,
    monthNumber: index + 1
  }));

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 font-sans rounded-xl w-full overflow-hidden">
        <div className="max-w-[2000px] mx-auto px-1 xs:px-1.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 xs:py-2.5 sm:py-4 md:py-5 lg:py-6">
          <div className="bg-white/95 backdrop-blur-lg rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 border border-gray-200 shadow-lg sm:shadow-xl w-full overflow-hidden">
            <div className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[480px] xl:h-[520px] w-full bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 bg-[length:200%_100%] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 font-sans rounded-xl w-full overflow-hidden">
      <div className="max-w-[2000px] mx-auto px-1 xs:px-1.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 xs:py-2.5 sm:py-4 md:py-5 lg:py-6">
        {/* Chart Section - Exactly matching AnalyticsSummary styling */}
        <motion.div
          className="bg-white/95 backdrop-blur-lg rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 border border-gray-200 shadow-lg sm:shadow-xl w-full overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Header - Matching AnalyticsSummary exactly */}
          <div className="mb-2 xs:mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            <h2 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-600 mt-0.5 xs:mt-1">
              {getRangeLabel()}
            </p>
          </div>

          {/* Chart Container - Responsive heights like AnalyticsSummary */}
          <div className="relative h-[250px] xs:h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[480px] 2xl:h-[520px] pl-4 xs:pl-5 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 pr-1 xs:pr-1.5 sm:pr-2 md:pr-3 pb-3 xs:pb-4 sm:pb-5 md:pb-6 w-full overflow-visible">
            
            {/* Y-axis Label - Hidden on mobile, shown on md+ like AnalyticsSummary */}
            <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 -rotate-90 text-[10px] xs:text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
              Count
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={enhancedData}
                margin={{
                  top: 10,
                  right: 5,
                  left: 0,
                  bottom: 30,
                }}
              >
                {/* Gradients for area effect - matching AnalyticsSummary style */}
                <defs>
                  {Object.entries(colors).map(([key, color]) => (
                    <linearGradient
                      key={key}
                      id={`lineGradient-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>

                {/* Minimal grid - exactly like AnalyticsSummary */}
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke="rgba(0, 0, 0, 0.05)"
                  vertical={false}
                />

                {/* X-Axis - Responsive ticks like AnalyticsSummary */}
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  height={50}
                  interval={0}
                  tick={{
                    fill: '#6b7280',
                    fontSize: 7,
                    fontWeight: 500
                  }}
                  tickMargin={6}
                  axisLine={false}
                  tickLine={false}
                  dy={3}
                  // Responsive font sizes
                  fontSize={window.innerWidth < 400 ? 6 : window.innerWidth < 640 ? 7 : 8}
                />

                {/* Y-Axis - Matching AnalyticsSummary styling */}
                <YAxis
                  tick={{
                    fill: '#6b7280',
                    fontSize: 7,
                    fontWeight: 500
                  }}
                  tickFormatter={formatYAxis}
                  axisLine={false}
                  tickLine={false}
                  domain={getYAxisDomain()}
                  width={25}
                  dx={-2}
                  // Responsive font sizes
                  fontSize={window.innerWidth < 400 ? 6 : window.innerWidth < 640 ? 7 : 8}
                />

                {/* Tooltip - Using our custom one */}
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: '#3b82f6',
                    strokeWidth: 1,
                    strokeDasharray: '3 3',
                    opacity: 0.3
                  }}
                />

                {/* Legend - Matching AnalyticsSummary style */}
                <Legend
                  wrapperStyle={{
                    paddingTop: window.innerWidth < 640 ? '10px' : '15px',
                    fontSize: window.innerWidth < 640 ? '8px' : '10px',
                    fontWeight: 500,
                    color: '#6b7280'
                  }}
                  iconType="circle"
                  iconSize={window.innerWidth < 640 ? 6 : 8}
                />

                {/* Line for Views */}
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke={colors.views}
                  strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
                  dot={false}
                  activeDot={{
                    r: window.innerWidth < 640 ? 3 : 4,
                    stroke: '#fff',
                    strokeWidth: 1.5,
                    fill: colors.views,
                    style: { filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />

                {/* Line for Sold */}
                <Line
                  type="monotone"
                  dataKey="sold"
                  name="Sold"
                  stroke={colors.sold}
                  strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
                  dot={false}
                  activeDot={{
                    r: window.innerWidth < 640 ? 3 : 4,
                    stroke: '#fff',
                    strokeWidth: 1.5,
                    fill: colors.sold,
                    style: { filter: 'drop-shadow(0 2px 4px rgba(94, 92, 230, 0.3))' }
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />

                {/* Line for Favorites */}
                <Line
                  type="monotone"
                  dataKey="fav"
                  name="Fav"
                  stroke={colors.fav}
                  strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
                  dot={false}
                  activeDot={{
                    r: window.innerWidth < 640 ? 3 : 4,
                    stroke: '#fff',
                    strokeWidth: 1.5,
                    fill: colors.fav,
                    style: { filter: 'drop-shadow(0 2px 4px rgba(100, 210, 255, 0.3))' }
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />

                {/* Line for Shares */}
                <Line
                  type="monotone"
                  dataKey="shares"
                  name="Shares"
                  stroke={colors.shares}
                  strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
                  dot={false}
                  activeDot={{
                    r: window.innerWidth < 640 ? 3 : 4,
                    stroke: '#fff',
                    strokeWidth: 1.5,
                    fill: colors.shares,
                    style: { filter: 'drop-shadow(0 2px 4px rgba(191, 90, 242, 0.3))' }
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* X-axis Label - Exactly like AnalyticsSummary */}
            <div className="text-center text-[6px] xs:text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium text-gray-600 mt-1 xs:mt-1.5 sm:mt-2 md:mt-3 lg:mt-4 px-1">
              {range === "weekly" && "Days of Week"}
              {range === "monthly" && "Months"}
              {range === "quarterly" && "Weeks"}
              {range === "yearly" && "Months"}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AnalyticsGraph;