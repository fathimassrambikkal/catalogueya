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


export const ClockIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </IconBase>
);


export const LogoutIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </IconBase>
);


export const UnmuteIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <path d="M15 9a5 5 0 0 1 0 6" />
    <path d="M19 7a9 9 0 0 1 0 10" />
  </IconBase>
);

export const MuteIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </IconBase>
);

export const ReadAllIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <path d="M3 12l4 4 6-6" />
    <path d="M13 12l4 4 4-4" />
  </IconBase>
);


export const IconBills = ({ className }) => (
  <IconBase className={className}>
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
  </IconBase>
);




export const GlobeIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 0 20a15.3 15.3 0 0 1 0-20z" />
  </IconBase>
);
export const HeartIcon = ({ className = "" }) => (
  <svg 
    className={className} 
    viewBox="0 0 512 512" 
    fill="currentColor"
    stroke="none"
    strokeWidth="0"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
  >
    <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
  </svg>
);

export const ChatIcon = ({ className = "" }) => (
  <svg 
    className={className} 
    viewBox="0 0 576 512" 
    fill="currentColor"
    stroke="none"
    strokeWidth="0"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
  >
    <path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z" />
  </svg>
);

export const BellIcon = ({ className = "" }) => (
  <svg 
    className={className} 
    viewBox="0 0 448 512" 
    fill="currentColor"
    stroke="none"
    strokeWidth="0"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
  >
    <path d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z" />
  </svg>
);

export const StarIcon = ({ className = "" }) => (
  <svg 
    className={className} 
    viewBox="0 0 576 512" 
    fill="currentColor"
    stroke="none"
    strokeWidth="0"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
  >
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
  </svg>
);

export const UserPlusIcon = ({ className = "" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    stroke="none"
    strokeWidth="0"
    shapeRendering="geometricPrecision"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
  >
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3.5 20c0-3.2 2.6-5.8 5.8-5.8h1.4c3.2 0 5.8 2.6 5.8 5.8H3.5z" />
    <rect x="16.25" y="6.5" width="1.5" height="7" rx="0.75" />
    <rect x="13.5" y="9.25" width="7" height="1.5" rx="0.75" />
  </svg>
);

export const CogIcon = ({ className = "" }) => (
  <svg 
    className={className} 
    viewBox="0 0 512 512" 
    fill="currentColor"
    stroke="none"
    strokeWidth="0"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
  >
    <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
  </svg>
);

export const HelpIcon = ({ className = "" }) => (
  <svg 
    className={className} 
    viewBox="0 0 512 512" 
    fill="currentColor"
    stroke="none"
    strokeWidth="0"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
  >
    <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z" />
  </svg>
);





/* =====================================================
   Search / Filter / More
===================================================== */

export const SearchIcon = ({ className = "" }) => (
  <IconBase className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
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
  CheckCircleIcon,
  IconBills,
  GlobeIcon,
  HeartIcon,
  ChatIcon,
  BellIcon,
  StarIcon,
  UserPlusIcon,
  CogIcon,
  HelpIcon,
  LogoutIcon,
  SearchIcon,
 


};