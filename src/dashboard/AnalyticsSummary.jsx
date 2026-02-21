import React, { useMemo } from 'react';
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

function AnalyticsSummary({ range, data, hideFollowers = false }) {
  const summaryData = useMemo(() => {
    const metrics = data?.summary || data || {};

    const items = [
      { key: "products", label: "Products", value: metrics.products_count || metrics.products || 0, trend: "up" },
      { key: "views", label: "Views", value: metrics.views_count || metrics.views || 0, trend: metrics.views_trend || "up" },
      { key: "followers", label: "Followers", value: metrics.followers_count || metrics.followers || 0, trend: metrics.followers_trend || "up" },
      { key: "favourite", label: "Favourite", value: metrics.favourites_count || metrics.favourites || metrics.favourite || 0, trend: metrics.favourites_trend || "down" },
      { key: "reviews", label: "Reviews", value: metrics.reviews_count || metrics.reviews || 0, trend: metrics.reviews_trend || "down" },
      { key: "shares", label: "Shares", value: metrics.shares_count || metrics.shares || 0, trend: "neutral" },
    ];

    return hideFollowers
      ? items.filter(item => item.key !== "followers")
      : items;

  }, [data, hideFollowers]); // ✅ FIXED

 return (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm p-6 h-full flex flex-col">
    
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-600">
        Summary
      </h3>
      <p className="text-xs text-gray-400">{range}</p>
    </div>

    <div className="flex-1 space-y-3">
      {summaryData.map((item) => {
        const Icon = iconMap[item.label] || ProductIcon;

        return (
          <div
            key={item.key}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/60 transition"
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-900">
                {item.value}
              </span>
              {item.trend === "up" && (
                <span className="text-blue-500 text-xs">▲</span>
              )}
              {item.trend === "down" && (
                <span className="text-red-400 text-xs">▼</span>
              )}
            </div>
          </div>
        );
      })}
    </div>

  </div>
);  
}

export default AnalyticsSummary;