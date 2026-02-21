import React from "react";
import { ReviewIcon, StarIcon } from "./AnalyticsIcons";

function AnalyticsReviews({
  total = 38,
  rating = 4.4,
  reviewer = "Hellow Doha",
  text =
    "First time visiting the shop and it was great! Fun energy in the plant nursery among the staff and other clients. The shopkeeper provided amazing advice, and put in loads of time to provide guidance.",
}) {
  const filledStars = Math.floor(rating);

  return (
    <div
      className="
        relative
        px-4 py-3
        rounded-2xl
        bg-white/85
        backdrop-blur-xl
        border border-gray-200/70
        shadow-[0_1px_1px_rgba(0,0,0,0.04)]
      "
    >
      {/* subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-50">
            <ReviewIcon className="w-4 h-4 text-blue-600" />
          </span>

          <span className="text-sm font-semibold text-gray-900">
            Reviews ({total})
          </span>
        </div>

        <span className="text-[11px] text-gray-500">
          Last 7 days
        </span>
      </div>

      {/* ===== Rating ===== */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-medium text-gray-900">
          Rating {rating}
        </span>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              fill={i < filledStars ? "currentColor" : "none"}
              className={`w-3.5 h-3.5 ${
                i < filledStars
                  ? "text-blue-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />

      {/* ===== Review Body ===== */}
      <div className="flex gap-3">
        {/* avatar */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-semibold">
          {reviewer[0]}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {reviewer}
            </span>

            {/* reviewer stars – fully filled */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  fill="currentColor"
                  className="w-3 h-3 text-blue-500"
                />
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {text}
          </p>

          <button className="mt-1 text-xs font-medium text-blue-600 hover:underline">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsReviews;
