import React from "react";
import fatoraLogo from "../assets/fatoralogo.webp";
import {
  FaEye,
  FaFileInvoice,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUser,
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

function Pastfatora({ onBack }) {
  const pastFatoras = [
    {
      id: 1,
      number: "1023060786",
      dateIssued: "12/11/2025",
      status: "Paid",
      recipient: "Fatma Mohammed",
    },
    {
      id: 2,
      number: "1023060786",
      dateIssued: "12/11/2025",
      status: "Not Paid",
      recipient: "Sara Barawy",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-50 text-green-700 border border-green-200";
      case "not paid":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <FaCheckCircle />;
      case "not paid":
        return <FaTimesCircle />;
      default:
        return <FaFileInvoice />;
    }
  };

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
              <div className="col-span-4 sm:col-span-3 min-w-0 pr-0.5">Fatora</div>
              <div className="col-span-4 sm:col-span-4 min-w-0 pr-0.5">Recipient</div>
              <div className="hidden sm:block col-span-2 min-w-0 pr-0.5">Date</div>
              <div className="col-span-3 sm:col-span-2 min-w-0 pr-0.5">Status</div>
              <div className="col-span-1 text-right min-w-0">View</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-200/30">
            {pastFatoras.map((fatora) => (
              <div
                key={fatora.id}
                className="grid grid-cols-12 items-center gap-0.5 sm:gap-2 px-1.5 sm:px-4 py-2 sm:py-3 hover:bg-blue-50/30 transition"
              >
                {/* Fatora with date below for 300-600px */}
                <div className="col-span-4 sm:col-span-3 flex items-center gap-1 sm:gap-2 min-w-0 pr-0.5">
                  <div className="w-4 h-4 sm:w-8 sm:h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                    <FaFileInvoice className="text-blue-500 text-[7px] sm:text-sm" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-gray-900 text-[9px] sm:text-sm truncate block">
                      {fatora.number}
                    </span>
                    {/* Date below fatora for 300-600px */}
                    <div className="sm:hidden flex items-center gap-0.5 text-gray-500 mt-0.5">
                      <FaCalendarAlt className="text-[6px]" />
                      <span className="text-[7px] truncate">{fatora.dateIssued}</span>
                    </div>
                  </div>
                </div>

                {/* Recipient */}
                <div className="col-span-4 sm:col-span-4 flex items-center gap-0.5 text-gray-700 min-w-0 pr-0.5">
                  <FaUser className="text-gray-400 text-[7px] sm:text-sm shrink-0" />
                  <span className="truncate text-[9px] sm:text-sm min-w-0">
                    {fatora.recipient}
                  </span>
                </div>

                {/* Date - Visible only on 600px+ */}
                <div className="hidden sm:flex col-span-2 items-center gap-0.5 text-gray-600 min-w-0 pr-0.5">
                  <FaCalendarAlt className="text-gray-400 text-[7px] sm:text-sm shrink-0" />
                  <span className="text-[9px] sm:text-sm truncate min-w-0">
                    {fatora.dateIssued}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-3 sm:col-span-2 min-w-0 pr-0.5">
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
                      ${getStatusColor(fatora.status)}
                    `}
                  >
                    {getStatusIcon(fatora.status)}
                    <span className="truncate">{fatora.status}</span>
                  </span>
                </div>

                {/* View - Always visible */}
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
            Total <strong>{pastFatoras.length}</strong> past fatoras
          </span>
        </div>
      </div>
    </div>
  );
}

export default Pastfatora;