import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {  FaUser, FaBox, FaCogs, FaQuoteLeft } from "react-icons/fa";
import { FaStar, FaPlus } from "./SvgIcons";
import ReviewRequestModal from "./ReviewRequestModal";

import { getCompanyReviewsDashboard, getImageUrl } from "../companyDashboardApi";

const DashboardReviews = ({ companyId }) => {
    const { user } = useSelector((state) => state.auth);
    const userId = user?.id;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState("services"); 
    const [isRequestOpen, setIsRequestOpen] = useState(false);


    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await getCompanyReviewsDashboard(companyId, userId);
            if (res.data?.status === 200) {
                setData(res.data.data);
            }
        } catch (err) {
            console.error("❌ Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    };

   if (loading) {
  return (
    <div className="space-y-6 mt-24 md:mt-12 px-4">

      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-40 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="h-9 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4"
          >
            <div className="space-y-3">
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews List Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>

              <div className="flex-1 space-y-3">
                {/* Name + Date */}
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>

                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="w-3 h-3 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>

                {/* Comment */}
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse"></div>
              </div>

              {/* Right Target */}
              <div className="w-32 space-y-2">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

    const reviewList = data?.[activeType]?.reviews || [];
    const stats = data?.[activeType] || {};
return (
<div className="space-y-4 sm:space-y-6 md:space-y-8 mt-24 md:mt-12 px-2 xs:px-3 sm:px-4 md:px-6">
        
    {/* ===== HEADER with iOS Style Tabs and Request Button ===== */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
        {/* Left side - Title and Request Button */}
        <div className="flex flex-row items-center justify-between sm:justify-start gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Title section */}
            <div className="space-y-0.5 sm:space-y-1 flex-1 sm:flex-none">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                        Reviews
                    </h2>
                    <span className="px-2 py-0.5 sm:px-2 sm:py-1 bg-blue-50 rounded-lg text-blue-600 text-[10px] xs:text-xs sm:text-xs font-medium">
                        {reviewList.length}
                    </span>
                </div>
                <p className="text-[10px] xs:text-xs sm:text-xs text-gray-500 leading-tight sm:leading-normal">
                    Real feedback from customers
                </p>
            </div>

            {/* Request Review Button */}
            <button
             onClick={() => setIsRequestOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
               <FaPlus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />

              
                <span className="inline">Request Review</span>
                
            </button>
        </div>

        {/* Right side - iOS Style Tabs */}
        <div className="inline-flex self-start sm:self-auto p-1 sm:p-1 bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-sm">
            <button
                onClick={() => setActiveType("services")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-xs font-medium transition-all duration-300 ${
                    activeType === "services"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
                <FaCogs className="text-sm sm:text-sm" />
                <span>Service</span>
            </button>
            <button
                onClick={() => setActiveType("products")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-xs font-medium transition-all duration-300 ${
                    activeType === "products"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
                <FaBox className="text-sm sm:text-sm" />
                <span>Product</span>
            </button>
        </div>
    </div>


{/* ================= OVERALL STATS ================= */}
<div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">

    {/* Global Rating */}
    <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-3 sm:py-4 hover:shadow-sm transition-all duration-300">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[clamp(0.6rem,2vw,0.75rem)] text-gray-500 font-medium mb-1 sm:mb-2">
                    Global Rating
                </p>
                <div className="flex items-end gap-1 sm:gap-2">
                    <h3 className="text-[clamp(1rem,4vw,1.5rem)] font-semibold text-gray-900 tracking-tight">
                        {data?.company_rating || 0}
                    </h3>
                    <span className="text-[clamp(0.6rem,2vw,0.875rem)] text-gray-400 mb-0.5">/5</span>
                </div>
            </div>
            <div className="w-[clamp(1.5rem,5vw,2rem)] h-[clamp(1.5rem,5vw,2rem)] rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <FaStar className="w-3 h-3" />
            </div>
        </div>
    </div>

    {/* Total Reviews */}
    <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-3 sm:py-4 hover:shadow-sm transition-all duration-300">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[clamp(0.6rem,2vw,0.75rem)] text-gray-500 font-medium mb-1 sm:mb-2">
                    Total Reviews
                </p>
                <h3 className="text-[clamp(1rem,4vw,1.5rem)] font-semibold text-gray-900 tracking-tight">
                    {data?.total_reviews_count || 0}
                </h3>
            </div>
            <div className="w-[clamp(1.5rem,5vw,2rem)] h-[clamp(1.5rem,5vw,2rem)] rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <FaQuoteLeft className="text-[clamp(0.7rem,2.5vw,0.875rem)]" />
            </div>
        </div>
    </div>

    {/* Average Rating */}
    <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-3 sm:py-4 hover:shadow-sm transition-all duration-300">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[clamp(0.6rem,2vw,0.75rem)] text-gray-500 font-medium mb-1 sm:mb-2">
                    {activeType === "services" ? "Service Avg" : "Product Avg"}
                </p>
                <div className="flex items-end gap-1 sm:gap-2">
                    <h3 className="text-[clamp(1rem,4vw,1.5rem)] font-semibold text-gray-900 tracking-tight">
                        {stats?.avg_rating || 0}
                    </h3>
                    <span className="text-[clamp(0.6rem,2vw,0.875rem)] text-gray-400 mb-0.5">/5</span>
                </div>
            </div>
            <div className="w-[clamp(1.5rem,5vw,2rem)] h-[clamp(1.5rem,5vw,2rem)] rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <FaStar className="w-3 h-3" />
            </div>
        </div>
    </div>
</div>

        {/* ===== REVIEWS LIST - Single Card with Gray Dividers (Like Image) ===== */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200/50 overflow-hidden">
            {reviewList.length === 0 ? (
                <div className="p-8 sm:p-10 md:p-12 text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <FaQuoteLeft className="text-gray-300 text-xl sm:text-2xl md:text-3xl" />
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">No reviews yet</h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">When customers leave reviews, they will appear here.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {reviewList.map((review, index) => (
                        <div
                            key={review.review_id}
                            className="p-4 sm:p-5 md:p-6 hover:bg-gray-50/50 transition-colors duration-300"
                        >
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6">
                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        {/* Avatar */}
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                            {review.user?.image ? (
                                                <img
                                                    src={getImageUrl(review.user.image)}
                                                    alt={review.user.name || "User"}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://ui-avatars.com/api/?name=" + (review.user?.name || "User");
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                                                    <FaUser className="text-blue-400 text-xs sm:text-sm" />
                                                </div>
                                            )}
                                        </div>

                                        {/* User Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                                    {review.user?.name || "Customer"}
                                                </h4>
                                                <span className="text-[8px] sm:text-[10px] text-gray-400">•</span>
                                                <span className="text-[8px] sm:text-[10px] text-gray-400">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Rating Stars - Compact */}
                                            <div className="flex items-center gap-0.5 mb-2 sm:mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`w-3 h-3 sm:text-xs ${
                                                            i < review.rating ? "text-blue-500" : "text-gray-200"
                                                        }`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Review Comment - Minimal */}
                                            {review.comment && (
                                                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed line-clamp-2">
                                                    "{review.comment}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Target Info - Compact */}
                                <div className="sm:w-48 md:w-56 flex-shrink-0 sm:border-l border-gray-100 sm:pl-4 md:pl-5">
                                    {activeType === "services" ? (
                                        <div>
                                            <span className="text-[8px] font-semibold text-blue-500 uppercase tracking-wider">Service</span>
                                            <h5 className="text-xs sm:text-sm font-medium text-gray-900 mt-0.5 truncate">
                                                {review.service_name}
                                            </h5>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                                                <img
                                                    src={getImageUrl(review.product?.image)}
                                                    alt={review.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[8px] font-semibold text-blue-500 uppercase tracking-wider">Product</span>
                                                <h5 className="text-[10px] sm:text-xs font-medium text-gray-900 truncate">
                                                    {review.product?.name}
                                                </h5>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <ReviewRequestModal
    isOpen={isRequestOpen}
    onClose={() => setIsRequestOpen(false)}
    customerId={userId}
    customerName={user?.name}
/>

    </div>

    
);


};

export default DashboardReviews;
