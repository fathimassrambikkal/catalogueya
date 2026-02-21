import React from "react";



const IconBase = ({ className = "w-5 h-5", children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* ===============================
   Navigation / Action Icons
================================ */

export const BackIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M14 6l-6 6 6 6" />
  </IconBase>
);

export const PlusIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </IconBase>
);

export const DeleteIcon = ({ className = "" }) => (
  <IconBase
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Lid */}
    <path d="M4 7h16" />
    <path d="M9 7V5h6v2" />

    {/* Bin */}
    <path d="M7 7l.7 12a2 2 0 0 0 2 2h4.6a2 2 0 0 0 2-2L17 7" />

    {/* Inner lines */}
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </IconBase>
);



/* ===============================
   Company / Billing Icons
================================ */

export const IconCreate = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </IconBase>
);

export const IconPending = ({ className }) => (
  <IconBase className={className}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 10h8" />
    <path d="M8 14h5" />
  </IconBase>
);

export const IconPast = ({ className }) => (
  <IconBase className={className}>
    <path d="M7 3.8h7l4.2 4.2V19a1.8 1.8 0 01-1.8 1.8H7A1.8 1.8 0 015.2 19V5.6A1.8 1.8 0 017 3.8z" />
    <path d="M14 3.8V8h4.2" />
  </IconBase>
);

export const IconDraft = ({ className }) => (
  <IconBase className={className}>
    <path d="M16 4.2a2.2 2.2 0 013.1 3.1L8.2 18l-4 1 1-4 10.8-10.8z" />
    <path d="M12 20h7" />
  </IconBase>
);

export const IconBank = ({ className }) => (
  <IconBase className={className}>
    {/* Roof */}
    <path d="M3 10l9-5 9 5" />
    {/* Beam */}
    <path d="M4 10h16" />
    {/* Columns */}
    <path d="M6 10v8" />
    <path d="M10 10v8" />
    <path d="M14 10v8" />
    <path d="M18 10v8" />
    {/* Base */}
    <path d="M4 18h16" />
  </IconBase>
);

export const IconUnpaid = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12h7" />
  </IconBase>
);

/* ===============================
   UI / Status Icons
================================ */
export const IconView = ({ className }) => (
  <IconBase className={className}>
    {/* Eye outline – smooth Bezier curves */}
    <path
      d="
        M3 12
        C5.5 8.5 8.8 7 12 7
        C15.2 7 18.5 8.5 21 12
        C18.5 15.5 15.2 17 12 17
        C8.8 17 5.5 15.5 3 12
        Z
      "
    />
    {/* Pupil – optically centered */}
    <circle cx="12" cy="12" r="2.5" />
  </IconBase>
);


export const IconInvoice = ({ className }) => (
  <IconBase className={className}>
    <path d="M7 3.8h7l4.2 4.2V19a1.8 1.8 0 01-1.8 1.8H7A1.8 1.8 0 015.2 19V5.6A1.8 1.8 0 017 3.8z" />
    <path d="M14 3.8V8h4.2" />
    <path d="M8.5 12h7" />
    <path d="M8.5 16h5" />
  </IconBase>
);

export const IconSuccess = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" />
  </IconBase>
);

export const IconCalendar = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 11h18" />
  </IconBase>
);

/* ===============================
   UI / Status Icons
================================ */



/* Refresh / Reload */
export const IconRefresh = ({ className }) => (
  <IconBase className={className}>
    <path d="M21 12a9 9 0 10-3.2 6.9" />
    <path d="M21 5v7h-7" />
  </IconBase>
);

/* Warning (Exclamation Circle) */
export const IconWarning = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6" />
    <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
  </IconBase>
);

/* Error (Times / X Circle) */
export const IconError = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6" />
    <path d="M15 9l-6 6" />
  </IconBase>
);
export const IconEdit = ({ className = "" }) => (
  <IconBase className={className}>
    {/* Pencil body */}
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" />

    {/* Pencil underline (FaEdit style) */}
    <path d="M12 20h9" />
  </IconBase>
);
export const IconTags = ({ className }) => (
  <IconBase className={className}>
    {/* Tag body */}
    <path d="M3 12l9-9h6l3 3v6l-9 9L3 12z" />
    {/* Hole */}
    <circle cx="15" cy="6" r="1.3" />
  </IconBase>
);

export const IconShoppingCart = ({ className }) => (
  <IconBase className={className}>
    {/* Cart basket */}
    <path d="M3 4h2l2.4 10.5a2 2 0 0 0 2 1.5h7.6a2 2 0 0 0 2-1.5L21 8H7" />
    {/* Wheels */}
    <circle cx="10" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
  </IconBase>
);

export const IconAnalytics = ({ className }) => (
  <IconBase className={className}>
    {/* Axes */}
    <path d="M4 19h16" />
    <path d="M4 5v14" />

    {/* Line chart */}
    <path d="M6 15l4-4 3 3 5-6" />
    
    {/* Data points */}
    <circle cx="6" cy="15" r="1" />
    <circle cx="10" cy="11" r="1" />
    <circle cx="13" cy="14" r="1" />
    <circle cx="18" cy="8" r="1" />
  </IconBase>
);

export const IconMessages = ({ className }) => (
  <IconBase className={className}>
    {/* Envelope body */}
    <rect x="3" y="5" width="18" height="14" rx="2" />

    {/* Flap */}
    <path d="M3 7l9 6 9-6" />
  </IconBase>
);

export const IconContacts = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="8" r="3" />
    <path d="M4 20c0-4 16-4 16 0" />
  </IconBase>
);
export const IconFollowers = ({ className }) => (
  <IconBase className={className}>
    {/* Left user */}
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3 6-3 6-3" />

    {/* Right user */}
    <circle cx="15" cy="8" r="3" />
    <path d="M15 17s6 0 6 3" />
  </IconBase>
);

export const IconNotifications = ({ className }) => (
  <IconBase className={className}>
    {/* Bell body */}
    <path d="M18 16V11a6 6 0 00-12 0v5" />
    <path d="M5 16h14" />

    {/* Bell clapper */}
    <path d="M10 20a2 2 0 004 0" />
  </IconBase>
);

export const IconBills = ({ className }) => (
  <IconBase className={className}>
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
  </IconBase>
);

export const IconSettings = ({ className }) => (
  <IconBase className={className}>
    {/* Center gear */}
    <circle cx="12" cy="12" r="3" />

    {/* Gear teeth */}
    <path d="M12 2v2" />
    <path d="M12 20v2" />

    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />

    <path d="M2 12h2" />
    <path d="M20 12h2" />

    <path d="M4.93 19.07l1.41-1.41" />
    <path d="M17.66 6.34l1.41-1.41" />
  </IconBase>
);

export const IconDownload = ({ className }) => (
  <IconBase className={className}>
    {/* Arrow */}
    <path d="M12 3v12" />
    <path d="M8 11l4 4 4-4" />

    {/* Base line */}
    <path d="M4 21h16" />
  </IconBase>
);

export const IconSend = ({ className }) => (
  <IconBase className={className}>
    {/* Plane body */}
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </IconBase>
);
export const IconLogout = ({ className }) => (
  <IconBase className={className}>
    {/* Door */}
    <path d="M5 3h7v18H5a2 2 0 01-2-2V5a2 2 0 012-2z" />

    {/* Arrow */}
    <path d="M12 12h8" />
    <path d="M17 9l3 3-3 3" />
  </IconBase>
);


export const IconChevronDown = ({ className }) => (
  <IconBase className={className}>
    <path d="M6 9l6 6 6-6" />
  </IconBase>
);

export const IconChevronUp = ({ className }) => (
  <IconBase className={className}>
    <path d="M6 15l6-6 6 6" />
  </IconBase>
);
/* ===============================
   UI / Action Icons
================================ */

export const IconClose = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);
