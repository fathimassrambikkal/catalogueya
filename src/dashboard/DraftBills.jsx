import React, { useState, useEffect } from "react";
import {
  IconInvoice,
  IconCalendar,
  BackIcon,
  IconEdit,
  DeleteIcon,
} from "./CompanySvg";
import { getDraftBills } from "../companyDashboardApi";

function DraftBills({ onBack, onEdit }) {
  const [draftBills, setDraftBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await getDraftBills();
      // Response structure: { data: [...], current_page: 1, total: 1 }
      const list = res.data?.data || [];
      // User requested to reverse order
      setDraftBills(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching drafts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            <h1 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Draft Bills
            </h1>
          </div>

          {/* ================= TABLE ================= */}
          <div className="p-4 sm:p-6">
            {/* ---------- DESKTOP ---------- */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200">
              <div className="grid grid-cols-12 bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="col-span-3 text-xs sm:text-sm font-semibold text-gray-700">
                  Bill Number
                </div>
                <div className="col-span-4 text-xs sm:text-sm font-semibold text-gray-700">
                  Customer
                </div>
                <div className="col-span-3 text-xs sm:text-sm font-semibold text-gray-700">
                  Date Created
                </div>
                <div className="col-span-2 text-xs sm:text-sm font-semibold text-gray-700 text-right">
                  Actions
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {draftBills.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No draft bills found.</div>
                ) : (
                  draftBills.map((bill, index) => (
                    <div
                      key={bill.id}
                      className={`grid grid-cols-12 items-center px-6 py-4 hover:bg-blue-50/30 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <IconInvoice className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {bill.bill_number || bill.id}
                        </span>
                      </div>

                      <div className="col-span-4 text-sm text-gray-700">
                        {bill.customer_name || "Unknown"}
                      </div>

                      <div className="col-span-3 flex items-center gap-2 text-sm text-gray-600">
                        <IconCalendar className="w-4 h-4" />
                        {bill.created_at}
                      </div>

                      <div className="col-span-2 flex justify-end gap-3">
                        <button
                          onClick={() => onEdit(bill.id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>
                        {/* Delete not implemented in prompt yet */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ---------- MOBILE ---------- */}
            <div className="sm:hidden space-y-4">
              {draftBills.length === 0 ? (
                <div className="text-center text-gray-500">No draft bills found.</div>
              ) : (
                draftBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <IconInvoice className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Draft #{bill.bill_number || bill.id}
                          </h3>
                          <p className="text-xs text-gray-500">Bill Number</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Customer
                        </label>
                        <span className="text-sm font-medium text-gray-900">
                          {bill.customer_name || "Unknown"}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Date Created
                        </label>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <IconCalendar className="w-4 h-4" />
                          {bill.created_at}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => onEdit(bill.id)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                      >
                        <IconEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
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