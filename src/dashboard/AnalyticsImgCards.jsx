import React, { useMemo } from "react";
import {
  ViewsIcon,
  SoldIcon,
  HeartIcon,
  ShareIcon,
} from "./AnalyticsIcons";
import { getImageUrl } from "../companyDashboardApi";
import { useFixedWords } from "../hooks/useFixedWords";

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

function AnalyticsImgCards({ range, setRange, companyName, data = {}, summaryData = {}, companyAnalytics = {} }) {
  const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

  // Map Top Products
  const topHighlights = useMemo(() => {
   const keys = [
  { key: "most_sold", title: fw.most_sold || "Most Sold" },
  { key: "most_viewed", title: fw.most_viewed || "Most Viewed" },
  { key: "most_favored", title: fw.most_favored || "Most Favored" },
  { key: "most_shared", title: fw.most_shared || "Most Shared" }
];

    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    return keys.map(k => {
      const item = data[k.key];
      if (!item) {
        return {
          title: k.title,
          product: fw.no_data || "No Data",
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
    {/* CONTENT GRID - ONLY IMAGE CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {topHighlights.map((item, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
          {/* Header - More Compact */}
          <div className="px-3 pt-3 pb-1 flex items-center justify-between">
            <h3 className="text-blue-600/80 font-bold text-[10px] uppercase tracking-wider">
              {fw.top_product || "Top Product"}
            </h3>
            <p className="text-[9px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded">
              {range}
            </p>
          </div>

          {/* Product Image - More Prominent */}
          <div className="px-3">
            <div className="relative h-36 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              {item.image ? (
                <img 
                  src={getImageUrl(item.image)} 
                  alt={item.product} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                  <span className="text-xs">{fw.no_image || "No Image"}</span>
                </div>
              )}
              
              {/* Product Name Overlay - More Visible */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 pt-4">
                <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 shadow-sm inline-block max-w-full truncate">
                  {item.product}
                </div>
              </div>
            </div>
          </div>

          {/* Product Title - Compact */}
          <div className="px-3 mt-2">
            <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
          </div>

          {/* Metrics Bar - More Visible & Compact */}
          <div className="px-3 pb-3 mt-2">
            <div className="grid grid-cols-4 gap-1 bg-gray-50 rounded-lg p-1">
              <div className="flex items-center justify-center gap-1 text-[9px] text-gray-600">
                <ViewsIcon className="w-3 h-3 text-gray-500" />
                <span className="font-medium">{item.metrics.views}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[9px] text-gray-600 border-l border-gray-200">
                <HeartIcon className="w-3 h-3 text-gray-500" />
                <span className="font-medium">{item.metrics.fav}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[9px] text-gray-600 border-l border-gray-200">
                <SoldIcon className="w-3 h-3 text-gray-500" />
                <span className="font-medium">{item.metrics.sold}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[9px] text-gray-600 border-l border-gray-200">
                <ShareIcon className="w-3 h-3 text-gray-500" />
                <span className="font-medium">{item.metrics.share}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

export default AnalyticsImgCards;