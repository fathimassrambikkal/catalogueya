import React from "react";
import VisaCard from "../components/VisaCard";
import { BackIcon } from "./CompanySvg";

export default function SettingsBillingPage({ onBack }) {
  // Minimal Download Icon SVG
  const DownloadIcon = () => (
    <svg 
      className="w-[clamp(0.75rem,0.9vw,1rem)] h-[clamp(0.75rem,0.9vw,1rem)]" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      strokeWidth="2"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );

  return (
    <div className="min-h-screen w-full p-[clamp(0.25rem,1vw,1.5rem)] bg-gradient-to-b from-gray-50 via-white to-gray-50/30 ">
      {/* Header with Back Button */}
      <div className="mb-[clamp(1rem,2vw,2.5rem)] mt-20">
        <div className="flex items-center gap-[clamp(0.25rem,0.5vw,0.75rem)] mb-[clamp(0.75rem,1.25vw,1.5rem)] ">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-[clamp(0.75rem,0.85vw,0.875rem)] text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1 -ml-1 rounded-lg hover:bg-gray-100/50"
              aria-label="Back to settings"
            >
              <BackIcon className="w-[clamp(0.875rem,1vw,1.125rem)] h-[clamp(0.875rem,1vw,1.125rem)]" />
             Back
            </button>
          )}
        </div>
        
        <div className="max-w-[1920px] mx-auto">
          <h1 className="text-[clamp(1.25rem,2vw,2.25rem)] font-semibold text-gray-900 tracking-[-0.01em] leading-tight">
            Billing
          </h1>
          <p className="text-gray-600/90 mt-[clamp(0.25rem,0.5vw,0.75rem)] text-[clamp(0.875rem,1vw,1.125rem)] leading-relaxed max-w-3xl">
            Manage your subscription, view payment history, and update billing details.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1920px] mx-auto space-y-[clamp(1rem,1.5vw,2rem)]">
        {/* Subscription & Usage Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(0.75rem,1.25vw,1.5rem)]">
          {/* Current Plan Card */}
          <div className="
            bg-white/80 backdrop-blur-lg 
            rounded-[clamp(1rem,1.25vw,1.5rem)] border border-white/60 
            shadow-[0_4px_16px_rgba(0,0,0,0.04)]
            p-[clamp(0.75rem,1.25vw,1.5rem)]
            hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]
            transition-all duration-300
            relative overflow-hidden
            before:absolute before:inset-0 
            before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-white/20
            before:-z-10
          ">
            <div className="flex flex-col h-full">
              {/* Header with Active Badge */}
              <div className="flex items-center justify-between mb-[clamp(0.75rem,1vw,1.25rem)]">
                <h2 className="font-semibold text-gray-900 text-[clamp(0.875rem,1.125vw,1.25rem)] tracking-tight">
                  Current Plan
                </h2>
                <span className="
                  text-[clamp(0.6875rem,0.75vw,0.75rem)] 
                  font-medium text-emerald-600 
                  bg-emerald-50/80 backdrop-blur-sm
                  px-[clamp(0.5rem,0.75vw,0.875rem)] 
                  py-[clamp(0.125rem,0.25vw,0.25rem)]
                  rounded-full border border-emerald-100
                ">
                  Active
                </span>
              </div>

              <div className="flex-grow flex flex-col">
                {/* Plan Price and Info */}
                <div className="mb-[clamp(1rem,1.5vw,2rem)]">
                  <div className="flex items-baseline gap-[clamp(0.125rem,0.25vw,0.375rem)]">
                    <div className="
                      text-[clamp(1.5rem,2.5vw,3rem)] 
                      font-semibold text-gray-900 
                      tracking-[-0.02em]
                      leading-none
                    ">
                      QAR 105
                    </div>
                    <div className="
                      text-gray-600/80 
                      text-[clamp(0.875rem,1vw,1.125rem)]
                      ml-[clamp(0.125rem,0.25vw,0.375rem)]
                    ">
                      /month
                    </div>
                  </div>
                  <p className="
                    text-gray-600/80 
                    text-[clamp(0.75rem,0.875vw,0.875rem)] 
                    mt-[clamp(0.25rem,0.5vw,0.75rem)]
                    leading-relaxed
                  ">
                    Pro Plan • Next billing: Sep 01, 2025
                  </p>
                </div>

                {/* Buttons - Stacked on mobile, right-aligned on desktop */}
                <div className="
                  mt-auto
                  flex flex-col xs:flex-row 
                  gap-[clamp(0.5rem,0.75vw,1rem)]
                  sm:justify-end
                ">
                  <button className="
                    px-[clamp(0.875rem,1.25vw,1.5rem)] 
                    py-[clamp(0.5rem,0.75vw,0.875rem)]
                    rounded-[clamp(0.75rem,1vw,1.125rem)] 
                    bg-gradient-to-r from-blue-600 to-blue-500
                    text-white 
                    text-[clamp(0.75rem,0.875vw,0.875rem)] 
                    font-medium 
                    hover:shadow-lg
                    hover:shadow-blue-500/20
                    transition-all duration-200
                    active:scale-[0.98]
                    flex-1 sm:flex-none
                    sm:order-2
                  ">
                    Upgrade Plan
                  </button>
                  <button className="
                    px-[clamp(0.875rem,1.25vw,1.5rem)] 
                    py-[clamp(0.5rem,0.75vw,0.875rem)]
                    rounded-[clamp(0.75rem,1vw,1.125rem)] 
                    border border-gray-300/80 
                    text-gray-700 
                    text-[clamp(0.75rem,0.875vw,0.875rem)] 
                    font-medium 
                    hover:bg-gray-50/50
                    hover:border-gray-400/50
                    transition-all duration-200
                    active:scale-[0.98]
                    flex-1 sm:flex-none
                    sm:order-1
                  ">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Summary Card */}
          <div className="
            bg-white/80 backdrop-blur-lg 
            rounded-[clamp(1rem,1.25vw,1.5rem)] border border-white/60 
            shadow-[0_4px_16px_rgba(0,0,0,0.04)]
            p-[clamp(0.75rem,1.25vw,1.5rem)]
            hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]
            transition-all duration-300
            relative overflow-hidden
            before:absolute before:inset-0 
            before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-white/20
            before:-z-10
          ">
            <h2 className="
              font-semibold text-gray-900 
              text-[clamp(0.875rem,1.125vw,1.25rem)] 
              tracking-tight
              mb-[clamp(1rem,1.5vw,2rem)]
            ">
              Usage Summary
            </h2>

            <div className="space-y-[clamp(1rem,1.5vw,2rem)]">
              {/* API Usage */}
              <div>
                <div className="
                  flex justify-between 
                  text-[clamp(0.75rem,0.875vw,0.875rem)] 
                  mb-[clamp(0.5rem,0.75vw,1rem)]
                ">
                  <span className="text-gray-700 font-medium">API Requests</span>
                  <span className="text-gray-900 font-semibold">8,500 / 10,000</span>
                </div>
                <div className="
                  h-[clamp(0.375rem,0.5vw,0.625rem)] 
                  rounded-full 
                  bg-gray-200/50 
                  overflow-hidden
                  backdrop-blur-sm
                ">
                  <div 
                    className="
                      h-full 
                      bg-gradient-to-r from-blue-500/90 to-blue-600/90 
                      rounded-full 
                      transition-all duration-700 ease-out
                    "
                    style={{ width: '85%' }}
                  />
                </div>
                <p className="
                  text-gray-600/80 
                  text-[clamp(0.6875rem,0.75vw,0.75rem)] 
                  mt-[clamp(0.25rem,0.5vw,0.75rem)]
                ">
                  85% of monthly limit used
                </p>
              </div>

              {/* Storage Usage */}
              <div>
                <div className="
                  flex justify-between 
                  text-[clamp(0.75rem,0.875vw,0.875rem)] 
                  mb-[clamp(0.5rem,0.75vw,1rem)]
                ">
                  <span className="text-gray-700 font-medium">Storage</span>
                  <span className="text-gray-900 font-semibold">2 GB / 5 GB</span>
                </div>
                <div className="
                  h-[clamp(0.375rem,0.5vw,0.625rem)] 
                  rounded-full 
                  bg-gray-200/50 
                  overflow-hidden
                  backdrop-blur-sm
                ">
                  <div 
                    className="
                      h-full 
                      bg-gradient-to-r from-sky-500/90 to-blue-500/90 
                      rounded-full 
                      transition-all duration-700 ease-out
                    "
                    style={{ width: '40%' }}
                  />
                </div>
                <p className="
                  text-gray-600/80 
                  text-[clamp(0.6875rem,0.75vw,0.75rem)] 
                  mt-[clamp(0.25rem,0.5vw,0.75rem)]
                ">
                  40% of storage used
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History Card */}
        <div className="
          bg-white/80 backdrop-blur-lg 
          rounded-[clamp(1rem,1.25vw,1.5rem)] border border-white/60 
          shadow-[0_4px_16px_rgba(0,0,0,0.04)]
          hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]
          transition-all duration-300
          overflow-hidden
          relative
          before:absolute before:inset-0 
          before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-white/20
          before:-z-10
        ">
          {/* Card Header */}
          <div className="
            flex flex-col lg:flex-row 
            justify-between items-start lg:items-center 
            gap-[clamp(0.75rem,1.25vw,1.5rem)]
            px-[clamp(0.75rem,1.25vw,1.5rem)] 
            py-[clamp(0.875rem,1.25vw,1.5rem)]
            border-b border-gray-200/50
          ">
            <div>
              <h2 className="
                font-semibold text-gray-900 
                text-[clamp(0.875rem,1.125vw,1.25rem)] 
                tracking-tight
              ">
                Billing History
              </h2>
              <p className="
                text-gray-600/80 
                text-[clamp(0.75rem,0.875vw,0.875rem)] 
                mt-[clamp(0.125rem,0.25vw,0.375rem)]
              ">
                Recent transactions and invoices
              </p>
            </div>
            
            <div className="
              flex gap-[clamp(0.5rem,0.75vw,1rem)] 
              w-full lg:w-auto
            ">
              <button className="
                text-[clamp(0.75rem,0.875vw,0.875rem)] 
                px-[clamp(0.75rem,1.25vw,1.5rem)] 
                py-[clamp(0.375rem,0.625vw,0.75rem)]
                rounded-[clamp(0.75rem,1vw,1.125rem)] 
                border border-gray-300/80 
                text-gray-700 
                hover:bg-gray-50/50
                hover:border-gray-400/50
                transition-all duration-200
                active:scale-[0.98]
                flex-1 lg:flex-none
              ">
                Filter
              </button>
              <button className="
                text-[clamp(0.75rem,0.875vw,0.875rem)] 
                px-[clamp(0.75rem,1.25vw,1.5rem)] 
                py-[clamp(0.375rem,0.625vw,0.75rem)]
                rounded-[clamp(0.75rem,1vw,1.125rem)] 
                bg-gradient-to-r from-blue-600 to-blue-500
                text-white 
                hover:shadow-lg
                hover:shadow-blue-500/20
                transition-all duration-200
                active:scale-[0.98]
                flex-1 lg:flex-none
              ">
                Export All
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[min(100%,500px)]">
              <thead>
                <tr className="
                  border-b border-gray-200/50
                  bg-gradient-to-r from-gray-50/30 to-gray-50/10
                  backdrop-blur-sm
                ">
                  {['Date', 'Plan', 'Amount', 'Status', 'Invoice'].map((header, idx) => (
                    <th
                      key={idx}
                      className="
                        px-[clamp(0.5rem,1vw,1.25rem)] 
                        py-[clamp(0.625rem,1vw,1.25rem)]
                        text-left 
                        text-[clamp(0.6875rem,0.75vw,0.75rem)] 
                        font-medium 
                        text-gray-600/90
                        tracking-wide
                        whitespace-nowrap
                      "
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "Aug 03, 2025", amount: "QAR 105.00", status: "Paid", color: "emerald" },
                  { date: "Aug 01, 2025", amount: "QAR 105.00", status: "Failed", color: "red" },
                  { date: "Jul 01, 2025", amount: "QAR 105.00", status: "Paid", color: "emerald" },
                  { date: "Jun 01, 2025", amount: "QAR 105.00", status: "Paid", color: "emerald" },
                ].map((item, index) => (
                  <tr 
                    key={index}
                    className="
                      border-b border-gray-200/30 
                      hover:bg-gray-50/20 
                      transition-colors duration-150
                      group
                    "
                  >
                    <td className="
                      px-[clamp(0.5rem,1vw,1.25rem)] 
                      py-[clamp(0.75rem,1vw,1.25rem)]
                      text-[clamp(0.75rem,0.875vw,0.875rem)] 
                      font-medium text-gray-900
                      whitespace-nowrap
                    ">
                      {item.date}
                    </td>
                    <td className="
                      px-[clamp(0.5rem,1vw,1.25rem)] 
                      py-[clamp(0.75rem,1vw,1.25rem)]
                      text-[clamp(0.75rem,0.875vw,0.875rem)] 
                      text-gray-700/90
                      whitespace-nowrap
                    ">
                      Pro Plan
                    </td>
                    <td className="
                      px-[clamp(0.5rem,1vw,1.25rem)] 
                      py-[clamp(0.75rem,1vw,1.25rem)]
                      text-[clamp(0.75rem,0.875vw,0.875rem)] 
                      font-semibold text-gray-900
                      whitespace-nowrap
                    ">
                      {item.amount}
                    </td>
                    <td className="
                      px-[clamp(0.5rem,1vw,1.25rem)] 
                      py-[clamp(0.75rem,1vw,1.25rem)]
                      whitespace-nowrap
                    ">
                      <span className={`
                        inline-flex items-center 
                        px-[clamp(0.5rem,0.75vw,0.875rem)] 
                        py-[clamp(0.125rem,0.25vw,0.25rem)]
                        rounded-full 
                        text-[clamp(0.6875rem,0.75vw,0.75rem)] 
                        font-medium 
                        border backdrop-blur-sm
                        ${item.color === 'emerald' 
                          ? 'bg-emerald-50/60 text-emerald-700 border-emerald-200/50' 
                          : 'bg-red-50/60 text-red-700 border-red-200/50'
                        }
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="
                      px-[clamp(0.5rem,1vw,1.25rem)] 
                      py-[clamp(0.75rem,1vw,1.25rem)]
                      whitespace-nowrap
                    ">
                      {item.status === "Paid" ? (
                        <button 
                          className="
                            w-[clamp(2rem,2.5vw,2.75rem)] 
                            h-[clamp(2rem,2.5vw,2.75rem)]
                            rounded-[clamp(0.75rem,1vw,1.125rem)]
                            flex items-center justify-center
                            text-blue-600/90 
                            hover:text-blue-700
                            hover:bg-blue-50/50
                            border border-transparent
                            hover:border-blue-200/50
                            transition-all duration-200
                            group-hover:scale-105
                            active:scale-95
                          "
                          aria-label="Download invoice"
                        >
                          <DownloadIcon />
                        </button>
                      ) : (
                        <span className="
                          text-gray-400/80 
                          text-[clamp(0.6875rem,0.75vw,0.75rem)] 
                          italic
                        ">
                          Unavailable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="
          bg-white/80 backdrop-blur-lg 
          rounded-[clamp(1rem,1.25vw,1.5rem)] border border-white/60 
          shadow-[0_4px_16px_rgba(0,0,0,0.04)]
          p-[clamp(0.75rem,1.25vw,1.5rem)]
          hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]
          transition-all duration-300
          relative overflow-hidden
          before:absolute before:inset-0 
          before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-white/20
          before:-z-10
        ">
          <h2 className="
            font-semibold text-gray-900 
            text-[clamp(0.875rem,1.125vw,1.25rem)] 
            tracking-tight
            mb-[clamp(1rem,1.5vw,2rem)]
          ">
            Payment Methods
          </h2>

          <div className="
            grid grid-cols-1 lg:grid-cols-2 
            gap-[clamp(0.75rem,1.25vw,1.5rem)]
          ">
            {/* Existing Card */}
            <div className="min-w-0 h-full">
              <VisaCard />
            </div>

            {/* Add New Card */}
            <button className="
              w-full 
              h-full
              min-h-[clamp(8rem,12vh,10rem)]
              rounded-[clamp(1rem,1.25vw,1.5rem)]
              border-2 border-dashed
              border-gray-300/80
              flex flex-col
              items-center
              justify-center
              text-gray-500
              hover:border-blue-400/80
              hover:bg-gradient-to-br hover:from-blue-50/10 hover:to-transparent
              hover:text-blue-600/90
              active:border-blue-500
              cursor-pointer
              transition-all duration-300
              bg-white/50
              backdrop-blur-sm
              group
              p-[clamp(0.75rem,1.25vw,1.5rem)]
            ">
              <div className="
                w-[clamp(2.5rem,3vw,3.5rem)] 
                h-[clamp(2.5rem,3vw,3.5rem)]
                rounded-[clamp(0.75rem,1vw,1.125rem)]
                bg-gradient-to-br from-blue-500/10 to-blue-600/10
                border border-blue-200/50
                flex items-center justify-center
                mb-[clamp(0.75rem,1vw,1.25rem)]
                group-hover:from-blue-500/20 group-hover:to-blue-600/20
                transition-all duration-300
              ">
                <div className="
                  text-[clamp(1.5rem,2vw,2.5rem)] 
                  font-light text-blue-500/90
                  group-hover:text-blue-600
                  transition-colors duration-300
                ">
                  +
                </div>
              </div>
              
              <div className="
                text-[clamp(0.875rem,1vw,1.125rem)] 
                font-semibold text-gray-900
                group-hover:text-blue-600/90
                transition-colors duration-300
                mb-[clamp(0.25rem,0.5vw,0.75rem)]
              ">
                Add New Card
              </div>
              
              <p className="
                text-gray-600/80 
                text-[clamp(0.75rem,0.875vw,0.875rem)] 
                text-center
                group-hover:text-blue-600/70
                transition-colors duration-300
                max-w-[16rem]
              ">
                Add another payment method
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}