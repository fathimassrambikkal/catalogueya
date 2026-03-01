import React from "react";
import fatoraLogo from "../assets/fatoralogo.webp";
import {
  FaEye,
  FaFileInvoice,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";

/* Back Icon */
const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

function Pendingfatora({ onBack }) {
  const pendingFatoras = [
    {
      id: 1,
      number: "1023060786",
      dateIssued: "12/11/2025",
      status: "Received",
    },
    {
      id: 2,
      number: "1023060787",
      dateIssued: "12/11/2025",
      status: "Received",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition">
                <BackIcon />
              </div>
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
          
          <div className="flex flex-col lg:justify-end">
            <div className="flex items-center gap-2 bg-white backdrop-blur-sm px-4 py-2 rounded-lg w-fit">
              <span className="text-blue-500 text-sm">Powered by</span>
              <img 
                src={fatoraLogo}
                alt="Fatora" 
                className="h-6 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-1.5 sm:px-4 py-3">
        {/* Table Wrapper */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/40 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Table Header */}
          <div className="px-1.5 sm:px-4 py-2 border-b border-gray-200/40 bg-white/60">
            <div className="grid grid-cols-12 gap-0.5 sm:gap-2 text-[8px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
              <div className="col-span-4 sm:col-span-4 min-w-0 pr-0.5">Fatora Number</div>
              <div className="col-span-4 sm:col-span-4 min-w-0 pr-0.5">Date Issued</div>
              <div className="col-span-3 sm:col-span-3 min-w-0 pr-0.5">Status</div>
              <div className="col-span-1 text-right min-w-0">View</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-200/30">
            {pendingFatoras.map((fatora) => (
              <div
                key={fatora.id}
                className="grid grid-cols-12 items-center gap-0.5 sm:gap-2 px-1.5 sm:px-4 py-2 sm:py-3 hover:bg-blue-50/30 transition"
              >
                {/* Fatora Number */}
                <div className="col-span-4 sm:col-span-4 flex items-center gap-1 sm:gap-2 min-w-0 pr-0.5">
                  <div className="w-4 h-4 sm:w-8 sm:h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                    <FaFileInvoice className="text-blue-500 text-[7px] sm:text-sm" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-gray-900 text-[9px] sm:text-sm truncate block">
                      {fatora.number}
                    </span>
                  </div>
                </div>

                {/* Date Issued */}
                <div className="col-span-4 sm:col-span-4 flex items-center gap-0.5 text-gray-600 min-w-0 pr-0.5">
                  <FaCalendarAlt className="text-gray-400 text-[7px] sm:text-sm shrink-0" />
                  <span className="truncate text-[9px] sm:text-sm min-w-0">
                    {fatora.dateIssued}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-3 sm:col-span-3 min-w-0 pr-0.5">
                  <span
                    className={`
                      inline-flex items-center gap-0.5
                      px-1 sm:px-2
                      py-0.5
                      rounded-full
                      text-[7px] sm:text-[11px]
                      font-medium
                      whitespace-nowrap
                      truncate
                      bg-blue-50 text-blue-700 border border-blue-200
                    `}
                  >
                    <FaCheckCircle className="text-[7px] sm:text-xs" />
                    <span className="truncate">{fatora.status}</span>
                  </span>
                </div>

                {/* View Button */}
                <div className="col-span-1 flex justify-end min-w-0">
                  <button
                    className="
                      inline-flex items-center justify-center
                      w-4 h-4 sm:w-8 sm:h-8
                      rounded-full
                      bg-blue-600/90
                      text-white
                      hover:bg-blue-700
                      transition
                      shrink-0
                    "
                  >
                    <FaEye className="text-[7px] sm:text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <span>
            Total <strong>{pendingFatoras.length}</strong> pending fatoras
          </span>
        </div>
      </div>
    </div>
  );
}

export default Pendingfatora;