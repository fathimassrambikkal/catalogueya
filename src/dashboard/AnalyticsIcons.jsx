import React from "react";


const baseProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/* ===================== PRODUCT ===================== */

export const ProductIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <line x1="4" y1="10" x2="20" y2="10" />
  </svg>
);

/* ===================== VIEWS ===================== */

export const ViewsIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M2 12c1.8-3.5 5.8-6 10-6s8.2 2.5 10 6c-1.8 3.5-5.8 6-10 6s-8.2-2.5-10-6z" />
    <circle cx="12" cy="12" r="2.2" />
  </svg>
);

/* ===================== FOLLOWERS ===================== */
/* Minimal silhouette */
export const FollowersIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 10c2.2 0 4-1.8 4-4S14.2 2 12 2 8 3.8 8 6s1.8 4 4 4z" />
    <path d="M4 21c0-3.6 5.4-5.5 8-5.5s8 1.9 8 5.5" />
  </svg>
);



/* ===================== FAVOURITE ===================== */

export const HeartIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 21l-6.8-7.2a4 4 0 0 1 0-5.6 4 4 0 0 1 5.6 0L12 9.4l1.2-1.2a4 4 0 0 1 5.6 0 4 4 0 0 1 0 5.6L12 21z" />
  </svg>
);

/* ===================== REVIEWS ===================== */

export const ReviewIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="4" y="5" width="16" height="12" rx="2" />
    <line x1="7" y1="9" x2="17" y2="9" />
    <line x1="7" y1="13" x2="14" y2="13" />
  </svg>
);


/* ===================== SHARES ===================== */
/* Minimal export arrow */
export const ShareIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M7 17l10-10" />
    <path d="M11 7h6v6" />
  </svg>
);

/* ===================== STAR ===================== */

export const StarIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9L12 2.5z" />
  </svg>
);
/* ===================== LIKE ===================== */

export const LikeIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M7 11v9" />
    <path d="M3 11h4v9H3z" />
    <path d="M7 11l4-8c.4-.8 1.6-.6 1.6.3V11h5.3c1 0 1.7.9 1.5 1.9l-1.2 6c-.2.8-.9 1.1-1.7 1.1H7" />
  </svg>
);
/* ===================== SOLD ===================== */


export const SoldIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M6 8V6a6 6 0 0 1 12 0v2" />
    <rect x="4" y="8" width="16" height="13" rx="2" />
    <path d="M9 12h6" />
  </svg>
);
/* ===================== INFO ===================== */
/* Clean info circle */

export const InfoIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 10v6" />
    <circle cx="12" cy="7" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
