import React, { useState, useRef } from "react";
import {
  ViewsIcon,
  SoldIcon,
  HeartIcon,
  ShareIcon,
} from "./AnalyticsIcons";
import AnalyticsCalendar from "./AnalyticsCalendar";

function AnalyticsTopPortion({ range, setRange }) {
  const [lockHovered, setLockHovered] = useState(false);
  const [lockClicked, setLockClicked] = useState(false);

  const lockRef = useRef(null);

  const topHighlights = [
    {
      title: "Most Sold",
      product: "Golden Barrel Cactus",
      image: "/images/cactus.jpg",
      metrics: {
        views: 67,
        sold: 5,
        fav: 24,
        share: 26,
      },
    },
    {
      title: "Most Viewed",
      product: "Hibiscus Pink",
      image: "/images/hibiscus.jpg",
      metrics: {
        views: 67,
        sold: 5,
        fav: 24,
        share: 26,
      },
    },
    {
      title: "Most Favored",
      product: "Epidendrum Orchid",
      image: "/images/orchid.jpg",
      metrics: {
        views: 47,
        sold: 2,
        fav: 20,
        share: 26,
      },
    },
    {
      title: "Most Shared",
      product: "Cycas in kolambi pot",
      image: "/images/cycas.jpg",
      metrics: {
        views: 56,
        sold: 2,
        fav: 23,
        share: 26,
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= TOP SECTION ================= */}
      <div className="flex  gap-4 flex-row lg:items-center lg:justify-between mt-20">
        {/* LEFT */}
        <div className="relative">
          <div className="p-4 sm:p-6">
            <h1
              className="
                font-semibold
                text-gray-900
                leading-tight
                text-[18px]
                min-[360px]:text-[20px]
                sm:text-[22px]
                lg:text-[26px]
                2xl:text-[30px]
              "
            >
              welcome, Mashtel Discovery
            </h1>
          </div>

          <div className="absolute -top-2 -left-2 w-16 h-16 sm:w-20 sm:h-20 bg-blue-400/10 rounded-full blur-xl -z-10" />
          <div className="absolute -bottom-2 -right-2 w-16 h-16 sm:w-20 sm:h-20 bg-cyan-400/10 rounded-full blur-xl -z-10" />
        </div>

        {/* RIGHT */}
        <AnalyticsCalendar range={range} setRange={setRange} />
      </div>

      {/* ================= TOP PRODUCTS CARD ================= */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/60 p-4 sm:p-5 space-y-4">
        <h2 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 px-1">
          Top Products
        </h2>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {topHighlights.map((item, i) => (
            <div
              key={i}
              className="relative h-full flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/60 overflow-hidden"
            >
              {/* TITLE */}
              <div className="px-4 pt-3">
                <h4 className="text-[13px] font-semibold text-gray-900">
                  {item.title}
                </h4>
              </div>

              {/* IMAGE */}
              <div className="relative mt-2 mx-3 rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.product}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* FOOTER — ALL ICONS */}
              <div className="relative px-3 py-3 mt-auto grid grid-cols-4 gap-2 text-[12px] text-gray-600 tabular-nums">
                <Metric Icon={ViewsIcon} value={item.metrics.views} />
                <Metric Icon={SoldIcon} value={item.metrics.sold} />
                <Metric Icon={HeartIcon} value={item.metrics.fav} />
                <Metric Icon={ShareIcon} value={item.metrics.share} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= METRIC ================= */
function Metric({ Icon, value }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50">
        <Icon className="w-3.5 h-3.5 text-blue-600" />
      </span>
      <span className="font-semibold text-[12px] leading-none">
        {value}
      </span>
    </div>
  );
}


export default AnalyticsTopPortion;
