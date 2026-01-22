import React, { useEffect, useRef, useState } from "react";

/* ===============================
   Apple-style spring counter
   Always starts from 0
================================ */
function useSpringCounter(target) {
  const valueRef = useRef(0);      // always start at 0
  const velocityRef = useRef(0);
  const rafRef = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    valueRef.current = 0;
    velocityRef.current = 0;
    setDisplay(0);

    const stiffness = 0.14; // spring strength
    const damping = 0.82;   // friction

    const animate = () => {
      const value = valueRef.current;
      const velocity = velocityRef.current;

      const force = (target - value) * stiffness;
      const nextVelocity = velocity * damping + force;
      const nextValue = value + nextVelocity;

      valueRef.current = nextValue;
      velocityRef.current = nextVelocity;

      setDisplay(Math.round(nextValue));

      if (
        Math.abs(target - nextValue) > 0.5 ||
        Math.abs(nextVelocity) > 0.5
      ) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(target); // snap cleanly
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return display;
}

/* ===============================
   Revenue Card
================================ */
function AnalyticsRevenue({ value = 90, currency = "QR", trend = "up" }) {
  const animatedValue = useSpringCounter(value);

  return (
    <div
      className="
        relative
        px-4 py-3
        rounded-2xl
        bg-gradient-to-br from-blue-50/70 to-white/80
        backdrop-blur-xl
        border border-blue-200/40
        shadow-[0_1px_1px_rgba(0,0,0,0.04)]
      "
    >
      {/* top glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      {/* header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-blue-700 uppercase">
          Revenue
        </span>
        <span className="text-[10px] text-gray-500">
          Last 7 days
        </span>
      </div>

      {/* value */}
      <div className="flex items-baseline justify-center gap-1.5 mt-2">
        <span className="text-3xl font-semibold text-gray-900 tabular-nums">
          {animatedValue}
        </span>
        <span
          className={`text-sm font-medium ${
            trend === "up" ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {trend === "up" ? "↑" : "↓"}
        </span>
      </div>

      {/* currency */}
      <div className="mt-1 text-center text-[11px] font-medium text-blue-600">
        {currency}
      </div>

      {/* bottom divider */}
      <div className="mt-3 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />
    </div>
  );
}

export default AnalyticsRevenue;
