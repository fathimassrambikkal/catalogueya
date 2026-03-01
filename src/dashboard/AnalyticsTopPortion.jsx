import React, { useMemo } from "react";
import {
  ViewsIcon,
  SoldIcon,
  HeartIcon,
  ShareIcon,
} from "./AnalyticsIcons";
import AnalyticsCalendar from "./AnalyticsCalendar";
import AnalyticsSummary from "./AnalyticsSummary";
import AnalyticsRevenue from "./AnalyticsRevenue";
import { getImageUrl } from "../companyDashboardApi";

// Helper to safely parse image string
const parseImageString = (imgStr) => {
  if (!imgStr) return null;
  try {
    if (imgStr.startsWith('"') || imgStr.startsWith('{')) {
      let parsed = JSON.parse(imgStr);
      if (typeof parsed === 'string' && (parsed.startsWith('{') || parsed.startsWith('"'))) {
        parsed = JSON.parse(parsed);
      }
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed.webp || parsed.avif || parsed.url || null;
      }
      return parsed;
    }
    return imgStr;
  } catch (e) {
    console.error("Error parsing image string", e);
    return imgStr;
  }
};

function AnalyticsTopPortion({ range, setRange, companyName, data = {}, summaryData = {}, companyAnalytics = {} }) {

  // Revenue Data
  const revenueValue = companyAnalytics?.revenue?.value || 0;
  const revenueCurrency = companyAnalytics?.revenue?.currency || "QR";

  // Map Top Products
  const topHighlights = useMemo(() => {
    const keys = [
      { key: "most_sold", title: "Most Sold" },
      { key: "most_viewed", title: "Most Viewed" },
      { key: "most_favored", title: "Most Favored" },
      { key: "most_shared", title: "Most Shared" }
    ];

    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    return keys.map(k => {
      const item = data[k.key];
      if (!item) {
        return {
          title: k.title,
          product: "No Data",
          image: null,
          metrics: { views: 0, sold: 0, fav: 0, share: 0 }
        };
      }

      const realImage = parseImageString(item.image);

      return {
        title: k.title,
        product: item.name || "No data",
        image: realImage,
        metrics: {
          views: item.views || item.value || 0,
          sold: item.sold || 0,
          fav: item.favored || item.fav || 0,
          share: item.shares || 0,
        }
      };
    });
  }, [data]);

  return (
    <div className="space-y-6">
      {/* HEADER & CALENDAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Company's Analytics
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500">View analytics</span>
          <AnalyticsCalendar range={range} setRange={setRange} />
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Revenue + Summary */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          {/* REVENUE CARD (Unlocked) */}
          <AnalyticsRevenue
            value={revenueValue}
            currency={revenueCurrency}
            trend={companyAnalytics?.revenue?.trend || "up"}
          />

          {/* SUMMARY CARD */}
          <div className="flex-1">
            <AnalyticsSummary range={range} data={summaryData} />
          </div>
        </div>

        {/* RIGHT COLUMN: Your Top Products */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 ml-0 lg:ml-4 h-full flex flex-col">
          <div className="text-center mb-6">
            <h3 className="text-blue-600/80 font-bold uppercase tracking-wider text-sm mb-1">YOUR TOP PRODUCT</h3>
            <p className="text-xs text-gray-400 font-medium">{range}</p>
          </div>

          <div className="space-y-6">
            {topHighlights.map((item, i) => (
              <div key={i} className="space-y-2 group">
                <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>

                {/* Product Card */}
                <div className="relative h-28 rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all bg-gray-50">
                  {item.image ? (
                    <img src={getImageUrl(item.image)} alt={item.product} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                      <span className="text-xs">No Image</span>
                    </div>
                  )}

                  {/* Gradient & Name */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 pt-6 flex flex-col justify-end">
                    <div className="bg-white/90 backdrop-blur-sm self-start px-2 py-0.5 rounded text-[10px] font-bold text-gray-900 mb-1 max-w-full truncate">
                      {item.product}
                    </div>
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="flex items-center justify-between px-1 py-1 text-[10px] text-gray-500 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1 w-1/4 justify-center border-r border-gray-200 last:border-0"><ViewsIcon className="w-3 h-3 text-gray-400" /> {item.metrics.views}</div>
                  <div className="flex items-center gap-1 w-1/4 justify-center border-r border-gray-200 last:border-0"><HeartIcon className="w-3 h-3 text-gray-400" /> {item.metrics.fav}</div>
                  <div className="flex items-center gap-1 w-1/4 justify-center border-r border-gray-200 last:border-0"><SoldIcon className="w-3 h-3 text-gray-400" /> {item.metrics.sold}</div>
                  <div className="flex items-center gap-1 w-1/4 justify-center"><ShareIcon className="w-3 h-3 text-gray-400" /> {item.metrics.share}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsTopPortion;
