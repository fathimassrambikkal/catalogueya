import React, { memo, useMemo } from "react";

// High-performance skeleton for product card
export const ProductCardSkeleton = memo(({ width }) => {
  const cardHeight = useMemo(() => {
    const winWidth = window.innerWidth;
    if (winWidth < 640) return '224px'; // 160 + 64
    if (winWidth < 768) return '244px'; // 180 + 64
    return '264px'; // 200 + 64
  }, []);

  return (
    <div
      className="relative flex-none rounded-2xl overflow-hidden animate-pulse"
      style={{ width, minWidth: width, height: cardHeight }}
    >
      {/* Image skeleton with shimmer effect */}
      <div className="w-full h-[160px] xs:h-[180px] sm:h-[200px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-t-2xl relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-3 bg-white/70 backdrop-blur-xl rounded-b-2xl border-t border-white/20 min-h-[64px] max-h-[64px]">
        <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
});