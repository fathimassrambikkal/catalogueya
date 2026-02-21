import React from "react";
import fatoraLogo from "../assets/fatoralogo.webp";
import {
  IconView,
  IconInvoice,
  IconSuccess,
  IconCalendar,
  BackIcon,
} from "./CompanySvg";

function PendingBills({ onBack }) {
  const pendingFatoras = [
    {
      id: 1,
      number: "1023060786",
      recipient: "Fatma Mohammed",
      dateIssued: "12/11/2025",
      status: "Received",
      paymentMethod: "Cash",
    },
    {
      id: 2,
      number: "1023060787",
      recipient: "Aisha Khan",
      dateIssued: "12/11/2025",
      status: "Received",
      paymentMethod: "Card",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 mt-20 md:mt-0 ">
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

          {/* PAGE TITLE (separate section) */}
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
              Pending Bills
            </h1>
          </div>

          {/* ================= TABLE ================= */}
          <div className="p-4 sm:p-6">
            {/* Desktop Table (600px and above) */}
            <div className="hidden sm:block bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/40 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Table Header */}
              <div className="px-2 sm:px-4 py-2 border-b border-gray-200/40 bg-white/60">
                <div className="grid grid-cols-12 gap-1 sm:gap-2 text-[8px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
                  <div className="col-span-2">Bill Number</div>
                  <div className="col-span-3">Recipient</div>
                  <div className="col-span-2">Date Issued</div>
                  <div className="col-span-2">Payment Method</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">View</div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200/30">
                {pendingFatoras.map((fatora) => (
                  <div
                    key={fatora.id}
                    className="grid grid-cols-12 items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 hover:bg-blue-50/30 transition"
                  >
                    {/* Bill Number */}
                    <div className="col-span-2 flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <IconInvoice className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {fatora.number}
                      </span>
                    </div>

                    {/* Recipient */}
                    <div className="col-span-3 min-w-0">
                      <span className="text-sm text-gray-700 truncate block">
                        {fatora.recipient}
                      </span>
                    </div>

                    {/* Date Issued */}
                    <div className="col-span-2 flex items-center gap-1 text-gray-600 min-w-0">
                      <IconCalendar className="w-4 h-4" />
                      <span className="text-sm truncate">{fatora.dateIssued}</span>
                    </div>

                    {/* Payment Method */}
                    <div className="col-span-2 min-w-0">
                      <span className="text-xs text-gray-700 font-medium truncate block">
                        {fatora.paymentMethod}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <IconSuccess className="w-3 h-3 text-green-500" />
                        {fatora.status}
                      </span>
                    </div>

                    {/* View */}
                    <div className="col-span-1 flex justify-end">
                      <button className="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center">
                        <IconView className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Cards (600px and below) */}
            <div className="sm:hidden space-y-3">
              {pendingFatoras.map((fatora) => (
                <div
                  key={fatora.id}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/40 shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                        <IconInvoice className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {fatora.number}
                        </div>
                        <div className="text-xs text-gray-500">Bill Number</div>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center">
                      <IconView className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-2">
                    {/* Recipient */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Recipient</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {fatora.recipient}
                      </span>
                    </div>

                    {/* Date Issued */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Date Issued</span>
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <IconCalendar className="w-4 h-4" />
                        {fatora.dateIssued}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Payment Method</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {fatora.paymentMethod}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Status</span>
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <IconSuccess className="w-3 h-3 text-green-500" />
                        {fatora.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-sm text-gray-600">
              Total <strong>{pendingFatoras.length}</strong> pending fatoras
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingBills;