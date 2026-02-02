import React, { useState } from "react";
import fatoraLogo from "../assets/fatoralogo.webp";
import {
  BackIcon,
  IconView,
  IconInvoice,
  IconSuccess,
  IconCalendar,
  IconUnpaid,
  IconRefresh,
  IconWarning,
  IconError, 
  DeleteIcon,
  PlusIcon
} from "./CompanySvg";

function UnpaidBills({ onBack }) {
  const unpaidBills = [
    {
      id: 1,
      number: "1023060786",
      dateIssued: "12/11/2025",
      status: "Unpaid",
      recipient: "Fatma Mohammed",
      finalPrice: "12,000 QR",
      reason: "Past Due Date",
      confirmationStatus: "pending",
      confirmType: "warning",
    },
    {
      id: 2,
      number: "1023060787",
      dateIssued: "12/11/2025",
      status: "Unpaid",
      recipient: "Sara Barawy",
      finalPrice: "50,000 QR",
      reason: "Rejected",
      confirmationStatus: "unsuccessful",
      confirmType: "error",
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
    if (statusLower.includes("unpaid")) {
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

  const getConfirmationButtonStyle = (confirmType, confirmationStatus) => {
    if (confirmationStatus === "pending") {
      return "bg-blue-600 hover:bg-blue-700 text-white";
    }
    if (confirmType === "warning") {
      return "bg-yellow-100 hover:bg-yellow-200 text-yellow-800";
    }
    if (confirmType === "error") {
      return "bg-red-100 hover:bg-red-200 text-red-800 cursor-default";
    }
    return "bg-gray-100 text-gray-600 cursor-default";
  };

  const getConfirmationContent = (confirmType, confirmationStatus) => {
    if (confirmationStatus === "pending") {
      return "Confirm";
    }
    if (confirmType === "error") {
      return "Unsuccessful";
    }
    return "Confirmed";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 mt-20 md:mt-0">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[calc(100vh-8rem)]">
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
              Unpaid Bills
            </h1>
          </div>

          {/* CONTENT AREA - Takes remaining space */}
          <div className="flex-1 p-4 sm:p-6 md:p-8">
            {/* Desktop Table - Compact */}
            <div className="hidden lg:block bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/40 shadow-2xl shadow-blue-600/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bill Number
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Issued
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Final Price
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confirm
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {unpaidBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Bill Number */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
                              <IconInvoice className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {bill.number}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Recipient */}
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">
                            {bill.recipient}
                          </div>
                        </td>

                        {/* Date Issued */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <IconCalendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {bill.dateIssued}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                            {getStatusIcon(bill.status)}
                            <span>{bill.status}</span>
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-700">
                            {bill.reason}
                          </div>
                        </td>

                        {/* Final Price */}
                        <td className="py-4 px-6">
                          <div className="text-sm font-semibold text-gray-900">
                            {bill.finalPrice}
                          </div>
                        </td>

                        {/* Confirm Status */}
                        <td className="py-4 px-6">
                          <button
                            className={`
                              inline-flex items-center justify-center
                              rounded-md
                              text-xs
                              font-medium
                              px-3
                              py-1.5
                              transition-all
                              ${getConfirmationButtonStyle(bill.confirmType, bill.confirmationStatus)}
                              ${bill.confirmationStatus === "pending" 
                                ? "hover:shadow-sm" 
                                : ""}
                            `}
                            disabled={bill.confirmType === "error"}
                          >
                            {getConfirmationContent(bill.confirmType, bill.confirmationStatus)}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            <button 
                              className="p-1.5 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              aria-label="View invoice details"
                            >
                              <IconView className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1.5 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                              aria-label="Delete bill"
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1.5 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                              aria-label="Reactivate bill"
                            >
                              <IconRefresh className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Desktop Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">
                    Total <strong className="text-blue-600">{unpaidBills.length}</strong> Unpaid Bills
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <div className="space-y-4">
                {unpaidBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100/50 transition-colors"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                          <IconInvoice className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {bill.number}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Bill Number
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center border border-blue-500/30"
                          aria-label="View invoice details"
                        >
                          <IconView className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Recipient</div>
                        <div className="text-sm text-gray-900 font-medium">
                          {bill.recipient}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Date Issued</div>
                        <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                          <IconCalendar className="w-4 h-4 text-gray-400" />
                          {bill.dateIssued}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap ${getStatusColor(bill.status)}`}>
                          {getStatusIcon(bill.status)}
                          <span>{bill.status}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Reason</div>
                        <div className="text-sm text-gray-700 font-medium">
                          {bill.reason}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Final Price</div>
                        <div className="text-base font-semibold text-gray-900">
                          {bill.finalPrice}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Confirm Status</div>
                        <div>
                          <button
                            className={`
                              w-full
                              inline-flex items-center justify-center
                              rounded-lg
                              text-xs
                              font-medium
                              px-4
                              py-2
                              transition-all duration-200
                              border border-transparent
                              ${getConfirmationButtonStyle(bill.confirmType, bill.confirmationStatus)}
                              ${bill.confirmationStatus === "pending" 
                                ? "hover:shadow-sm" 
                                : ""}
                            `}
                            disabled={bill.confirmType === "error"}
                            aria-label={`Confirmation status: ${bill.confirmationStatus}`}
                          >
                            {getConfirmationContent(bill.confirmType, bill.confirmationStatus)}
                          </button>
                        </div>
                      </div>

                      {/* Mobile Action Buttons */}
                      <div className="col-span-2 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="flex-1 max-w-[120px] flex items-center justify-center gap-2 rounded-lg bg-white text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 py-2.5 border border-gray-200"
                            aria-label="Delete bill"
                          >
                            <DeleteIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Delete</span>
                          </button>
                          <button 
                            className="flex-1 max-w-[120px] flex items-center justify-center gap-2 rounded-lg bg-white text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 py-2.5 border border-gray-200"
                            aria-label="Reactivate bill"
                          >
                            <IconRefresh className="w-4 h-4" />
                            <span className="text-sm font-medium">Reactivate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Footer */}
              <div className="mt-6 pt-4 border-t border-gray-300">
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">
                    Total <strong className="text-blue-600">{unpaidBills.length}</strong> Unpaid Bills
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UnpaidBills);