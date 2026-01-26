import React, { memo, useState, useCallback } from "react";
import { useFixedWords } from "../hooks/useFixedWords";
import { error as logError } from "../utils/logger";
import { showToast } from "../utils/showToast";

// Close icon (same SVG)
const CloseIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// Star icon with hover effect
const StarIcon = ({ filled, className = "" }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 576 512"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "currentColor" : "#9CA3AF"}
    strokeWidth="30"
  >
    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
  </svg>
);

const ReviewModal = memo(function ReviewModal({
  productId,
  reviewName,
  reviewText,
  reviewRating,
  setReviewName,
  setReviewText,
  setReviewRating,
  onClose,
  onSubmit,
}) {
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};
  
  // Microinteraction states for stars only
  const [hoveredStar, setHoveredStar] = useState(null);
  const [clickedStar, setClickedStar] = useState(null);
const [submitting, setSubmitting] = useState(false);
const handleSubmit = useCallback(async () => {
  if (!reviewText || !reviewName || !reviewRating || submitting) return;

  try {
    setSubmitting(true);
    await onSubmit();
  } catch (err) {
    logError("ReviewModal: submit failed", err);

    showToast(
      fw.submit_failed || "Failed to submit review. Please try again.",
      { rtl: fw?.language === "ar" }
    );
  } finally {
    setSubmitting(false);
  }
}, [reviewText, reviewName, reviewRating, onSubmit, submitting, fw]);


  const handleStarClick = useCallback((rating) => {
    setReviewRating(rating);
    setClickedStar(rating);
    
    // Reset the clicked star animation after 600ms
    setTimeout(() => {
      setClickedStar(null);
    }, 600);
  }, [setReviewRating]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-lg px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-lg rounded-3xl
          bg-white/55 backdrop-blur-2xl
          border border-white/30
          shadow-[0_12px_32px_rgba(0,0,0,0.12)]
          p-6 space-y-6
          animate-slide-up
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {fw.write_review || "Write a Review"}
          </h3>
          <button
            onClick={onClose}
            className="
              h-8 w-8 flex items-center justify-center rounded-full
              bg-white/60 text-gray-500 hover:bg-white
              transition active:scale-95
            "
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3 pt-2 border-t border-white/40">
          <h3 className="text-md font-semibold text-gray-900">
            {fw.write_review || "Write a Review"}
          </h3>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              {fw.your_name || "Your Name"}
            </label>
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder={fw.your_name || "Your Name"}
              className="
                w-full rounded-xl px-3 py-2.5 text-sm
                bg-white/60 border border-white/20
                placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gray-900/40
                transition-colors duration-200
              "
            />
          </div>

          {/* Rating with enhanced microinteractions */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              {fw.rating || "Rating"}
            </label>
            <div
              className="
                flex items-center justify-center gap-3 px-4 py-2.5
                rounded-xl bg-white/50 border border-white/20
              "
            >
              <div 
                className="flex items-center gap-3"
                onMouseLeave={() => setHoveredStar(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoveredStar || reviewRating || 0);
                  const isClicked = clickedStar === star;
                  
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      className={`
                        transition-all duration-300
                        ${isClicked ? 'animate-star-bounce' : ''}
                        ${hoveredStar && star <= hoveredStar ? 'transform hover:scale-125' : ''}
                      `}
                    >
                      <div className="relative">
                        {/* Glow effect for hovered stars - gray version */}
                        {(hoveredStar && star <= hoveredStar) && (
                          <div className="
                            absolute inset-0 
                            bg-gray-400/20 
                            blur-[8px] 
                            rounded-full
                            animate-pulse-gentle
                            -z-10
                          " />
                        )}
                        
                        {/* Click ripple effect - gray version */}
                        {isClicked && (
                          <div className="
                            absolute inset-0 
                            bg-gray-400/30 
                            rounded-full
                            animate-star-ripple
                            -z-10
                          " />
                        )}
                        
                        <StarIcon
                          filled={isFilled}
                          className={`
                            w-6 h-6
                            transition-all duration-300
                            ${isFilled ? 'text-gray-700' : 'text-gray-400'}
                            ${hoveredStar && star <= hoveredStar ? 'drop-shadow-[0_0_8px_rgba(107,114,128,0.4)]' : ''}
                            ${isClicked ? 'drop-shadow-[0_0_12px_rgba(107,114,128,0.6)]' : ''}
                          `}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
  <label className="text-xs font-medium text-gray-700">
    {fw.your_message || "Your Review"}
  </label>

  <textarea
    value={reviewText}
    onChange={(e) => setReviewText(e.target.value)}
    rows="4"
    placeholder={fw.share_review || "Share your thoughts about this product..."}
    className="
      w-full rounded-xl px-3 py-2.5 text-sm
      bg-white/60 border border-white/20
      placeholder:text-gray-400
      resize-none
      focus:outline-none focus:ring-2 focus:ring-gray-900/40
      transition-colors duration-200
    "
    maxLength={300}
  />


            <div className="text-right">
              <span className={`
                text-xs text-gray-500
                transition-all duration-200
                ${reviewText.length >= 280 ? 'text-amber-600' : ''}
                ${reviewText.length >= 295 ? 'text-red-600' : ''}
              `}>
                {reviewText.length}/300
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="
                px-4 py-2 text-sm rounded-xl
                bg-white/70 text-gray-700
                hover:bg-white transition
                active:scale-95
              "
            >
              {fw.previous || "Cancel"}
            </button>
           <button
  onClick={handleSubmit}
  disabled={
    submitting ||
    !reviewText ||
    !reviewName ||
    reviewRating === 0
  }
  className={`
    px-4 py-2 text-sm rounded-xl text-white
    active:scale-95
    transition-all duration-200
    ${
      !submitting && reviewText && reviewName && reviewRating
        ? "bg-gray-900 hover:bg-gray-800 hover:shadow-lg"
        : "bg-gray-400 cursor-not-allowed"
    }
  `}
>
  {submitting
    ? fw.sending || "Submitting..."
    : fw.send_message || "Submit"}
</button>

          </div>
        </div>
      </div>

      {/* Star microinteraction animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes star-bounce {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.4); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.1); }
        }
        
        @keyframes star-ripple {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.8);
            opacity: 0.3;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 1.5s ease-in-out infinite;
        }
        
        .animate-star-bounce {
          animation: star-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-star-ripple {
          animation: star-ripple 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
});

export default ReviewModal;