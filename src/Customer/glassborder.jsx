import React from "react";

/**
 * GlassBorder
 * Global reusable Apple-style glass container
 */
export default function GlassBorder({
  children,
  className = "",
  as: Component = "div",
}) {
  return (
    <Component
      className={`
        bg-white/95 backdrop-blur-xl
        rounded-xl sm:rounded-2xl
        border border-white/80

        shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)]
        hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.06)]

        transition-all duration-300
        overflow-hidden

        ${className}
      `}
    >
      {children}
    </Component>
  );
}
