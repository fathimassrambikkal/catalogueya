import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

function AnalyticsStatus({ range }) {
  const cards = [
    { id: 'low-stock', title: 'Low in Stock', value: 10, color: '#FF9500' },
    { id: 'out-stock', title: 'Out of Stock', value: 0.0, color: '#FF3B30' },
    { id: 'sales', title: 'Sales', value: 5, color: '#34C759' },
    { id: 'new-arrivals', title: 'New Arrivals', value: 20, color: '#007AFF' },
    { id: 'limited-edition', title: 'Limited Edition', value: 12, color: '#AF52DE' },
  ];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [values, setValues] = useState(cards.map(() => 0));

  /* ================= Count Animation ================= */
  useEffect(() => {
    if (!inView) return;

    const start = performance.now();
    const duration = 900;

    const animate = (time) => {
      const elapsed = time - start;

      setValues(
        cards.map((card, i) => {
          const delay = i * 80;
          const progress = Math.min(
            Math.max((elapsed - delay) / duration, 0),
            1
          );

          const eased = 1 - Math.pow(1 - progress, 3);

          return card.id === 'out-stock'
            ? Number((card.value * eased).toFixed(1))
            : Math.round(card.value * eased);
        })
      );

      if (elapsed < duration + cards.length * 80) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView]);

  return  (
  <div
    ref={ref}
    className="
      px-3 py-2.5
      bg-white/90 backdrop-blur-2xl
      border border-gray-200/70
      rounded-2xl sm:rounded-xl
      shadow-[0_1px_1px_rgba(0,0,0,0.04)]
    "
  >
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold text-gray-900">
          Products Status
        </h2>
        <p className="text-[11px] text-gray-500">{range}</p>
      </div>

      {/* ===== Enterprise Compact Status Grid (No Scroll) ===== */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
  {cards.map((card, i) => (
    <div
      key={card.id}
      className="
        relative
        px-3 py-2
        rounded-xl
        bg-white/70
        backdrop-blur-xl
        border border-gray-200/60
        shadow-[0_1px_1px_rgba(0,0,0,0.04)]
        transition-all
      "
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(4px)',
        transitionDelay: `${i * 30}ms`,
      }}
    >
      {/* Subtle top glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Value */}
      <div className="text-[16px] font-semibold text-gray-900 tabular-nums leading-none">
        {card.id === 'out-stock'
          ? values[i].toFixed(1)
          : values[i]}
      </div>

      {/* Label */}
      <div className="flex items-center gap-1.5 mt-1">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{
            backgroundColor: card.color,
            boxShadow: `0 0 6px ${card.color}55`,
          }}
        />
        <span className="text-[11px] text-gray-600 truncate">
          {card.title}
        </span>
      </div>
    </div>
  ))}
</div>

    </div>
  </div>
);


}

export default AnalyticsStatus;
