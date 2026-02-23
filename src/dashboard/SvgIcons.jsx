import React from "react";

/* ================= BASE WRAPPER ================= */

const IconBase = ({ children, className = "w-5 h-5", ...props }) => (
  <svg
    viewBox="0 0 512 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {children}
  </svg>
);


const IconBase24 = ({ children, className = "", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

/* ================= ICONS ================= */

/*  STAR */
export const FaStar = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <path d="
      M12 2.8
      C12.3 2.8 12.6 3 12.7 3.3
      L15 8.1
      L20.2 8.8
      C20.9 8.9 21.2 9.7 20.7 10.2
      L16.9 13.8
      L17.9 19
      C18 19.7 17.3 20.2 16.7 19.9
      L12 17.4
      L7.3 19.9
      C6.7 20.2 6 19.7 6.1 19
      L7.1 13.8
      L3.3 10.2
      C2.8 9.7 3.1 8.9 3.8 8.8
      L9 8.1
      L11.3 3.3
      C11.4 3 11.7 2.8 12 2.8
      Z
    " />
  </svg>
);

/*  TAGS */
export const FaTags = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.3c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5V80C0 53.5 21.5 32 48 32H197.5c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32z" />
  </IconBase>
);


export const IconChevronUp = ({ className }) => (
  <IconBase className={className}>
    <path d="M6 15l6-6 6 6" />
  </IconBase>
);


/* 👁 EYE */
export const FaEye = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);



/*  SIGN OUT */
export const FaSignOutAlt = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64zM473 233L361 121c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l71 71L136 226c-13.3 0-24 10.7-24 24s10.7 24 24 24h262.1l-71 71c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L473 271c9.4-9.4 9.4-24.6 0-33.9z" />
  </IconBase>
);
/*  SHOPPING CART */
export const FaShoppingCart = (props) => (
  <IconBase {...props}>
    <path d="M528.12 301.319l47.273-208A24 24 0 00552 64H128l-9.4-47.2A24 24 0 0095.2 0H24A24 24 0 000 24v16a24 24 0 0024 24h45.6l70.4 352A48 48 0 00187.2 464H456a24 24 0 0024-24v-16a24 24 0 00-24-24H187.2l-8.6-43h312.2a24 24 0 0023.4-18.681zM208 480a32 32 0 1032 32 32 32 0 00-32-32zm256 0a32 32 0 1032 32 32 32 0 00-32-32z" />
  </IconBase>
);


/* SAME AS USERS */
export const FaUserFriends = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="
      M320 256
      a96 96 0 1 0 0-192
      a96 96 0 1 0 0 192
      z

      M192 464
      c0-88 72-144 160-144
      s160 56 160 144
      v16
      H192
      z

      M128 240
      a72 72 0 1 0 0-144
      a72 72 0 1 0 0 144
      z

      M0 464
      c0-72 64-120 136-120
      c24 0 46 5 66 14
      c-34 26-50 64-50 106
      v16
      H0
      z
    " />
  </IconBase>
);



/* 💬 COMMENT */
export const FaCommentDots = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    {/* Bubble */}
    <path d="
      M12 3
      C6.5 3 3 6.4 3 10.5
      C3 13 4.5 15.2 7 16.4
      L6.2 19.5
      C6.1 19.9 6.5 20.2 6.9 20
      L10.3 18.3
      C10.9 18.4 11.4 18.5 12 18.5
      C17.5 18.5 21 15.1 21 11
      C21 6.9 17.5 3 12 3
      Z
    " />

    {/* Dots */}
    <circle cx="8.5" cy="10.5" r="1.2" fill="white" />
    <circle cx="12" cy="10.5" r="1.2" fill="white" />
    <circle cx="15.5" cy="10.5" r="1.2" fill="white" />
  </svg>
);

/* ⬇ DOWNLOAD */
export const FaDownload = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="
      M256 48
      c13 0 24 11 24 24
      v176
      h72
      c21 0 32 25 17 40
      l-113 113
      c-9 9-24 9-33 0
      l-113-113
      c-15-15-4-40 17-40
      h72
      V72
      c0-13 11-24 24-24
      z

      M80 368
      h352
      c17 0 32 15 32 32
      v64
      H48
      v-64
      c0-17 15-32 32-32
      z

      M352 432
      a16 16 0 1 0 0-32
      a16 16 0 1 0 0 32
      z

      M400 432
      a16 16 0 1 0 0-32
      a16 16 0 1 0 0 32
      z
    " />
  </IconBase>
);


export const FaBell = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M256 512c35.3 0 64-28.7 64-64H192c0 35.3 28.7 64 64 64zm215.4-149.4c-19.8-20.4-55.4-51.7-55.4-154.6 
    0-77.7-54.5-139.3-128-155.2V32c0-17.7-14.3-32-32-32s-32 
    14.3-32 32v20.8C150.5 68.7 96 130.3 96 
    208c0 102.9-35.6 134.2-55.4 154.6C35.1 368.3 32 
    375.4 32 384c0 17.7 14.3 32 32 32h384c17.7 
    0 32-14.3 32-32 0-8.6-3.1-15.7-8.6-21.4z" />
  </IconBase>
);

export const IconPhoneModern = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="
        M6.4 3.8
        C6 3.4 5.3 3.4 4.9 3.8
        L3.6 5.1
        C2.7 6 2.5 7.3 3.1 8.5
        C4.9 12.4 7.6 15.1 11.5 16.9
        C12.7 17.5 14 17.3 14.9 16.4
        L16.2 15.1
        C16.6 14.7 16.6 14 16.2 13.6
        L13.9 11.3
        C13.5 10.9 12.9 10.8 12.4 11.1
        L10.9 12
        C9.4 11.2 7.8 9.6 7 8.1
        L7.9 6.6
        C8.2 6.1 8.1 5.5 7.7 5.1
        L6.4 3.8
        Z
      "
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export const IconDelete = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <path d="
      M9 3.5
      H15
      C15.6 3.5 16 3.9 16 4.5
      V5.5
      H20
      C20.6 5.5 21 5.9 21 6.5
      C21 7.1 20.6 7.5 20 7.5
      H4
      C3.4 7.5 3 7.1 3 6.5
      C3 5.9 3.4 5.5 4 5.5
      H8
      V4.5
      C8 3.9 8.4 3.5 9 3.5
      Z

      M6 9
      V18
      C6 19.1 6.9 20 8 20
      H16
      C17.1 20 18 19.1 18 18
      V9
      H6
      Z

      M10 11
      C10.6 11 11 11.4 11 12
      V17
      C11 17.6 10.6 18 10 18
      C9.4 18 9 17.6 9 17
      V12
      C9 11.4 9.4 11 10 11
      Z

      M14 11
      C14.6 11 15 11.4 15 12
      V17
      C15 17.6 14.6 18 14 18
      C13.4 18 13 17.6 13 17
      V12
      C13 11.4 13.4 11 14 11
      Z
    " />
  </svg>
);
/* ⌄ CHEVRON DOWN */
export const FaChevronDown = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="
      M98 178
      c-9-9-9-23 0-32
      s23-9 32 0
      l126 126
      l126-126
      c9-9 23-9 32 0
      s9 23 0 32
      l-142 142
      c-9 9-23 9-32 0
      z
    " />
  </IconBase>
);

export const IconBills = ({ className = "" }) => (
  <IconBase className={className}>
    {/* Card Outline */}
    <rect
      x="64"
      y="112"
      width="384"
      height="288"
      rx="64"
      fill="none"
      stroke="currentColor"
      strokeWidth="48"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Top Stripe */}
    <line
      x1="64"
      y1="192"
      x2="448"
      y2="192"
      stroke="currentColor"
      strokeWidth="48"
      strokeLinecap="round"
    />

    {/* Bottom Small Left Line */}
    <line
      x1="160"
      y1="304"
      x2="224"
      y2="304"
      stroke="currentColor"
      strokeWidth="40"
      strokeLinecap="round"
    />

    {/* Bottom Small Right Line */}
    <line
      x1="288"
      y1="304"
      x2="384"
      y2="304"
      stroke="currentColor"
      strokeWidth="40"
      strokeLinecap="round"
    />
  </IconBase>
);
/* ================= ICONS ================= */

export const FaPlus = ({ className = "" }) => (
  <IconBase24 className={className}>
    <path d="M11 4h2v16h-2zM4 11h16v2H4z" />
  </IconBase24>
);


/* ❌ TIMES (CLOSE) */
export const FaTimes = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

/* 🛍 SHOPPING BAG */
export const FaShoppingBag = ({ className = "" }) => (
  <IconBase24 className={className}>
    <path d="M6 7V6a6 6 0 0112 0v1h3v14H3V7h3zm2 0h8V6a4 4 0 00-8 0v1z"/>
  </IconBase24>
);






/* 📢 BULLHORN (Clean Modern) */
export const FaBullhorn = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 11v2" />
    <path d="M5 10l10-4v12l-10-4z" />
    <path d="M15 10h3v4h-3" />
  </svg>
);




/* ✏ EDIT — Filled Square Style */
export const FaEdit = ({ className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75 1.84-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
      fill="currentColor"
    />
    <path
      d="M4 21h16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);


/*  CROWN */
export const FaCrown = ({ className = "" }) => (
  <IconBase24 className={className}>
    <path d="M2 7l5 5 5-8 5 8 5-5v10H2z" />
  </IconBase24>
);




/* 🛒 CART ARROW DOWN */
export const FaCartArrowDown = ({ className = "" }) => (
  <FaShoppingCart className={className} />
);

/* 🛒 CART PLUS */
export const FaCartPlus = ({ className = "" }) => (
  <FaShoppingCart className={className} />
);






/*  CALENDAR */

/* 📅 CALENDAR — Exact Outline Style */
export const FaCalendarAlt = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Outer rounded box */}
    <rect x="3" y="4" width="18" height="18" rx="4" />

    {/* Top rings */}
    <line x1="8" y1="2.5" x2="8" y2="6" />
    <line x1="16" y1="2.5" x2="16" y2="6" />

    {/* Divider line */}
    <line x1="3" y1="9" x2="21" y2="9" />
  </svg>
);



/* % PERCENT */
export const FaPercent = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <path d="M6 18L18 6" />
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

export const FaHistory = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <polyline points="3 3 3 9 9 9" />
    <path d="M12 7v5l4 2" />
  </svg>
);





export default function SvgIcons() {
  return null;
}