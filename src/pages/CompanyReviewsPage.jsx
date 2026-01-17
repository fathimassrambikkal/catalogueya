import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Navigation Icons
const CloseIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const ArrowLeftIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

// Star Icon with the exact requested shape
const StarIcon = ({ filled, className = "" }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 576 512"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "currentColor" : "#9CA3AF"}
    strokeWidth="30"
  >
    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
  </svg>
);

// Star Rating Component with Apple-like microinteractions
const StarRating = ({ rating, setRating, hoverRating, setHoverRating }) => {
  const [clickedStar, setClickedStar] = useState(null);

  const handleStarClick = useCallback((star) => {
    setRating(star);
    setClickedStar(star);
    
    // Reset animation after completion
    setTimeout(() => {
      setClickedStar(null);
    }, 400);
  }, [setRating]);

  const handleMouseLeave = useCallback(() => {
    setHoverRating(0);
  }, [setHoverRating]);

  return (
    <div 
      className="flex items-center justify-center gap-2"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating || 0);
        const isClicked = clickedStar === star;
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoverRating(star)}
            className={`
              relative p-1
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-gray-400/50
              ${isClicked ? 'animate-star-bounce' : ''}
            `}
            aria-label={`Rate ${star} stars`}
          >
            {/* Glow effect for hover */}
            <div className={`
              absolute inset-0 rounded-full
              transition-all duration-200
              ${isFilled ? 'bg-gray-300/20 scale-110' : ''}
            `} />
            
            {/* Star with precise microinteractions */}
            <div className="relative transform transition-all duration-200">
              <StarIcon
                filled={isFilled}
                className={`
                  w-[clamp(1.5rem,2.5vw,2rem)] h-[clamp(1.5rem,2.5vw,2rem)]
                  transition-all duration-300
                  ${isFilled ? 'text-gray-900' : 'text-gray-400'}
                  ${hoverRating && star <= hoverRating ? 'drop-shadow-[0_0_8px_rgba(107,114,128,0.3)]' : ''}
                  ${isClicked ? 'drop-shadow-[0_0_12px_rgba(107,114,128,0.6)] scale-110' : ''}
                `}
              />
              
              {/* Subtle ripple effect on click */}
              {isClicked && (
                <div className="
                  absolute inset-0
                  bg-gray-400/30
                  rounded-full
                  animate-star-ripple
                  -z-10
                " />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default function CompanyReviewsPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const storageKey = useMemo(() => `reviews_${companyId}`, [companyId]);
  
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load reviews on mount
  useEffect(() => {
    setLoading(true);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reviews:", e);
      }
    }
    setTimeout(() => setLoading(false), 300);
  }, [storageKey]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!reviews.length) return { average: "0.0", distribution: {5:0,4:0,3:0,2:0,1:0} };
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const distribution = {5:0,4:0,3:0,2:0,1:0};
    
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    return {
      average: (sum / reviews.length).toFixed(1),
      distribution,
      total: reviews.length,
    };
  }, [reviews]);

  // Filter reviews by rating
  const filteredReviews = useMemo(() => {
    if (activeTab === 'all') return reviews;
    return reviews.filter(review => review.rating === parseInt(activeTab));
  }, [reviews, activeTab]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!newReview.name.trim() || !newReview.comment.trim() || !newReview.rating) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const review = {
      ...newReview,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      timestamp: Date.now()
    };

    const updated = [...reviews, review];
    
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Reset form with success feedback
    setNewReview({ name: "", rating: 0, comment: "" });
    setHoverRating(0);
    setIsSubmitting(false);

    // Success microinteraction
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.classList.add('submit-success');
      setTimeout(() => submitBtn.classList.remove('submit-success'), 600);
    }

  }, [newReview, reviews, storageKey]);

  // Update form state
  const updateForm = useCallback((field, value) => {
    setNewReview(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="min-h-screen w-full py-10 sm:py-14 px-4 sm:px-8 md:px-12 relative overflow-hidden bg-gray-50">
      {/* Global Styles */}
      <style jsx global>{`
        /* Minimal Apple-style animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes starBounce {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.3); }
          60% { transform: scale(0.95); }
          80% { transform: scale(1.05); }
        }
        
        @keyframes starRipple {
          0% { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes submitSuccess {
          0% { background-color: rgba(34, 197, 94, 0); }
          50% { background-color: rgba(34, 197, 94, 0.1); }
          100% { background-color: rgba(34, 197, 94, 0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-star-bounce {
          animation: starBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-star-ripple {
          animation: starRipple 0.6s ease-out forwards;
        }
        
        .submit-success {
          animation: submitSuccess 0.6s ease-out;
        }
        
        /* Fluid responsive design */
        .text-headline {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          line-height: clamp(2rem, 4vw, 2.75rem);
        }
        
        .text-title {
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          line-height: clamp(1.5rem, 3vw, 2rem);
        }
        
        .text-body {
          font-size: clamp(0.9375rem, 1.5vw, 1.0625rem);
          line-height: clamp(1.25rem, 2vw, 1.5rem);
        }
        
        .text-caption {
          font-size: clamp(0.8125rem, 1.25vw, 0.9375rem);
          line-height: clamp(1rem, 1.5vw, 1.125rem);
        }
        
        .text-micro {
          font-size: clamp(0.75rem, 1vw, 0.8125rem);
          line-height: clamp(0.875rem, 1.25vw, 1rem);
        }
        
        /* Focus states */
        .focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
        
        .focus-visible:focus-visible {
          outline-color: rgba(0, 0, 0, 0.1);
        }
        
        /* Selection */
        ::selection {
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Loading indicator */}
      {loading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 border-2 border-gray-300/50 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-gray-600 border-r-gray-600 rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 left-4 sm:left-8 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300 transform-gpu active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeftIcon className="text-gray-700 transform-gpu" />
      </button>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto animate-fade-in">
        {/* Header Stats */}
        <section className="mb-8 md:mb-12 pt-2">
          <div className="flex flex-col gap-4">
            {/* Back arrow WITH text BELOW it */}
            <button
              onClick={() => navigate(-1)}
              className="
                inline-flex items-center gap-2
                text-sm font-medium
                text-gray-600
                hover:text-gray-900
                transition
                self-start
              "
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </button>
            
            {/* Heading - Now below the arrow */}
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                Customer Reviews
              </h1>
              <p className="text-caption text-gray-600 mt-2">
                Verified experiences from real customers
              </p>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Reviews List */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-full text-micro font-medium transition-all ${activeTab === 'all' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  All ({stats.total})
                </button>
                {[5,4,3,2,1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setActiveTab(rating.toString())}
                    className={`px-3 py-1.5 rounded-full text-micro font-medium transition-all ${activeTab === rating.toString() ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    {rating}★ ({stats.distribution[rating]})
                  </button>
                ))}
              </div>
              <span className="text-micro text-gray-500 hidden sm:block">
                Most recent first
              </span>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                  <article
                    key={review.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 md:p-5 hover:border-gray-300 transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4 md:gap-5">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <span className="text-body font-medium text-gray-700">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-body font-medium text-gray-900 truncate">
                              {review.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                  <StarIcon
                                    key={i}
                                    filled={i <= review.rating}
                                    className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-900"
                                  />
                                ))}
                              </div>
                              <span className="text-micro text-gray-600 ml-1.5">
                                {review.rating}.0
                              </span>
                            </div>
                          </div>
                          <time className="text-micro text-gray-500 whitespace-nowrap mt-2 sm:mt-0">
                            {review.date}
                          </time>
                        </div>
                        <p className="text-body text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-10 text-center animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <StarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-title font-light text-gray-900 mb-2">
                    No reviews found
                  </h3>
                  <p className="text-caption text-gray-600 max-w-md mx-auto">
                    {activeTab === 'all' 
                      ? "Be the first to share your experience"
                      : `No ${activeTab}-star reviews yet`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Add Review Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6">
                <header className="mb-6">
                  <h2 className="text-title font-light text-gray-900 mb-2">
                    Share Your Experience
                  </h2>
                  <p className="text-caption text-gray-600">
                    Your feedback helps others make informed decisions
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-micro font-medium text-gray-700 mb-2 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900/20 text-body placeholder-gray-500 transition-all focus-visible"
                      required
                    />
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-micro font-medium text-gray-700 mb-3 uppercase tracking-wider">
                      Your Rating
                    </label>
                    <StarRating
                      rating={newReview.rating}
                      setRating={(rating) => updateForm('rating', rating)}
                      hoverRating={hoverRating}
                      setHoverRating={setHoverRating}
                    />
                    <div className="text-center mt-4">
                      <span className="text-caption text-gray-700">
                        {newReview.rating > 0 
                          ? `${newReview.rating} out of 5 stars`
                          : "Select your rating"
                        }
                      </span>
                    </div>
                  </div>

                  {/* Comment Field */}
                  <div>
                    <label className="block text-micro font-medium text-gray-700 mb-2 uppercase tracking-wider">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => updateForm('comment', e.target.value)}
                      placeholder="Share your thoughts about your experience..."
                      rows="4"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900/20 text-body placeholder-gray-500 resize-none transition-all focus-visible"
                      maxLength={500}
                      required
                    />
                    <div className="mt-2 text-right">
                      <span className={`text-micro ${newReview.comment.length >= 450 ? 'text-red-600' : 'text-gray-500'}`}>
                        {newReview.comment.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!newReview.name || !newReview.comment || !newReview.rating || isSubmitting}
                    className="
                      w-full py-3 px-4
                      bg-gray-900
                      text-white
                      text-body font-medium
                      rounded-lg
                      transition-all duration-200
                      hover:bg-gray-800
                      active:scale-[0.99]
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      focus-visible
                    "
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>

                {/* Rating Distribution */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-micro font-medium text-gray-900 mb-4 uppercase tracking-wider">
                    Rating Distribution
                  </h3>
                  <div className="space-y-2">
                    {[5,4,3,2,1].map(rating => {
                      const count = stats.distribution[rating];
                      const percentage = stats.total ? (count / stats.total) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-2 w-14">
                            <span className="text-micro text-gray-700 w-4">{rating}</span>
                            <StarIcon filled={true} className="w-3 h-3 text-gray-900" />
                          </div>
                          <div className="flex-1 bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gray-900 h-full rounded-full transition-all duration-700"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-micro text-gray-600 w-10 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="mt-8 lg:hidden animate-fade-in">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-micro font-medium text-gray-900 mb-4 uppercase tracking-wider">
              Rating Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-title font-light text-gray-900">{stats.average}</div>
                <div className="text-micro text-gray-600 mt-1">Average Rating</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-title font-light text-gray-900">{stats.total}</div>
                <div className="text-micro text-gray-600 mt-1">Total Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}