import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCustomerPendingReviews } from "../api"
import { FaClock, FaStar, FaChevronRight } from "react-icons/fa"

function AwaitingReviews({ onStartLeaveReview }) {
  const [awaitingReviews, setAwaitingReviews] = useState([]);
  const customer = useSelector(state => state.auth.user);

  const fetchAwaitingReviews = async () => {
    try {
      const pendingRes = await getCustomerPendingReviews();
      console.log("Awaiting reviews response:", pendingRes);
      
 const reviews = (pendingRes.data?.data || []).map(item => {
  const reviewDate = item.created_at
    ? new Date(item.created_at)
    : new Date();

  const isCompany = Boolean(item.company_id);

  return {
    id: item.id,
    review_id: null,

    type: isCompany ? "company" : "product",

    company_id: isCompany ? item.company_id : null,
    product_id: !isCompany ? item.product_id : null,

    productName: isCompany
      ? item.company?.name_en || "Company"
      : item.product?.name || "Product",

    description: isCompany
      ? (item.company?.description_en || "").replace(/<[^>]*>/g, "")
      : item.product?.description || "",

    service_name: isCompany ? item.service_name : null,

    receivedDate: reviewDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    receivedTime: reviewDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
});

      
      setAwaitingReviews(reviews);
    } catch (err) {
      console.error("Failed to load awaiting reviews", err);
    }
  };

  useEffect(() => {
    if (!customer) {
      setAwaitingReviews([]);
      return;
    }
    fetchAwaitingReviews();
  }, [customer?.id]);

  const removeAwaitingItem = (itemId) => {
    setAwaitingReviews(prev => prev.filter(item => item.id !== itemId));
  };

  if (awaitingReviews.length === 0) {
    return (
      <div className="
        text-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20
        bg-white/95 backdrop-blur-2xl
        rounded-2xl sm:rounded-3xl
        border border-white/80
        shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.02)]
        mx-auto w-full max-w-md lg:max-w-lg
        glass-effect
      ">
        <div className="
          w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
          bg-gradient-to-br from-white to-blue-50/30
          rounded-full 
          flex items-center justify-center 
          mx-auto mb-4 sm:mb-6
          shadow-[inset_0_0_20px_rgba(255,255,255,0.8),0_4px_20px_rgba(59,130,246,0.08)]
          border border-white/60
        ">
          <div className="text-2xl sm:text-3xl text-blue-300">
            ⭐
          </div>
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 mb-2 sm:mb-3 tracking-tight">
          No Pending Reviews
        </h3>
        <p className="text-gray-400 text-sm sm:text-base px-4 font-light">
          All your reviews are up to date
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
      {awaitingReviews.map((review) => (
        <div
          key={`awaiting-${review.id}`}
          className="
            bg-white/95 backdrop-blur-xl
            rounded-xl sm:rounded-2xl
            border border-white/80
            shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)]
            overflow-hidden
            transition-all duration-300
            hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.06)]
            glass-effect
          "
        >
          {/* ===== COMPACT HEADER ===== */}
          <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4">
            {/* Left: Status with icon */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="
                w-7 h-7 sm:w-9 sm:h-9
                rounded-lg sm:rounded-xl
                bg-gradient-to-br from-blue-50 to-blue-100/30
                flex items-center justify-center
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]
                border border-blue-100/50
              ">
                <FaClock className="text-xs sm:text-base text-blue-500/80" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-500 font-light">
                  Received
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex flex-row sm:items-center gap-2">
                    <span className="text-[11px] sm:text-base font-medium text-gray-800">
                      {review.receivedDate}
                    </span>
                    {review.receivedTime && (
                      <>
                        <span className="hidden sm:inline text-xs text-gray-400">•</span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {review.receivedTime}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Type badge - similar to time remaining in fatora */}
            <div className="
              px-2 py-1.5 sm:px-4 sm:py-2
              rounded-lg
              bg-gradient-to-r from-blue-500/5 to-blue-500/10
              backdrop-blur-sm
              border border-blue-200/30
            ">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-blue-600">
                  {review.type === 'company' ? 'Company' : 'Product'}
                </span>
              </div>
            </div>
          </div>

          {/* Ultra thin divider */}
          <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />

          {/* ===== COMPACT MAIN CONTENT ===== */}
          <div className="
            px-4 sm:px-5 md:px-6 py-4 md:py-5
            gap-3 sm:gap-4 md:gap-5
          ">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              {/* Review Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-1">
                  <span className="
                    text-xs sm:text-sm
                    text-gray-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-full border border-blue-200
                    font-medium
                  ">
                    {review.type === 'company' ? 'Company Review' : 'Product Review'}
                  </span>
                </div>
                
                <div className="mb-3 sm:mb-4">
                  <h3 className="
                    text-lg sm:text-xl md:text-2xl
                    text-gray-900 font-semibold
                    mb-1 sm:mb-2
                  ">
                    {review.productName}
                  </h3>
                  {review.description && (
                    <p className="
                      text-sm sm:text-base
                      text-gray-600 font-normal
                      line-clamp-2
                    ">
                      {review.description}
                    </p>
                  )}
                </div>

                {/* Service Name if available */}
                {review.service_name && (
                  <div className="mb-2 sm:mb-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="
                        text-xs sm:text-sm
                        text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 rounded-full border border-gray-200
                        font-medium
                      ">
                        Service: {review.service_name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Small Leave Review Button */}
              <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={() => onStartLeaveReview(review, removeAwaitingItem)}
                  className="
                    w-full sm:w-auto
                    px-4 py-2.5 sm:px-6 sm:py-3 md:px-5 md:py-2.5
                    rounded-lg sm:rounded-xl md:rounded-xl
                    bg-gradient-to-r from-blue-500 to-blue-600
                    text-white
                    text-sm sm:text-base font-medium
                    shadow-[0_2px_12px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
                    hover:shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]
                    active:scale-[0.98]
                    transition-all duration-200
                    flex items-center justify-center
                    gap-2
                    group
                    whitespace-nowrap
                  "
                >
                 
                  <span>Leave Review</span>
                  <FaChevronRight className="text-xs sm:text-sm opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AwaitingReviews;