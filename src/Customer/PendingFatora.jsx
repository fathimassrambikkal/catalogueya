import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import {
 
  WalletIcon,
  ClockIcon 
} from "./Svgicons";
import { useNavigate } from "react-router-dom";
import { getPendingBills, rejectPublicBill  } from "../api";
import CancelBillModal from "./CancelBillModal";
// Memoized helper components
const LoadingSkeleton = React.memo(() => (
  <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
    {/* Generate 3 skeleton cards */}
    {[1, 2, 3].map((index) => (
      <div
        key={index}
        className="
          bg-white/95 backdrop-blur-xl
          rounded-xl sm:rounded-2xl
          border border-white/80
          shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)]
          overflow-hidden
          animate-pulse
          glass-effect
        "
      >
        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="
              w-7 h-7 sm:w-9 sm:h-9
              rounded-lg sm:rounded-xl
              bg-gradient-to-br from-gray-100 to-gray-200/40
              flex items-center justify-center
              border border-gray-100/50
            "></div>
            <div className="flex flex-col gap-2">
              <div className="w-16 h-3 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/60"></div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-20 h-3 rounded-md bg-gradient-to-r from-gray-200 to-gray-300/60"></div>
                <div className="hidden sm:block w-3 h-3 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/50"></div>
                <div className="hidden sm:block w-16 h-3 rounded-md bg-gradient-to-r from-gray-200 to-gray-300/60"></div>
              </div>
            </div>
          </div>

          {/* Status badge skeleton */}
          <div className="
            px-2 py-1.5 sm:px-4 sm:py-2
            rounded-lg
            bg-gradient-to-r from-gray-100/30 to-gray-200/20
            border border-gray-100/40
          ">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-200"></div>
              <div className="w-16 h-3 rounded-md bg-gradient-to-r from-gray-200 to-gray-300/60"></div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-200/30 to-transparent" />

        {/* Main Content Skeleton */}
        <div className="px-4 sm:px-5 md:px-6 py-4 md:py-5 gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Company Name Skeleton */}
              <div className="mb-3 sm:mb-4">
                <div className="w-3/4 h-4 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300/60"></div>
              </div>

              {/* Invoice Info Skeleton */}
              <div className="mb-1 sm:mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2/3 h-4 rounded-md bg-gradient-to-r from-gray-200 to-gray-300/60"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  <div className="w-1/3 h-3 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/60"></div>
                </div>
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0 flex justify-end">
              <div className="
                w-24 h-10
                rounded-lg sm:rounded-xl
                bg-gradient-to-r from-gray-100 to-gray-200/60
                border border-gray-100/50
              "></div>
            </div>
          </div>
        </div>

        {/* Amount Section Skeleton */}
        <div className="
          px-4 sm:px-5 md:px-6 py-3 md:py-4
          bg-gradient-to-r from-gray-50/50 to-gray-100/30
          border-t border-gray-100/50
        ">
          <div className="flex justify-between items-center">
            <div className="w-20 h-3 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/60"></div>
            <div className="flex items-baseline gap-1">
              <div className="w-16 h-4 rounded-md bg-gradient-to-r from-gray-200 to-gray-300/60"></div>
              <div className="w-10 h-3 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/60"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
));

const ErrorState = React.memo(({ error, onRetry }) => (
  <div className="text-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.02)] mx-auto w-full max-w-md lg:max-w-lg glass-effect">
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-50 to-red-100/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.8),0_4px_20px_rgba(239,68,68,0.08)] border border-red-100/60">
    
    </div>
    <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 mb-2 sm:mb-3 tracking-tight">
      Error 
    </h3>
    <p className="text-gray-600 text-sm sm:text-base px-4 mb-4 font-light">
      {error}
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-[0_2px_12px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-200"
    >
      Try Again
    </button>
  </div>
));

const EmptyState = React.memo(() => (
  <div className="text-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.02)] mx-auto w-full max-w-md lg:max-w-lg glass-effect">
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-white to-blue-50/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.8),0_4px_20px_rgba(59,130,246,0.08)] border border-white/60">
 
    </div>
  </div>
));

// Memoized Fatora Card component
const FatoraCard = React.memo(({ fatora, onPay, onCancel  }) => {
  const navigate = useNavigate();
  
  const handlePayClick = useCallback(() => {
    onPay(fatora);
  }, [fatora, onPay]);

 const handleCancel = useCallback(() => {
  onCancel(fatora);
}, [onCancel, fatora]);

  const handleView = useCallback(() => {
    navigate(`/customer/bill-view/${fatora.originalData.public_token}`);
  }, [navigate, fatora]);

  const StatusButton = useMemo(() => {
    // 🟢 ONLINE + sent
    if (fatora.status === "sent" && fatora.paymentMethod === "online") {
      return (
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handlePayClick}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition"
          >
            Pay Now
          </button>

          <button
            onClick={handleCancel}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      );
    }

    // 🟡 CASH + sent
    if (fatora.status === "sent" && fatora.paymentMethod === "cash") {
      return (
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleView}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100 hover:bg-blue-100 transition"
          >
            View
          </button>

          <button
            onClick={handleCancel}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      );
    }

    // 🟠 CASH PENDING CONFIRM
    if (fatora.status === "cash_pending_confirm") {
      return (
        <button
          onClick={handleView}
          className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 text-sm font-medium border border-orange-200 hover:bg-orange-100 transition"
        >
          View
        </button>
      );
    }

    return null;

  }, [
    fatora.status,
    fatora.paymentMethod,
    handlePayClick,
    handleCancel,
    handleView
  ]);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.06)] glass-effect">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/30 flex items-center justify-center border border-blue-100/50">
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500/80" />
          </div>

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500 font-light">
              Received
            </span>

            <span className="text-[11px] sm:text-base font-medium text-gray-800">
              {fatora.receivedDate}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          {fatora.receivedTime && (
            <span className="text-xs sm:text-sm text-gray-600">
              {fatora.receivedTime}
            </span>
          )}
        </div>
      </div>

      <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />

      {/* Main Content */}
      <div className="px-4 sm:px-5 md:px-6 py-4 md:py-5 gap-3 sm:gap-4 md:gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="mb-3 sm:mb-4">
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-normal truncate">
                {fatora.companyName}
              </p>
            </div>

            <div className="mb-1 sm:mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base md:text-md font-medium text-gray-900 truncate">
                  FN: {fatora.fatoraNumber}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                <WalletIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                {fatora.paymentMethod === "cash" ? "Cash Payment" : "Online Payment"}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex justify-end">
            {StatusButton}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="px-4 sm:px-5 md:px-6 py-3 md:py-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 border-t border-gray-100/50">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Total Amount</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
              {fatora.amount}
            </span>
            <span className="text-xs sm:text-sm text-gray-600">
              {fatora.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Memoized helper functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${day} ${month} ${year}`;
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

// Main component
function PendingFatora() {
  const [fatoras, setFatoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
const [isCancelOpen, setIsCancelOpen] = useState(false);
const [selectedBill, setSelectedBill] = useState(null);
  const fetchPendingFatoras = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPendingBills();
      const pendingBills = response.data?.data || [];
      
      // Batch processing for better performance
      const transformedFatoras = pendingBills.map(bill => ({
        id: bill.id,
        companyName: bill.company?.name,
        fatoraNumber: bill.bill_number,
        receivedDate: formatDate(bill.issued_at),
        receivedTime: formatTime(bill.issued_at),
        amount: bill.total_amount,
        currency: bill.currency,
        status: bill.status,
        paymentMethod: bill.payment_method,
        originalData: bill
      }));
      
      setFatoras(transformedFatoras);
      setError(null);
    } catch (err) {
      console.error("Error fetching pending fatoras:", err);
      setError("Failed to load pending invoices. Please try again later.");
      setFatoras([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const handleOpenCancel = useCallback((fatora) => {
  setSelectedBill(fatora);
  setIsCancelOpen(true);
}, []);

const handleCloseCancel = useCallback(() => {
  setIsCancelOpen(false);
  setSelectedBill(null);
}, []);

const handleSubmitCancel = useCallback(async (reason) => {
  try {
    if (!selectedBill?.originalData?.public_token) return;

    await rejectPublicBill(
      selectedBill.originalData.public_token,
      reason
    );

    setIsCancelOpen(false);
    setSelectedBill(null);

    // Refresh list after cancel
    fetchPendingFatoras();

  } catch (error) {
    console.error("Cancel failed:", error);
    alert("Failed to cancel bill");
  }
}, [selectedBill, fetchPendingFatoras]);

  useEffect(() => {
    // Immediate visibility with concurrent rendering
    const controller = new AbortController();
    
    fetchPendingFatoras();
    
    return () => controller.abort();
  }, [fetchPendingFatoras]);

  const handlePayNow = useCallback((fatora) => {
    navigate("/customer/pay", {
      state: { fatora: fatora.originalData }
    });
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    fetchPendingFatoras();
  }, [fetchPendingFatoras]);

  // Memoize the main render content
  const content = useMemo(() => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={handleRefresh} />;
    }

    if (fatoras.length === 0) {
      return <EmptyState />;
    }




    return (
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        {fatoras.map((fatora) => (
          <FatoraCard
            key={`fatora-${fatora.id}-${fatora.status}`}
            fatora={fatora}
            onPay={handlePayNow}
            onCancel={handleOpenCancel}
          />
        ))}
      </div>
    );
  }, [loading, error, fatoras, handleRefresh, handlePayNow]);

  return (
    
    <Suspense fallback={<LoadingSkeleton />}>

      {content}
      <CancelBillModal
  isOpen={isCancelOpen}
  onClose={handleCloseCancel}
  onSubmit={handleSubmitCancel}
  companyName={selectedBill?.companyName}
/>
    </Suspense>
  );
}

export default React.memo(PendingFatora);