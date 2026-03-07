import React, { useState, useEffect } from "react";
import {
  IconView,
 
} from "./CompanySvg";
import { getPaidBills, getBillDetails, downloadInvoice, sendInvoice } from "../companyDashboardApi";
import BillDetailsModal from "./BillDetailsModal";
import { showToast } from "../utils/showToast";
import toast from "react-hot-toast";
import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";

function PaidBills({ onBack }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await getPaidBills();
      const list = res.data?.data || res.data || [];
      setBills(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching paid bills:", error);
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

  const handleDownload = async (billId) => {
    setProcessingId(billId);
    try {
      const response = await downloadInvoice(billId);
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${billId}.pdf`); // Assuming PDF
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice");
    } finally {
      setProcessingId(null);
    }
  };

  const handleEmail = async (billId) => {
    if (!window.confirm("Send invoice via email?")) return;
    setProcessingId(billId);
    try {
      await sendInvoice(billId); // Assuming generic sendInvoice works for bills too or implies same ID structure
      toast.success("Invoice sent to email");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    } finally {
      setProcessingId(null);
    }
  };

  

return (
    <div dir={isRTL ? "rtl" : "ltr"} className="animate-fadeIn">
      <BillDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bill={selectedBill}
      />

      <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Table Header - Mobile Optimized */}
      <div className="hidden sm:grid grid-cols-12 bg-gray-50 text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider py-3 px-5 border-b border-gray-100 items-center gap-1">
  <div className="col-span-2 truncate">{fw.bill_number || "Bill Number"}</div>
  <div className="col-span-2">{fw.customer || "Customer"}</div>
  <div className="col-span-2">{fw.issued_on || "Issued On"}</div>
  <div className="col-span-1">{fw.method || "Method"}</div>
  <div className="col-span-1">{fw.amount || "Amount"}</div>
  <div className="col-span-1">{fw.status || "Status"}</div>
  <div className="col-span-1">{fw.received_by || "Received By"}</div>
  <div className="col-span-2 text-right">{fw.action || "Action"}</div>
</div>

        <div className="divide-y divide-gray-100">
          {bills.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">{fw.no_paid_bills || "No paid bills found"}</div>
          ) : (
            bills.map((bill) => (
              <div key={bill.id} className="p-3 sm:p-0 sm:grid sm:grid-cols-12 sm:items-center sm:px-5 sm:py-3 hover:bg-gray-50/30 transition-colors gap-1">
                
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-medium text-gray-700">{bill.bill_number}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{bill.customer_name}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{fw[bill.status] || bill.status}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>{bill.issued_at || bill.created_at?.split('T')[0]}</span>
                      <span>•</span>
                      <span className="capitalize">{fw[bill.currency?.toLowerCase()] || bill.currency || "QAR"}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{bill.total_amount || bill.amount} {fw[bill.currency] || bill.currency || "QAR"}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <div className="text-[10px] text-gray-500">
                      <span className="text-gray-400">{fw.received_by || "Received By"}: </span>
                      <span className="font-medium text-gray-600">{bill.cash_confirmed_by || "-"}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-gray-400 mb-1">{fw.view || "View"}</span>
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
                  <div className="col-span-2 text-xs font-normal text-gray-600 truncate" title={bill.bill_number}>
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
                   {fw[bill.payment_method?.toLowerCase()] || bill.payment_method || fw.cash || "Cash"}
                  </div>

                  {/* Amount */}
                  <div className="col-span-1 text-xs font-medium text-gray-700">
                    {bill.total_amount || bill.amount} {fw[bill.currency?.toLowerCase()] || bill.currency || "QAR"}
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                      {fw[bill.status] || bill.status}
                    </span>
                  </div>

                  {/* Received By */}
                  <div className="col-span-1 text-xs text-gray-500 break-words">
                    {bill.cash_confirmed_by || "-"}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end items-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-gray-400 mb-1">{fw.view || "View"}</span>
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

export default PaidBills;