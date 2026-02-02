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
   Base Styles (Apple style)
   ========================= */
const baseClass = `
 absolute
  left-4 sm:left-8 top-24
 z-10

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
const BackButton = memo(({ to = -1, onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={handleClick}
      className={`${baseClass} ${className}`}
    >
      <ArrowLeftIcon className="text-gray-700 transform-gpu" />
    </button>
  );
});

BackButton.displayName = "BackButton";

export default BackButton;
