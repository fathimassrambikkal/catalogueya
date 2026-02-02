import React from "react";
import fatoraLogo from "../assets/fatoralogo.webp";
import {
  IconInvoice,
  IconCalendar,
  BackIcon,
  IconEdit, 
DeleteIcon

} from "./CompanySvg";

function DraftBills({ onBack }) {
  const draftBills = [
    {
      id: 1,
      number: "1023060786",
      recipient: "Fatma Mohammed",
      dateCreated: "12/11/2025",
    },
    {
      id: 2,
      number: "1023060786",
      recipient: "Sara Barawy",
      dateCreated: "12/11/2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
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
              Draft Bills
            </h1>
          </div>

          {/* ================= TABLE ================= */}
          <div className="p-4 sm:p-6">
            {/* ---------- DESKTOP ---------- */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200">
              {/* Header */}
              <div className="grid grid-cols-12 bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="col-span-3 text-xs sm:text-sm font-semibold text-gray-700">Bill Number</div>
                <div className="col-span-4 text-xs sm:text-sm font-semibold text-gray-700">Recipient</div>
                <div className="col-span-3 text-xs sm:text-sm font-semibold text-gray-700">Date Created</div>
                <div className="col-span-2 text-xs sm:text-sm font-semibold text-gray-700 text-right">Actions</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-200">
                {draftBills.map((bill, index) => (
                  <div
                    key={bill.id}
                    className={`grid grid-cols-12 items-center px-6 py-4 hover:bg-blue-50/30 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    {/* Bill Number */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <IconInvoice className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {bill.number}
                      </span>
                    </div>

                    {/* Recipient */}
                    <div className="col-span-4 text-sm text-gray-700">
                      {bill.recipient}
                    </div>

                    {/* Date */}
                    <div className="col-span-3 flex items-center gap-2 text-sm text-gray-600">
                      <IconCalendar className="w-4 h-4" />
                      {bill.dateCreated}
                    </div>

                    {/* Actions - Sleek Apple Style */}
                    <div className="col-span-2 flex justify-end gap-3">
                      <button className="
                        flex items-center gap-2
                        text-blue-600 hover:text-blue-700
                        font-medium
                        transition-colors
                        text-sm
                      ">
                        <IconEdit className="w-4 h-4" />
                        
                      </button>

                      <button className="
                        flex items-center gap-2
                        text-red-600 hover:text-red-700
                        font-medium
                        transition-colors
                        text-sm
                      ">
                        <DeleteIcon className="w-4 h-4" />
                      
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- MOBILE ---------- */}
            <div className="sm:hidden space-y-4">
              {draftBills.map((bill) => (
                <div
                  key={bill.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  {/* Top */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <IconInvoice className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Draft #{bill.number}</h3>
                        <p className="text-xs text-gray-500">Bill Number</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Recipient</label>
                      <span className="text-sm font-medium text-gray-900">
                        {bill.recipient}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Date Created</label>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <IconCalendar className="w-4 h-4" />
                        {bill.dateCreated}
                      </div>
                    </div>
                  </div>

                  {/* Actions - Sleek Apple Style */}
                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
                    <button className="
                      flex items-center gap-2
                      text-blue-600 hover:text-blue-700
                      font-medium
                      transition-colors
                      text-sm
                    ">
                      <IconEdit className="w-4 h-4" />
                     
                    </button>
                    
                    <button className="
                      flex items-center gap-2
                      text-red-600 hover:text-red-700
                      font-medium
                      transition-colors
                      text-sm
                    ">
                      <DeleteIcon className="w-4 h-4" />
                    
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-sm text-gray-600">
              Total <strong>{draftBills.length}</strong> draft bills
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DraftBills;