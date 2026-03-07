import React, { useEffect, useState } from "react";

import { useFixedWords } from "../hooks/useFixedWords";
/* ===============================
   Rolling Digit Component
================================ */

function RollingDigit({ digit }) {


  return (
    <div className="relative h-[1em] w-[0.65em] overflow-hidden">
      <div
        className="absolute left-0 top-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translateY(-${digit * 10}%)`,
        }}
      >
        {[0,1,2,3,4,5,6,7,8,9].map((num) => (
          <span
            key={num}
            className="h-[1em] flex items-center justify-center"
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ===============================
   Format number into digit array
================================ */

function formatToDigits(value) {
  return value
    .toLocaleString()
    .split("")
    .map((char) => char);
}

/* ===============================
   Revenue Card with Rolling Digits
================================ */

export default function AnalyticsRevenue({


  
  value = 1200,
  currency = "QR",
  trend = "up",
  range = "Last 7 days"
}) {
  const [displayValue, setDisplayValue] = useState(0);

    const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};
  useEffect(() => {
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(value * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const digits = formatToDigits(displayValue);

  const rangeLabel = {
  "Last 7 days": fw.last_7_days || "Last 7 days",
  "Last month": fw.last_month || "Last month",
  "Last 3 months": fw.last_3_months || "Last 3 months",
  "Last year": fw.last_year || "Last year",
}[range] || range;

return (
    <div className="relative h-full rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">

      {/* Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />

      <div className="relative p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col h-full justify-between">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500">{fw.total_revenue|| "Total Revenue"}</p>
            <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-400 mt-0.5">{rangeLabel}</p>
          </div>
          <span className={`text-sm xs:text-base sm:text-lg ${trend === "up" ? "text-blue-500" : "text-gray-400"}`}>
            {trend === "up" ? "↑" : "↓"}
          </span>
        </div>

        {/* Rolling Number */}
        <div className="flex items-center justify-center flex-1 px-1 xs:px-2 sm:px-0">
          <div className="flex items-end gap-0.5 xs:gap-1 sm:gap-2 text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-gray-900 tabular-nums flex-wrap justify-center">
            {digits.map((char, index) =>
              isNaN(char) ? (
                <span key={index} className="text-2xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{char}</span>
              ) : (
                <RollingDigit key={index} digit={Number(char)} />
              )
            )}
            <span className="text-xl xs:text-2xl sm:text-3xl text-gray-300 ml-1 xs:ml-2 sm:ml-3 self-end">
              {fw.qar || currency}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
