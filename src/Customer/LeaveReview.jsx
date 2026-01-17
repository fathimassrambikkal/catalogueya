import React from 'react'
import { FaCalendarAlt, FaChevronLeft, FaStar } from "react-icons/fa"

function LeaveReview({
  selectedItem,
  reviewText,
  setReviewText,
  rating,
  setRating,
  hideProfile,
  setHideProfile,
  onCancel,
  onSubmit
}) {
  const [hoveredStar, setHoveredStar] = React.useState(null);

  if (!selectedItem) return null;

  const getRatingLabel = (rating) => {
    if (rating === 5) return 'Excellent';
    if (rating === 4) return 'Good';
    if (rating === 3) return 'Average';
    if (rating === 2) return 'Poor';
    if (rating === 1) return 'Terrible';
    return 'Select Rating';
  };

  return (
    <div className="h-screen
  
   bg-gradient-to-br from-gray-50/50 to-blue-50/20 p-4 sm:p-6">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 mt-10 ">
          <button 
            onClick={onCancel}
            className="
             mr-3   hover:text-blue-500 
             p-3
              rounded-xl
              bg-white/95 backdrop-blur-xl
              border border-white/90
              text-gray-600
              shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
              hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.04)]
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center
              group
            "
          >
            <FaChevronLeft className="text-sm group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <h1 className="
            text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight
          ">
            {selectedItem?.review_id ? 'Edit Review' : 'Leave a Review'}
          </h1>
          
          <div className="w-10"></div>
        </div>

        {/* Item Card */}
        <div className="
          mb-6 sm:mb-8
          bg-white/97 backdrop-blur-xl
          rounded-xl sm:rounded-2xl
          border border-white/90
          shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
          overflow-hidden
          transition-all duration-300
          hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.04)]
          group/card
        ">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 ">
            {/* Left: Date with icon */}
            <div className="flex items-center gap-3 md:gap-5">
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
                  Received on
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-[12px] font-medium text-gray-900">
                      {selectedItem.receivedDate}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-[11px] text-gray-600/80">
                      {selectedItem.receivedTime }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Type badge */}
            <div className="
              px-2 py-1
              rounded-lg
              bg-gradient-to-r from-blue-500/8 to-blue-500/4
              backdrop-blur-sm
              border border-blue-200/30
              transition-all duration-300
              group-hover/card:border-blue-300/40
            ">
              <div className="flex items-center gap-2">
                <div className=" w-1 h-1 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse-subtle"></div>
                <span className=" text-[9px] md:text-[10px] font-medium text-blue-600/90">
                  {selectedItem.type === 'company' ? 'Company' : 'Product'}
                </span>
              </div>
            </div>
          </div>

          {/* Ultra thin gradient divider */}
          <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-200/30 to-transparent" />

          {/* Main Content */}
          <div className="px-4 sm:px-6 py-5">
            <div className="flex flex-col gap-4">
              {/* Item Name */}
              <div className="mb-2">
                <p className="
                  text-lg sm:text-xl
                  text-gray-900 font-medium
                  tracking-tight
                ">
                  {selectedItem.productName}
                </p>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <div className="mb-4">
                  <p className="
                    text-sm
                    text-gray-600/80 font-normal
                    line-clamp-3
                  ">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              {/* Service Name if available */}
              {selectedItem.service_name && (
                <div className="mb-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="
                      text-xs
                      text-gray-600/80 bg-gray-50/50 px-3 py-1.5 rounded-full border border-gray-200/50
                      font-medium
                    ">
                      Service: {selectedItem.service_name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="space-y-6">
          {/* Review Textarea */}
          <div className="
            bg-white/97 backdrop-blur-xl
            rounded-xl sm:rounded-2xl
            border border-white/90
            shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
            overflow-hidden
            transition-all duration-300
            hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.04)]
          ">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="
                w-full h-32 p-4 sm:p-6
                bg-transparent
                text-gray-900
                placeholder:text-gray-400/70
                focus:outline-none
                resize-none
                text-sm sm:text-base
              "
              maxLength={300}
            />
            <div className="
              px-4 sm:px-6 py-3
              bg-gradient-to-r from-gray-50/30 to-gray-100/20
              border-t border-gray-100/40
              text-right
            ">
              <span className="text-xs text-gray-500/80 font-light">
                {reviewText.length}/300 characters
              </span>
            </div>
          </div>

          {/* Star Rating */}
          <div className="
            bg-white/97 backdrop-blur-xl
            rounded-xl sm:rounded-2xl
            border border-white/90
            shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
            overflow-hidden
            transition-all duration-300
            hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.04)]
          ">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Rating Label */}
                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base font-medium text-gray-700 tracking-wide">
                    Your Rating
                  </span>
                  {rating > 0 && (
                    <span className="
                      text-sm font-medium text-blue-600/90
                      px-3 py-1
                      rounded-lg
                      bg-gradient-to-r from-blue-50/50 to-blue-100/20
                      border border-blue-200/30
                    ">
                      {getRatingLabel(rating)}
                    </span>
                  )}
                </div>
                
                {/* Stars */}
                <div 
                  className="flex items-center gap-1"
                  onMouseLeave={() => setHoveredStar(null)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoveredStar || rating || 0);
                    return (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        className="
                          p-2
                          hover:scale-110
                          active:scale-95
                          transition-all duration-150
                          rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-1
                        "
                      >
                        <div className="relative">
                          {/* Star glow effect */}
                          {isFilled && (
                            <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-full animate-pulse-subtle" />
                          )}
                          <FaStar
                            className={`
                              w-5 h-5 sm:w-8 sm:h-8
                              relative z-10
                              transition-all duration-300
                              ${isFilled 
                                ? "text-blue-400 fill-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" 
                                : "text-gray-300/60 fill-gray-300/60 hover:text-blue-300/70 hover:fill-blue-300/70"
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

          {/* Hide Profile Checkbox */}
          <label className="
            flex items-center space-x-4
            p-4 sm:p-6
            bg-white/97 backdrop-blur-xl
            rounded-xl sm:rounded-2xl
            border border-white/90
            shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
            transition-all duration-300
            hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.04)]
            cursor-pointer group/checkbox
          ">
            <div className="relative">
              <input
                type="checkbox"
                checked={hideProfile}
                onChange={(e) => setHideProfile(e.target.checked)}
                className="
                  w-5 h-5
                  appearance-none
                  rounded-lg
                  border border-gray-300/60
                  bg-white/80
                  checked:bg-blue-500
                  checked:border-blue-500
                  focus:outline-none focus:ring-2 focus:ring-blue-400/30
                  transition-all duration-200
                  cursor-pointer
                "
              />
              {hideProfile && (
                <svg 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-gray-700 text-sm sm:text-base font-medium tracking-wide">
              Hide your Profile info from this review
            </span>
          </label>

          {/* Submit Button */}
          <button 
            onClick={onSubmit}
            disabled={!rating || !reviewText}
            className="
              w-full
              py-4 sm:py-5
              rounded-xl sm:rounded-2xl
              bg-gradient-to-r from-blue-500 to-blue-600
              text-white
              text-base sm:text-lg font-medium
              shadow-[0_2px_12px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
              hover:shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center
              gap-3
              group
              relative
              overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_2px_12px_rgba(59,130,246,0.3)]
            "
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            <span className="relative">
              {selectedItem?.review_id ? 'Update Review' : 'Submit Review'}
            </span>
         
          </button>
        </div>
      </div>

      {/* Add animation to global CSS */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LeaveReview