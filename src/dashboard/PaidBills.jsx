import React from "react";
import fatoraLogo from "../assets/fatoralogo.webp";
import {
  BackIcon,
  IconView,
  IconInvoice,
  IconSuccess,
  IconCalendar,
  IconUnpaid,
} from "./CompanySvg";

function PaidBills({ onBack }) {
  const pastFatoras = [
    {
      id: 1,
      number: "1023060786",
      dateIssued: "12/11/2025",
      status: "Paid In Cash",
      recipient: "Fatma Mohammed",
      finalPrice: "12,000 QR",
      confirmationStatus: "pending",
    },
    {
      id: 2,
      number: "1023060787",
      dateIssued: "12/11/2025",
      status: "Paid In Cash",
      recipient: "Sara Barawy",
      finalPrice: "50,000 QR",
      confirmationStatus: "successful",
    },
  ];

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("paid")) {
      return "bg-green-50 text-green-700 border border-green-200";
    }
    if (statusLower.includes("pending")) {
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }
    if (statusLower.includes("not")) {
      return "bg-red-50 text-red-700 border border-red-200";
    }
    return "bg-gray-50 text-gray-700 border border-gray-200";
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("paid")) {
      return <IconSuccess className="min-w-[0.75rem] h-[0.75rem]" />;
    }
    if (statusLower.includes("pending")) {
      return <IconInvoice className="min-w-[0.75rem] h-[0.75rem]" />;
    }
    return <IconUnpaid className="min-w-[0.75rem] h-[0.75rem]" />;
  };

  const getConfirmationButtonStyle = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") {
      return "bg-blue-600 hover:bg-blue-700 text-white";
    }
    if (statusLower === "successful") {
      return "bg-green-100 hover:bg-green-200 text-green-800 cursor-default";
    }
    return "bg-gray-100 text-gray-600 cursor-default";
  };

  const getConfirmationText = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") return "Confirm!";
    if (statusLower === "successful") return "Successful";
    return "Pending";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 mt-20 md:mt-0">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/90 hover:text-white transition group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition">
                  <BackIcon />
                </div>
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
          </div>

          {/* PAGE TITLE */}
          <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-b border-gray-200">
            <h1
              className="
                text-gray-900
                text-2xl sm:text-3xl md:text-4xl
                font-bold
                tracking-tight
                leading-tight
              "
            >
              Paid Bills
            </h1>
          </div>

          {/* MAIN CONTENT */}
          <div className="p-4 sm:p-6">
            {/* Desktop/Tablet Table - Optimized for data visibility */}
            <div className="hidden lg:block bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/40 shadow-2xl shadow-blue-600/5 overflow-hidden">
              {/* Table Header - Improved spacing for data visibility */}
              <div className="px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.5rem,1.5vw,0.875rem)] border-b border-gray-200/40 bg-white/80">
                <div className="grid grid-cols-12 gap-[clamp(0.25rem,1vw,0.75rem)] text-[clamp(0.625rem,0.875vw,0.75rem)] font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2 pl-2">Bill Number</div>
                  <div className="col-span-2">Recipient</div>
                  <div className="col-span-1">Date Issued</div>
                  <div className="col-span-2">Payment Status</div>
                  <div className="col-span-2">Final Price</div>
                  <div className="col-span-2">Confirmation</div>
                  <div className="col-span-1 text-right pr-2">Actions</div>
                </div>
              </div>

              {/* Table Rows - Optimized for readability */}
              <div className="divide-y divide-gray-200/30">
                {pastFatoras.map((fatora) => (
                  <div
                    key={fatora.id}
                    className="grid grid-cols-12 items-center gap-[clamp(0.25rem,1vw,0.75rem)] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.625rem,1.5vw,0.875rem)] hover:bg-blue-50/50 transition-colors duration-200 group"
                  >
                    {/* Bill Number */}
                    <div className="col-span-2 flex items-center gap-[clamp(0.25rem,0.75vw,0.5rem)] min-w-0">
                      <div className="w-[clamp(1.75rem,2.5vw,2rem)] h-[clamp(1.75rem,2.5vw,2rem)] rounded-lg bg-blue-50/80 flex items-center justify-center shrink-0 border border-blue-100">
                        <IconInvoice className="w-[clamp(0.875rem,1.25vw,1rem)] h-[clamp(0.875rem,1.25vw,1rem)] text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-[clamp(0.75rem,0.9375vw,0.875rem)] truncate">
                          {fatora.number}
                        </div>
                      </div>
                    </div>

                    {/* Recipient */}
                    <div className="col-span-2 min-w-0">
                      <div className="text-[clamp(0.75rem,0.9375vw,0.875rem)] text-gray-900 font-medium truncate">
                        {fatora.recipient}
                      </div>
                    </div>

                    {/* Date Issued */}
                    <div className="col-span-1 min-w-0">
                      <div className="flex items-center gap-[clamp(0.125rem,0.375vw,0.25rem)] text-gray-600">
                        <IconCalendar className="w-[clamp(0.875rem,1.125vw,1rem)] h-[clamp(0.875rem,1.125vw,1rem)] text-gray-400" />
                        <span className="text-[clamp(0.75rem,0.9375vw,0.875rem)] font-medium">
                          {fatora.dateIssued}
                        </span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="col-span-2 min-w-0">
                      <div className={`inline-flex items-center gap-[clamp(0.125rem,0.375vw,0.25rem)] px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.25rem,0.5vw,0.375rem)] rounded-full border text-[clamp(0.6875rem,0.8125vw,0.75rem)] font-medium whitespace-nowrap max-w-full ${getStatusColor(fatora.status)}`}>
                        {getStatusIcon(fatora.status)}
                        <span className="truncate">{fatora.status}</span>
                      </div>
                    </div>

                    {/* Final Price */}
                    <div className="col-span-2 min-w-0">
                      <div className="text-[clamp(0.875rem,1.125vw,1rem)] font-bold text-gray-900 truncate">
                        {fatora.finalPrice}
                      </div>
                    </div>

                    {/* Confirmation Status */}
                    <div className="col-span-2 min-w-0">
                      <button
                        className={`
                          w-full max-w-[clamp(6rem,10vw,8rem)]
                          inline-flex items-center justify-center
                          rounded-xl
                          text-[clamp(0.6875rem,0.8125vw,0.75rem)]
                          font-semibold
                          px-[clamp(0.5rem,1vw,0.75rem)]
                          py-[clamp(0.375rem,0.75vw,0.5rem)]
                          transition-all duration-200
                          ${getConfirmationButtonStyle(fatora.confirmationStatus)}
                          ${fatora.confirmationStatus === "pending" 
                            ? "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]" 
                            : ""}
                        `}
                        disabled={fatora.confirmationStatus !== "pending"}
                        aria-label={`Confirmation status: ${fatora.confirmationStatus}`}
                      >
                        {getConfirmationText(fatora.confirmationStatus)}
                      </button>
                    </div>

                    {/* View Button */}
                    <div className="col-span-1 flex justify-end">
                      <button 
                        className="w-[clamp(2rem,2.5vw,2.25rem)] h-[clamp(2rem,2.5vw,2.25rem)] rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center border border-blue-500/30"
                        aria-label="View invoice details"
                      >
                        <IconView className="w-[clamp(0.875rem,1.125vw,1rem)] h-[clamp(0.875rem,1.125vw,1rem)]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tablet/Mobile Cards (Below 1024px) */}
            <div className="lg:hidden space-y-[clamp(0.5rem,1.5vw,0.75rem)]">
              {pastFatoras.map((fatora) => (
                <div
                  key={fatora.id}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/40 shadow-lg shadow-blue-600/5 p-[clamp(0.75rem,2vw,1rem)] hover:shadow-xl transition-shadow duration-200"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-[clamp(0.75rem,1.5vw,1rem)]">
                    <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] min-w-0">
                      <div className="w-[clamp(2rem,3vw,2.5rem)] h-[clamp(2rem,3vw,2.5rem)] rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                        <IconInvoice className="w-[clamp(1rem,1.5vw,1.25rem)] h-[clamp(1rem,1.5vw,1.25rem)] text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[clamp(0.875rem,1.125vw,1rem)] font-bold text-gray-900 truncate">
                          {fatora.number}
                        </div>
                        <div className="text-[clamp(0.625rem,0.875vw,0.75rem)] text-gray-500">
                          Bill Number
                        </div>
                      </div>
                    </div>
                    <button 
                      className="w-[clamp(2rem,2.5vw,2.25rem)] h-[clamp(2rem,2.5vw,2.25rem)] rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center shrink-0"
                      aria-label="View invoice details"
                    >
                      <IconView className="w-[clamp(0.875rem,1.125vw,1rem)] h-[clamp(0.875rem,1.125vw,1rem)]" />
                    </button>
                  </div>

                  {/* Card Content - Optimized Grid */}
                  <div className="grid grid-cols-2 gap-[clamp(0.5rem,1.25vw,0.75rem)]">
                    {/* Recipient */}
                    <div className="min-w-0">
                      <div className="text-[clamp(0.625rem,0.875vw,0.75rem)] text-gray-500 mb-1">Recipient</div>
                      <div className="text-[clamp(0.75rem,1vw,0.875rem)] text-gray-900 font-medium truncate">
                        {fatora.recipient}
                      </div>
                    </div>

                    {/* Date Issued */}
                    <div className="min-w-0">
                      <div className="text-[clamp(0.625rem,0.875vw,0.75rem)] text-gray-500 mb-1">Date Issued</div>
                      <div className="flex items-center gap-[clamp(0.125rem,0.375vw,0.25rem)] text-[clamp(0.75rem,1vw,0.875rem)] text-gray-900 font-medium">
                        <IconCalendar className="w-[clamp(0.875rem,1.125vw,1rem)] h-[clamp(0.875rem,1.125vw,1rem)] text-gray-400" />
                        {fatora.dateIssued}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="min-w-0">
                      <div className="text-[clamp(0.625rem,0.875vw,0.75rem)] text-gray-500 mb-1">Payment Status</div>
                      <div className={`inline-flex items-center gap-[clamp(0.125rem,0.375vw,0.25rem)] px-[clamp(0.5rem,1vw,0.625rem)] py-[clamp(0.25rem,0.5vw,0.375rem)] rounded-full border text-[clamp(0.6875rem,0.875vw,0.75rem)] font-medium whitespace-nowrap ${getStatusColor(fatora.status)}`}>
                        {getStatusIcon(fatora.status)}
                        <span className="truncate">{fatora.status}</span>
                      </div>
                    </div>

                    {/* Final Price */}
                    <div className="min-w-0">
                      <div className="text-[clamp(0.625rem,0.875vw,0.75rem)] text-gray-500 mb-1">Final Price</div>
                      <div className="text-[clamp(0.875rem,1.125vw,1rem)] font-bold text-gray-900">
                        {fatora.finalPrice}
                      </div>
                    </div>

                    {/* Confirmation Status - Full Width */}
                    <div className="col-span-2 mt-2">
                      <div className="text-[clamp(0.625rem,0.875vw,0.75rem)] text-gray-500 mb-1">Confirmation Status</div>
                      <button
                        className={`
                          w-full
                          inline-flex items-center justify-center
                          rounded-xl
                          text-[clamp(0.75rem,1vw,0.875rem)]
                          font-semibold
                          px-4
                          py-[clamp(0.5rem,1vw,0.625rem)]
                          transition-all duration-200
                          ${getConfirmationButtonStyle(fatora.confirmationStatus)}
                          ${fatora.confirmationStatus === "pending" 
                            ? "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]" 
                            : ""}
                        `}
                        disabled={fatora.confirmationStatus !== "pending"}
                        aria-label={`Confirmation status: ${fatora.confirmationStatus}`}
                      >
                        {getConfirmationText(fatora.confirmationStatus)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-[clamp(1rem,2vw,1.5rem)] flex justify-between text-[clamp(0.75rem,0.9375vw,0.875rem)] text-gray-600">
              <span className="font-medium">
                Total <strong className="text-blue-600">{pastFatoras.length}</strong> past invoices
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PaidBills);