import React, { useState, useEffect } from "react";
import {
  IconView,
 
} from "./CompanySvg";
import { getPendingBills, getBillDetails, confirmCashPayment, rejectBillPayment } from "../companyDashboardApi";
import BillDetailsModal from "./BillDetailsModal";
import ConfirmationDialog from "./ConfirmationDialog";
import { showToast } from "../utils/showToast";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";

function PendingBills({ onBack, refreshCounts }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [dialogState, setDialogState] = useState({ isOpen: false, type: 'info', billId: null, action: null });
  const [cashConfirmedBy, setCashConfirmedBy] = useState('');
const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await getPendingBills();
      const list = res.data?.data || res.data || [];
      setBills(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching pending bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBill = async (billId) => {
    try {
      const res = await getBillDetails(billId);
      setSelectedBill(res.data?.data || res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching bill details", error);
    }
  };

  const initiateAction = (billId, action) => {
    if (action === 'yes') {
      setCashConfirmedBy('');
      setDialogState({
        isOpen: true,
        type: fw.success || "success",
        title: fw.confirm_payment || "Confirm Payment",
        message: fw.confirm_payment_question || "Are you sure this bill has been paid in cash?",
        confirmText: fw.yes_paid || "Yes, Paid",
        cancelText: fw.cancel || "Cancel",
        billId,
        action: 'confirm_payment'
      });
    } else if (action === 'no') {
      setDialogState({
        isOpen: true,
        type: fw.danger || "",
        title: fw.payment_not_received || "Payment Not Received?",
        message: fw.payment_not_received_confirm || "Are you sure you want to mark this as not received?",
        confirmText: fw.mark_not_received || "Mark Not Received",
        cancelText: fw.cancel || "Cancel",
        billId,
        action: 'reject_payment'
      });
    }
  };

  const handleConfirmAction = async () => {
    const { billId, action } = dialogState;
    if (!billId) return;

    if (action === 'confirm_payment') {
      setProcessingId(billId);
      try {
        const res = await confirmCashPayment(billId, { cash_confirmed_by: cashConfirmedBy });
        if (res.status === 200 || res.status === 201) {
          toast.success("Cash payment confirmed!");
          fetchBills();
          refreshCounts();
        } else {
          toast.error("Failed to confirm");
        }
      } catch (error) {
        toast.error("Error confirming payment");
      } finally {
        setProcessingId(null);
      }
    } else if (action === 'reject_payment') {
      const bill = bills.find(b => b.id === billId);
      const token = bill?.public_token || bill?.token; // Fallback to token if public_token is key

      if (!token) {
        toast.error("Missing bill token for rejection");
        setDialogState({ isOpen: false, type: 'info', billId: null, action: null });
        return;
      }

      setProcessingId(billId);
      try {
        await rejectBillPayment(token);
        toast.success("Payment marked as not received");
        fetchBills();
        refreshCounts();
      } catch (error) {
        console.error(error);
        toast.error("Failed to reject payment");
      } finally {
        setProcessingId(null);
      }
    }
    setDialogState({ isOpen: false, type: 'info', billId: null, action: null });
  };



return (
   <div dir={isRTL ? "rtl" : "ltr"} className="animate-fadeIn">
      <BillDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bill={selectedBill}
      />

      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ ...dialogState, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        type={dialogState.type}
      >
        {dialogState.action === 'confirm_payment' && (
          <div className="mb-4 text-left bg-gray-50 p-3 rounded-lg border border-gray-200/60">
            <label className="block text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">{fw.received_by || "Received By"}</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-200/80 focus:border-blue-500 rounded-md px-3 py-2 text-xs text-gray-600 outline-none transition-all"
              placeholder={fw.name || "Enter name"}
              value={cashConfirmedBy}
              onChange={e => setCashConfirmedBy(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </ConfirmationDialog>

      <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Table Header - Mobile Optimized */}
        <div className="hidden sm:grid grid-cols-12 bg-gray-50 text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider py-3 px-4 sm:px-5 border-b border-gray-100">
          <div className="col-span-2">{fw.bill_number || "Bill Number"}</div>
          <div className="col-span-2">{fw.customer || "Customer"}</div>
          <div className="col-span-2">{fw.issued_on || "Issued On"}</div>
          <div className="col-span-1">{fw.method || "Method"}</div>
          <div className="col-span-1">{fw.amount || "Amount"}</div>
          <div className="col-span-1">{fw.status || "Status"}</div>
          <div className="col-span-2 text-center">{fw.cash_received || "Cash Received?"}</div>
          <div className="col-span-1 text-center">{fw.action || "Action"}</div>
        </div>

        <div className="divide-y divide-gray-100">
          {bills.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-400 text-sm">{fw.no_pending_bills || "No pending bills found"}</div>
          ) : (
            bills.map((bill) => (
              <div key={bill.id} className="p-3 sm:p-0 sm:grid sm:grid-cols-12 sm:items-center sm:px-5 sm:py-3 hover:bg-gray-50/30 transition-colors">
                
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-medium text-gray-800">{bill.bill_number}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{bill.customer_name}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{fw[bill.status] || bill.status}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>{bill.issued_at || bill.created_at?.split('T')[0]}</span>
                      <span>•</span>
                      <span className="capitalize">{fw[bill.payment_method] || bill.payment_method}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{bill.total_amount || bill.amount} {fw[bill.currency] || bill.currency || "QAR"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-gray-400">{fw.yes?.toUpperCase() || "Yes"}</span>
                        <button 
                          onClick={() => initiateAction(bill.id, 'yes')}
                          disabled={processingId === bill.id}
                          className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          {processingId === bill.id ? <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /> : <Check className="w-3 h-3 text-green-500" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-gray-400">{fw.no?.toUpperCase() || "No"}</span>
                        <button 
                          onClick={() => initiateAction(bill.id, 'no')}
                          className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                   <button
              onClick={() => handleViewBill(bill.id)}
              className="w-6 h-6 rounded-md bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center shadow-sm"
            >
              <IconView className="w-3 h-3 text-white" />
            </button>
              </div>
                </div>

                {/* Desktop View */}
                <div className="hidden sm:contents">
                  {/* Bill Number */}
                  <div className="col-span-2 text-xs font-normal text-gray-600">
                    {bill.bill_number}
                  </div>

                  {/* Customer */}
                  <div className="col-span-2 text-xs font-normal text-gray-600">
                    {bill.customer_name}
                  </div>

                  {/* Issued on */}
                  <div className="col-span-2 text-xs text-gray-500">
                    {bill.issued_at || bill.created_at?.split('T')[0]}
                  </div>

                  {/* Method */}
                  <div className="col-span-1 text-xs text-gray-500 capitalize">
                    {bill.payment_method}
                  </div>

                  {/* Amount */}
                  <div className="col-span-1 text-xs font-medium text-gray-700">
                    {bill.total_amount || bill.amount} {fw[bill.currency] || bill.currency || "QAR"}
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{fw[bill.status] || bill.status}</span>
                  </div>

                  {/* Actions: Yes/No */}
                  <div className="col-span-2 flex justify-center items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-gray-400 mb-1">{fw.yes?.toUpperCase() || "Yes"}</span>
                      <button 
                        onClick={() => initiateAction(bill.id, 'yes')}
                        disabled={processingId === bill.id}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                      >
                        {processingId === bill.id ? <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /> : <Check className="w-3.5 h-3.5 text-green-500" />}
                      </button>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-gray-400 mb-1">{fw.no?.toUpperCase() || "No"}</span>
                      <button 
                        onClick={() => initiateAction(bill.id, 'no')}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                      >
                        <X className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* View Action */}
   <div className="col-span-1 flex flex-col items-center justify-center">
  <span className="text-[8px] text-gray-400 mb-1">
    {fw.view || "View"}
  </span>

  <button
    onClick={() => handleViewBill(bill.id)}
    className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center shadow-sm"
  >
    <IconView className="w-3.5 h-3.5 text-white" />
  </button>
</div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingBills;