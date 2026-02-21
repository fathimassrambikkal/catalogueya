import React, { useState, useEffect } from "react";
import {
  IconView,
  IconInvoice,
 
} from "./CompanySvg";
import { getUnpaidBills, getBillDetails, reactivateBill, markBillAsComplete } from "../companyDashboardApi";
import BillDetailsModal from "./BillDetailsModal";
import { showToast } from "../utils/showToast";
import {  X } from "lucide-react";
import toast from "react-hot-toast";


import ConfirmationDialog from "./ConfirmationDialog";

function UnpaidBills({ onBack }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [dialogState, setDialogState] = useState({ isOpen: false, type: 'info', billId: null, action: null });

  const [reactionReason, setReactionReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);


  const fetchBills = async () => {
    try {
      const res = await getUnpaidBills();
      const list = res.data?.data || res.data || [];
      setBills(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching unpaid bills:", error);
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
    if (action === 'reactivate') {
      setDialogState({
        isOpen: true,
        type: 'warning',
        title: 'Reactivate Bill?',
        message: 'Are you sure you want to reactivate this bill? It will be moved to the unpaid/active state.',
        confirmText: 'Reactivate',
        cancelText: 'Cancel',
        billId,
        action: 'reactivate'
      });
    } else if (action === 'complete') {
      setDialogState({
        isOpen: true,
        type: 'success',
        title: 'Mark as Complete?',
        message: 'This will assume the bill is fully paid and completed. Proceed?',
        confirmText: 'Mark Complete',
        cancelText: 'Cancel',
        billId,
        action: 'complete'
      });
    }
  };

  const handleConfirmAction = async () => {
    const { billId, action } = dialogState;
    if (!billId) return;

    setProcessingId(billId);
    try {
      if (action === 'reactivate') {
        await reactivateBill(billId);
        toast.success("Bill reactivated successfully");
      } else if (action === 'complete') {
        await markBillAsComplete(billId);
        toast.success("Bill marked as complete");
      }
      fetchBills();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setProcessingId(null);
      setDialogState({ isOpen: false, type: 'info', billId: null, action: null });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

return (
    <div className="animate-fadeIn">
      {/* Reason Modal */}
    {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <IconInvoice className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">Unpaid Reason</h3>
              </div>
              <button 
                onClick={() => setShowReasonModal(false)}
                className="p-1 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100/80 leading-relaxed">
                {reactionReason}
              </p>
            </div>
          </div>
        </div>
      )}
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
      />

      <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Table Header - Mobile Optimized */}
        <div className="hidden sm:grid grid-cols-12 bg-gray-50 text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider py-3 px-5 border-b border-gray-100 items-center">
          <div className="col-span-2">Bill Number</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Issued on</div>
          <div className="col-span-1">Method</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-gray-100">
          {bills.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No unpaid bills found.</div>
          ) : (
            bills.map((bill) => (
              <div key={bill.id} className="p-3 sm:p-0 sm:grid sm:grid-cols-12 sm:items-center sm:px-5 sm:py-3 hover:bg-gray-50/30 transition-colors">
                
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-medium text-gray-700">{bill.bill_number}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{bill.customer_name}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{bill.status}</span>
                      {bill.unpaid_reason && (
                        <button 
                          onClick={() => { setReactionReason(bill.unpaid_reason); setShowReasonModal(true); }}
                          className="text-[8px] text-red-500 underline mt-1"
                        >
                          View Reason
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>{bill.issued_at || bill.created_at?.split('T')[0]}</span>
                      <span>•</span>
                      <span className="capitalize">{bill.payment_method || 'Cash'}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{bill.total_amount || bill.amount} {bill.currency || 'QR'}</span>
                  </div>

                  <div className="flex items-center justify-end pt-1 border-t border-gray-100">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-gray-400 mb-1">View</span>
                      <div 
                        onClick={() => handleViewBill(bill.id)}
                        className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center shadow-sm"
                      >
                        <IconView className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden sm:contents">
                  {/* Bill Number */}
                  <div className="col-span-2 text-xs font-normal text-gray-600 break-words">
                    {bill.bill_number}
                  </div>

                  {/* Customer */}
                  <div className="col-span-2 text-xs font-normal text-gray-600 break-words">
                    {bill.customer_name}
                  </div>

                  {/* Issued on */}
                  <div className="col-span-2 text-xs text-gray-500">
                    {bill.issued_at || bill.created_at?.split('T')[0]}
                  </div>

                  {/* Method */}
                  <div className="col-span-1 text-xs text-gray-500 capitalize">
                    {bill.payment_method || 'Cash'}
                  </div>

                  {/* Amount */}
                  <div className="col-span-2 text-xs font-medium text-gray-700">
                    {bill.total_amount || bill.amount} {bill.currency || 'QR'}
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize block w-fit">
                      {bill.status}
                    </span>
                    {bill.unpaid_reason && (
                      <button 
                        onClick={() => { setReactionReason(bill.unpaid_reason); setShowReasonModal(true); }}
                        className="text-[8px] text-red-500 underline mt-1 hover:text-red-600 transition-colors"
                      >
                        View Reason
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end items-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-gray-400 mb-1">View</span>
                      <div 
                        onClick={() => handleViewBill(bill.id)}
                        className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center shadow-sm"
                      >
                        <IconView className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
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

export default UnpaidBills;


