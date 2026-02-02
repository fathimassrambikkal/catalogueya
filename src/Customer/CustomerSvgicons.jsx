import React from "react";

const IconBase = ({ children, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

/* =====================================================
   Navigation & Actions
===================================================== */

export const ArrowLeftIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M15 18l-6-6 6-6" />
  </IconBase>
);

export const ChevronRightIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M9 18l6-6-6-6" />
  </IconBase>
);

export const ChevronDownIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M6 9l6 6 6-6" />
  </IconBase>
);

export const CloseIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </IconBase>
);

export const CheckIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M20 6L9 17l-5-5" />
  </IconBase>
);

/* =====================================================
   Payment Icons (Premium Apple-style)
===================================================== */

export const AppleLogoIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M17.05 20.28c-1.45.97-2.68 1.72-3.6 1.72-.96 0-1.58-.46-2.4-.46-.83 0-1.53.46-2.4.46-.94 0-2.25-.8-3.68-1.8-1.64-1.16-2.97-3.04-2.97-5.32 0-2.36 1.27-4.1 2.88-5.32 1.34-1.03 2.9-1.6 4.37-1.6.96 0 1.86.34 2.6.34.67 0 1.5-.34 2.6-.34 1.24 0 2.6.46 3.82 1.4-1.53 1.9-1.3 4.76.5 5.96-.38.24-.87.56-1.3.56-.36 0-.8-.3-1.3-.3-.52 0-1 .3-1.3.3-.43 0-.93-.34-1.33-.6-1.3-.84-1.97-2.14-1.97-3.74 0-2.58 1.77-4.6 4.4-4.6.36 0 .73.04 1.1.12-.4 1.1-.6 2.37-.6 3.74 0 1.37.2 2.64.6 3.74.32.9.76 1.7 1.32 2.4-.2.14-.4.26-.6.36z" />
  </IconBase>
);

export const CreditCardIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <rect x="4" y="6" width="16" height="12" rx="1.5" />
    <line x1="4" y1="10" x2="20" y2="10" />
  </IconBase>
);

export const CashIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <rect
      x="3"
      y="6"
      width="18"
      height="12"
      rx="2.5"
    />
    <circle
      cx="15.5"
      cy="12"
      r="1.5"
    />
    <path d="M3 9.5h4" />
  </IconBase>
);






export const PlusCircleIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </IconBase>
);

export const WalletIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M17 10h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
    <circle cx="15" cy="12" r="2" />
  </IconBase>
);

/* =====================================================
   User & Location Icons
===================================================== */

export const LocationIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M12 21s-7-4.5-7-9.5a7 7 0 1 1 14 0c0 5-7 9.5-7 9.5z" />
    <circle cx="12" cy="11" r="3" />
  </IconBase>
);

export const MailIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 8l9 6 9-6" />
  </IconBase>
);

export const PhoneIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </IconBase>
);

export const UserIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <circle cx="12" cy="7" r="4" />
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  </IconBase>
);

/* =====================================================
   Status & Indicators
===================================================== */

export const InfoIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </IconBase>
);

export const WarningIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M12 9v4m0 4h.01M12 2l10 20H2L12 2z" />
  </IconBase>
);

export const CheckCircleIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </IconBase>
);

/* =====================================================
   Default Export for convenience
===================================================== */

export default {
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CloseIcon,
  CheckIcon,
  AppleLogoIcon,
  CreditCardIcon,
  CashIcon,
  PlusCircleIcon,
  WalletIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  InfoIcon,
  WarningIcon,
  CheckCircleIcon
};