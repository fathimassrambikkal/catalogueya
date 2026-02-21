import React from "react";
import { ReviewIcon, StarIcon } from "./AnalyticsIcons";

function AnalyticsReviews({ data,range  }) {
  const { number_of_reviews: total = 0, rating = 0, reviews = [] } = data || {};
  const latestReview = reviews[0] || null;
  const reviewer = latestReview?.user?.name || "No reviews yet";
  const text = latestReview?.comment || "No comment provided for this rating.";
  const filledStars = Math.floor(rating);

 return (
    <div
      className="
        relative
        px-4 sm:px-5
        py-3 sm:py-4
        rounded-2xl sm:rounded-[32px]
        bg-white/90
        backdrop-blur-xl
        border border-gray-100
        shadow-sm
        h-full
        flex flex-col
      "
    >
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 shadow-sm">
            <ReviewIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>

          <span className="text-sm sm:text-base font-semibold sm:font-bold text-gray-900">
            Reviews ({total})
          </span>
        </div>

        <span className="text-[8px] sm:text-[10px] font-medium sm:font-black text-gray-400 uppercase tracking-wider sm:tracking-widest">
          {range}
        </span>
      </div>

      {/* ===== Rating Summary ===== */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span className="text-xs sm:text-sm font-semibold sm:font-black text-gray-900 bg-gray-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-100">
          Rating {rating}
        </span>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              fill={i < filledStars ? "currentColor" : "none"}
              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                i < filledStars
                ? "text-blue-400"
                : "text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* divider */}
      <div className="h-px bg-gray-100 mb-3 sm:mb-4" />

      {/* ===== Latest Review Body ===== */}
      {latestReview ? (
        <div className="flex gap-3 sm:gap-4 flex-1">
          {/* avatar */}
          <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold sm:font-black shadow-md shadow-blue-500/20">
            {reviewer[0]}
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
              <span className="text-xs sm:text-sm font-semibold sm:font-bold text-gray-900">
                {reviewer}
              </span>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    fill={i < latestReview.rating ? "currentColor" : "none"}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < latestReview.rating ? "text-blue-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed line-clamp-3 mb-1.5 sm:mb-2 font-medium">
              {text}
            </p>

            <button className="mt-auto text-[9px] sm:text-[10px] font-semibold sm:font-black text-blue-600 hover:text-blue-700 transition uppercase tracking-wide sm:tracking-wider flex items-center gap-0.5 sm:gap-1">
              Read More <span className="text-[7px] sm:text-[8px]">▼</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-[11px] sm:text-xs italic">
          No recent reviews to display.
        </div>
      )}
    </div>
  );
}

export default AnalyticsReviews;
