import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCustomerCompanyReviews, getCustomerProductReviews } from "../api"
import { FaCalendarAlt, FaEdit, FaTrash, FaStar, FaChevronRight } from "react-icons/fa"
import { error } from "../utils/logger";

function ReviewedItems({
  reviewedItems,
  setReviewedItems,
  onStartEditReview,
  onDeleteReview,
  refreshTrigger
}) {
  const customer = useSelector(state => state.auth.user);
  
  // Safe guard for reviewedItems
  const safeReviewedItems = Array.isArray(reviewedItems) ? reviewedItems : [];

  useEffect(() => {
    if (!customer) {
      setReviewedItems([]);
      return;
    }
    fetchReviewedReviews();
  }, [customer?.id, refreshTrigger]);

  const fetchReviewedReviews = async () => {
    if (!customer?.id) return;

    try {
      const [companyRes, productRes] = await Promise.all([
        getCustomerCompanyReviews(customer.id),
        getCustomerProductReviews(customer.id),
      ]);

      const companyReviews = (companyRes.data?.companies || []).flatMap(company =>
        (company.services || []).map(service => ({
          id: company.company_id,
          review_id: service.review_id,
          productName: company.company_name,
          description: service.service_name,
          type: "company",
          rating: service.rating,
          comment: service.comment,
          company_id: company.company_id,
          service_name: service.service_name,
          reviewedDate: service.reviewed_at
            ? new Date(service.reviewed_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent",
          reviewedTime: service.reviewed_at
            ? new Date(service.reviewed_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        }))
      );

      const productReviews = (productRes.data?.products || []).map(item => ({
        id: item.product_id,
        review_id: item.review_id,
        productName: item.name,
        description: item.description,
        type: "product",
        rating: item.rating,
        comment: item.comment,
        product_id: item.product_id,
        reviewedDate: item.reviewed_at
          ? new Date(item.reviewed_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recent",
        reviewedTime: item.reviewed_at
          ? new Date(item.reviewed_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      }));

      // 🔥 KEEP optimistic reviews, replace when backend returns real ones
      setReviewedItems(prev => {
        const apiItems = [...companyReviews, ...productReviews];
        const apiIds = new Set(apiItems.map(i => i.review_id));

        const optimistic = prev.filter(
          i => typeof i.review_id === "string" && i.review_id.startsWith("temp-")
        );

        return [...optimistic, ...apiItems];
      });

    } catch (err) {
  error("ReviewedItems: failed to load reviews", err);
}

  };

  const updateReviewedItem = (reviewId, updatedData) => {
    setReviewedItems(prev =>
      prev.map(item =>
        item.review_id === reviewId ? { ...item, ...updatedData } : item
      )
    );
  };

  const removeReviewedItem = (reviewId) => {
    setReviewedItems(prev =>
      prev.filter(item => item.review_id !== reviewId)
    );
  };

  if (safeReviewedItems.length === 0) {
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
          No Reviewed Items
        </h3>
        <p className="text-gray-400 text-sm sm:text-base px-4 font-light">
          Your reviewed items will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
      {/* STEP 2 CHANGE: Add isOptimistic variable inside map */}
      {safeReviewedItems.map((item) => {
        const isOptimistic =
          typeof item.review_id === "string" &&
          item.review_id.startsWith("temp-");

        return (
          <div
            key={`reviewed-${item.review_id || item.id}`}
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
            {/* ===== HEADER SECTION ===== */}
            <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4">
              {/* Left: Reviewed date with icon */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="
                  w-7 h-7 sm:w-9 sm:h-9
                  rounded-lg sm:rounded-xl
                  bg-gradient-to-br from-blue-50 to-blue-100/30
                  flex items-center justify-center
                  shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]
                  border border-blue-100/50
                ">
                  <FaCalendarAlt className="text-xs sm:text-base text-blue-500/80" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-gray-500 font-light">
                    Reviewed on
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex flex-row sm:items-center gap-2">
                      <span className="text-[11px] sm:text-sm font-medium text-gray-800">
                        {item.reviewedDate}
                      </span>
                      {item.reviewedTime && (
                        <>
                          <span className="hidden sm:inline text-xs text-gray-400">•</span>
                          <span className="text-xs sm:text-sm text-gray-600">
                            {item.reviewedTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Type badge */}
              <div className="
                px-2 py-1.5 sm:px-4 sm:py-2
                rounded-lg
                bg-gradient-to-r from-blue-500/5 to-blue-500/10
                backdrop-blur-sm
                border border-blue-200/30
              ">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-blue-600">
                    {item.type === 'company' ? 'Company' : 'Product'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ultra thin divider */}
            <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />

            {/* ===== MAIN CONTENT SECTION ===== */}
            <div className="
              px-4 sm:px-5 md:px-6 py-4 md:py-5
              gap-3 sm:gap-4 md:gap-5
            ">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                
                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <span className="
                      text-xs sm:text-sm
                      text-gray-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-full border border-blue-200
                      font-medium
                    ">
                      {item.type === 'company' ? 'Company Review' : 'Product Review'}
                    </span>
                  </div>
                  
                  <div className="mb-3 sm:mb-4">
                    <h3 className="
                      text-lg sm:text-xl md:text-2xl
                      text-gray-900 font-semibold
                      mb-1 sm:mb-2
                    ">
                      {item.productName}
                    </h3>
                    {item.description && (
                      <p className="
                        text-sm sm:text-base
                        text-gray-600 font-normal
                        line-clamp-2
                      ">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Service Name if available */}
                  {item.service_name && (
                    <div className="mb-3 sm:mb-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="
                          text-xs sm:text-sm
                          text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 rounded-full border border-gray-200
                          font-medium
                        ">
                          Service: {item.service_name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Star Rating */}
                  {item.rating && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`
                                w-4 h-4 sm:w-5 sm:h-5
                                ${star <= item.rating 
                                  ? "text-blue-400 fill-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" 
                                  : "text-gray-300/60 fill-gray-300/60 hover:text-blue-300/70 hover:fill-blue-300/70"
                                }
                              `}
                            />
                          ))}
                          <span className="ml-2 text-sm sm:text-base font-medium text-gray-700">
                            {item.rating}.0
                          </span>
                        </div>
                        
                        {/* Comment */}
                        {item.comment && (
                          <div className="
                            max-w-full
                            sm:max-w-sm md:max-w-md lg:max-w-lg
                            px-3 py-2
                            rounded-lg
                            bg-gradient-to-r from-gray-50/50 to-gray-100/30
                            border border-gray-200/50
                          ">
                            <p className="
                              text-xs sm:text-sm
                              text-gray-600 font-normal
                              line-clamp-2 sm:line-clamp-1
                            ">
                              "{item.comment}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Edit Button */}
                    <button
                      disabled={isOptimistic}
                      onClick={() => onStartEditReview(item, updateReviewedItem)}
                      className={`
                        w-full sm:w-auto
                        px-4 py-2.5 sm:px-5 sm:py-2.5
                        rounded-lg sm:rounded-xl
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
                        group/edit ${isOptimistic ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                    >
                      <FaEdit className="text-sm" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      disabled={isOptimistic}
                      onClick={() =>
                        onDeleteReview(item.review_id, item.id, removeReviewedItem)
                      }
                      className={`
                        w-full sm:w-auto
                        px-4 py-2.5 sm:px-5 sm:py-2.5
                        rounded-lg sm:rounded-xl
                        bg-gradient-to-r from-white to-red-50/30
                        text-red-600
                        border border-red-200/50
                        text-sm font-medium
                        shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.02)]
                        hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_8px_rgba(239,68,68,0.1)]
                        active:scale-[0.98]
                        transition-all duration-200
                        flex items-center justify-center
                        gap-2
                        whitespace-nowrap
                        group/delete
                        ${isOptimistic ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                    >
                      <FaTrash className="text-sm" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewedItems;