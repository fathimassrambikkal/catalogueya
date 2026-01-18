import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

/* =========================
   Arrow Icon (Shared)
   ========================= */
const ArrowLeftIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

/* =========================
   STYLE VARIANTS
   ========================= */
const styles = {
  fixed: `
    fixed
    top-[calc(env(safe-area-inset-top)+16px)]
    left-4 sm:left-8
    z-[60]
  `,
  absolute: `
    absolute
    top-20
    left-4 sm:left-8
    z-30
  `,
};

const baseClass = `
  p-2
  rounded-full
  bg-white/60
  backdrop-blur-xl
  border border-white/50
  shadow-[0_8px_24px_rgba(0,0,0,0.18)]
  hover:bg-white/70
  hover:scale-110
  transition-all duration-300
  transform-gpu
  active:scale-95
`;

/* =========================
   Back Button Component
   ========================= */
const BackButton = memo(
  ({
    to = -1,
    onClick,
    variant = "fixed", // 👈 DEFAULT
    className = "",
  }) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
      e.stopPropagation();
      if (onClick) return onClick(e);
      navigate(to);
    };

    return (
      <button
        onClick={handleClick}
        aria-label="Go back"
        className={`${styles[variant]} ${baseClass} ${className}`}
      >
        <ArrowLeftIcon className="text-gray-700 transform-gpu" />
      </button>
    );
  }
);

BackButton.displayName = "BackButton";

export default BackButton;
