import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronRight, FaStar } from "react-icons/fa";
import FatoraPreviewModal from "./FatoraPreviewModal";
import axios from "axios";
import { getPaidBills } from "../api";

function PastFatora() {
  const [ratings, setRatings] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);

  // Fetch paid bills on component mount
  useEffect(() => {
    fetchPaidBills();
  }, []);

  const fetchPaidBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPaidBills();
      
      if (response.data && response.data.data) {
        // Transform API data to match UI structure
        const transformedData = response.data.data.map((bill) => ({
          id: bill.id,
          date: formatDate(bill.paid_at || bill.issued_at),
          time: formatTime(bill.paid_at || bill.issued_at),
          status: bill.status === "paid" ? "Paid" : bill.status,
          company: bill.company?.name || "Unknown Company",
          number: bill.bill_number,
          amount: `${bill.total_amount} ${bill.currency}`,
          // Include additional API data for modal if needed
          originalData: bill
        }));
        
        setInvoices(transformedData);
      }
    } catch (err) {
      console.error("Error fetching paid bills:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day.toString().padStart(2, '0')}`;
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleStarClick = (id, rating) => {
    setRatings(prev => ({ ...prev, [id]: rating }));
  };

  // ===== ENTERPRISE-LEVEL SKELETON LOADING =====
  const SkeletonLoader = () => (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
      {/* Generate 3 skeleton cards */}
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="
            bg-white/97 backdrop-blur-xl
            rounded-xl sm:rounded-2xl
            border border-white/90
            shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
            overflow-hidden
            animate-pulse
          "
        >
          {/* Header Skeleton */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Left: Date skeleton */}
            <div className="flex items-center gap-5">
              <div className="
                w-7 h-7
                rounded-xl
                bg-gradient-to-br from-gray-100 to-gray-200/50
                border border-gray-100/40
              "></div>
              <div className="flex flex-col gap-2">
                <div className="w-16 h-3 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/70"></div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-3 rounded-md bg-gradient-to-r from-gray-200 to-gray-300/70"></div>
                  <div className="w-4 h-3 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/50"></div>
                  <div className="w-14 h-3 rounded-md bg-gradient-to-r from-gray-200 to-gray-300/70"></div>
                </div>
              </div>
            </div>

            {/* Right: Status badge skeleton */}
            <div className="
              px-3 py-2
              rounded-lg
              bg-gradient-to-r from-gray-100/50 to-gray-200/30
              border border-gray-100/30
            ">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                <div className="w-12 h-3 rounded-md bg-gradient-to-r from-gray-200 to-gray-300/70"></div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-100/30 to-transparent" />

          {/* Main Content Skeleton */}
          <div className="px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Company Info Skeleton */}
              <div className="flex-1">
                {/* Company Name Skeleton */}
                <div className="mb-4">
                  <div className="w-3/4 h-6 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300/70 mb-2"></div>
                </div>

                {/* Invoice Number Skeleton */}
                <div className="mb-4">
                  <div className="w-1/2 h-4 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/70"></div>
                </div>

                {/* Amount Skeleton */}
                <div className="w-1/3 h-7 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300/70"></div>
              </div>

              {/* Button Skeleton */}
              <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <div className="
                  w-full sm:w-32
                  h-12
                  rounded-xl
                  bg-gradient-to-r from-gray-100 to-gray-200/50
                  border border-gray-100/50
                "></div>
              </div>
            </div>
          </div>

          {/* Rating Section Skeleton */}
          <div className="
            px-4 sm:px-6 py-4
            bg-gradient-to-r from-gray-50/30 to-gray-100/20
            border-t border-gray-100/40
          ">
            <div className="flex items-center justify-between">
              {/* Rating Label Skeleton */}
              <div className="w-16 h-4 rounded-md bg-gradient-to-r from-gray-100 to-gray-200/70"></div>
              
              {/* Stars Skeleton */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="
                      p-1.5
                      rounded-lg
                    "
                  >
                    <div className="
                      w-6 h-6
                      rounded-full
                      bg-gradient-to-r from-gray-100 to-gray-200/60
                    "></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="
        text-center p-8 sm:p-12 md:p-16 lg:p-20
        bg-white/97 backdrop-blur-xl
        rounded-2xl sm:rounded-3xl
        border border-white/90
        shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_40px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
        mx-auto w-full max-w-md lg:max-w-lg
      ">
        <div className="
          w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
          bg-gradient-to-br from-white to-red-50/40
          rounded-full 
          flex items-center justify-center 
          mx-auto mb-6 sm:mb-8
          shadow-[inset_0_0_24px_rgba(255,255,255,0.9),0_4px_24px_rgba(239,68,68,0.06)]
          border border-white/80
        ">
          <div className="text-3xl sm:text-4xl text-red-300/80">
            ⚠️
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 mb-3 sm:mb-4 tracking-tight">
          Error Loading Data
        </h3>
        <p className="text-gray-500/70 text-sm sm:text-base px-4 font-light tracking-wide mb-4">
          {error}
        </p>
        <button
          onClick={fetchPaidBills}
          className="
            px-6 py-3
            rounded-xl
            bg-gradient-to-r from-blue-500 to-blue-600
            text-white
            text-sm font-medium
            shadow-lg hover:shadow-xl
            transition-all duration-200
            hover:scale-105
            active:scale-95
          "
        >
          Retry
        </button>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="
        text-center p-8 sm:p-12 md:p-16 lg:p-20
        bg-white/97 backdrop-blur-xl
        rounded-2xl sm:rounded-3xl
        border border-white/90
        shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_40px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
        mx-auto w-full max-w-md lg:max-w-lg
        transition-all duration-500
        hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_12px_48px_rgba(0,0,0,0.04)]
      ">
        <div className="
          w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
          bg-gradient-to-br from-white to-blue-50/40
          rounded-full 
          flex items-center justify-center 
          mx-auto mb-6 sm:mb-8
          shadow-[inset_0_0_24px_rgba(255,255,255,0.9),0_4px_24px_rgba(59,130,246,0.06)]
          border border-white/80
          transition-all duration-500
          hover:scale-105 hover:shadow-[inset_0_0_28px_rgba(255,255,255,0.95),0_6px_28px_rgba(59,130,246,0.1)]
        ">
          <div className="text-3xl sm:text-4xl text-blue-300/80">
            📄
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 mb-3 sm:mb-4 tracking-tight">
          No Past Invoices
        </h3>
        <p className="text-gray-500/70 text-sm sm:text-base px-4 font-light tracking-wide">
          Your past invoices will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
      {invoices.map((item) => (
        <div
          key={item.id}
          className="
            bg-white/97 backdrop-blur-xl
            rounded-xl sm:rounded-2xl
            border border-white/90
            shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
            overflow-hidden
            transition-all duration-300
            hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.04)]
            group/card
          "
        >
          {/* ===== HEADER SECTION ===== */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Left: Date with icon */}
            <div className="flex items-center gap-5">
              <div className="
                w-7 h-7
                rounded-xl
                bg-gradient-to-br from-blue-50/50 to-blue-100/20
                flex items-center justify-center
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]
                border border-blue-100/40
                transition-all duration-300
                group-hover/card:scale-105
              ">
                <FaCalendarAlt className="text-sm text-blue-500/70" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500/80 font-light tracking-wide">
                  Paid on
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-gray-900">
                      {item.date}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-[11px] md:text-sm  text-gray-600/80">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status badge */}
            <div className="
              px-2 py-1 md:px-3 md:py-2
              rounded-lg
              bg-gradient-to-r from-blue-500/8 to-blue-500/4
              backdrop-blur-sm
              border border-blue-200/30
              transition-all duration-300
              group-hover/card:border-blue-300/40
            ">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-subtle"></div>
                <span className=" text-[10px] md:text-sm font-medium text-blue-600/90">
                  {item.status}
                </span>
              </div>
            </div>
          </div>

          {/* Ultra thin gradient divider */}
          <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-200/30 to-transparent" />

          {/* ===== MAIN CONTENT SECTION ===== */}
          <div className="px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              {/* Logo and Company Info */}
              <div className="flex items-start gap-4">
                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  {/* Company Name */}
                  <div className="mb-3">
                    <p className="
                      text-lg sm:text-xl
                      text-gray-900 font-medium
                      truncate
                      tracking-tight
                    ">
                      {item.company}
                    </p>
                  </div>

                  {/* Invoice Number */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="
                        text-sm
                        text-gray-600/80 font-normal
                        truncate
                      ">
                        FN: {item.number}
                      </h3>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                      {item.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={() => {
                    setToken(item.originalData.public_token);
                    setOpen(true);
                  }}
                  className="
                    w-full sm:w-auto
                    px-5 py-3
                    rounded-xl
                    bg-gradient-to-r from-white to-blue-50/30
                    text-blue-600
                    border border-blue-200/50
                    text-sm font-medium
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.02)]
                    hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_8px_rgba(59,130,246,0.1)]
                    active:scale-[0.98]
                    transition-all duration-200
                    flex items-center justify-center
                    gap-2
                    whitespace-nowrap
                    group/button
                    relative
                    overflow-hidden
                  "
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700" />
                  
                  <span className="relative">View Details</span>
                  <FaChevronRight className="text-xs opacity-70 group-hover/button:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>

          {/* ===== RATING SECTION ===== */}
          <div className="
            px-4 sm:px-6 py-4
            bg-gradient-to-r from-gray-50/30 to-gray-100/20
            border-t border-gray-100/40
            transition-all duration-300
            group-hover/card:from-gray-50/40 group-hover/card:to-gray-100/30
          ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 tracking-wide">
                  Rate 
                </span>
              </div>
              
              {/* Star Rating (Fixed – no hover preview) */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (ratings[item.id] || 0);

                  return (
                    <button
                      key={star}
                      onClick={() => handleStarClick(item.id, star)}
                      className="
                        p-1.5
                        active:scale-95
                        transition-transform duration-150
                        rounded-lg
                        focus:outline-none
                        focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-1
                      "
                    >
                      <div className="relative">
                        {/* Glow only for selected stars */}
                        {isFilled && (
                          <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-full" />
                        )}

                        <FaStar
                          className={`
                            w-5 h-5 sm:w-6 sm:h-6
                            relative z-10
                            transition-colors duration-200
                            ${isFilled
                              ? "text-blue-400 fill-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]"
                              : "text-gray-300/60 fill-gray-300/60"
                            }
                          `}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
      <FatoraPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        publicToken={token}
      />
    </div>
  );
}

export default PastFatora;