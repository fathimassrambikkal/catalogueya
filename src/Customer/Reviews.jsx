import React, { useState } from 'react'

function Reviews() {
  const [activeView, setActiveView] = useState('main'); // 'main', 'leaveReview'
  const [activeTab, setActiveTab] = useState('awaiting'); // 'awaiting', 'reviewed'
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hideProfile, setHideProfile] = useState(false);
  const [awaitingReviews, setAwaitingReviews] = useState([
    {
      id: 1,
      productName: 'Product Name',
      description: 'Decryption',
      reviewCount: '3 Ready for Review'
    },
    {
      id: 2,
      productName: 'Product Name',
      description: 'Decryption',
      reviewCount: '9 People reviewed this product'
    },
    {
      id: 3,
      productName: 'Product Name',
      description: 'Decryption',
      reviewCount: '66 People reviewed this product'
    },
    {
      id: 4,
      productName: 'Product Name',
      description: 'Decryption',
      reviewCount: '36 People reviewed this product'
    }
  ]);

  const [reviewedProducts, setReviewedProducts] = useState([
    {
      id: 1,
      productName: 'Product Name',
      description: 'Dicribution'
    }
  ]);

  const deleteAwaitingReview = (id) => {
    setAwaitingReviews(awaitingReviews.filter(review => review.id !== id));
  };

  const deleteReviewedProduct = (id) => {
    setReviewedProducts(reviewedProducts.filter(product => product.id !== id));
  };

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Reviews</h1>
      
      {/* Tab Buttons */}
      <div className="flex space-x-4 mb-6 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveTab('awaiting')}
          className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
            activeTab === 'awaiting'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
              : 'bg-white/80 text-gray-700 backdrop-blur-lg border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]'
          }`}
        >
          Awaiting Reviews
        </button>
        <button
          onClick={() => setActiveTab('reviewed')}
          className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
            activeTab === 'reviewed'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
              : 'bg-white/80 text-gray-700 backdrop-blur-lg border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]'
          }`}
        >
          Reviewed
        </button>
      </div>

      {/* Awaiting Reviews Tab */}
      {activeTab === 'awaiting' && (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Awaiting Reviews</h2>
              <div className="space-y-4">
                {awaitingReviews.map((review) => (
                  <div key={review.id} className="relative p-4 sm:p-6 rounded-2xl
                    bg-white/80 backdrop-blur-lg border border-gray-200/60
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                    {/* Close Icon */}
                    <button 
                      onClick={() => deleteAwaitingReview(review.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full
                        bg-white/80 backdrop-blur-lg border border-gray-200/60
                        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                    
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0
                        bg-gray-100/80 border border-gray-200/60
                        shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
                        <span className="text-gray-500 text-xs">Image</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            {review.reviewCount}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-1">{review.productName}</h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-4">{review.description}</p>
                        
                        {/* Small Centered Leave Review Button */}
                        <div className="flex justify-center">
                          <button 
                            onClick={() => setActiveView('leaveReview')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200
                              shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]"
                          >
                            Leave a review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviewed Tab */}
      {activeTab === 'reviewed' && (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Reviewed Products</h2>
              
              {/* Review Count */}
              <div className="mb-4">
                <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  3 Ready for Review
                </span>
              </div>

              {/* Horizontal Line */}
              <div className="border-t border-gray-200/60 my-6"></div>

              {/* Reviewed Products */}
              <div className="space-y-4">
                {reviewedProducts.map((product) => (
                  <div key={product.id} className="p-4 sm:p-6 rounded-2xl
                    bg-white/80 backdrop-blur-lg border border-gray-200/60
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0
                        bg-gray-100/80 border border-gray-200/60
                        shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
                        <span className="text-gray-500 text-xs">Image</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-1">{product.productName}</h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-4">{product.description}</p>
                        
                        {/* Small Edit/Delete Buttons */}
                        <div className="flex space-x-3 justify-end">
                          <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-all duration-200
                            bg-white/80 backdrop-blur-lg
                            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteReviewedProduct(product.id)}
                            className="border border-red-600 text-red-600 px-6 py-2 rounded-full text-sm font-medium hover:bg-red-50 transition-all duration-200
                              bg-white/80 backdrop-blur-lg
                              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLeaveReview = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with Close Icon */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setActiveView('main')}
            className="p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Leave a Review</h1>
          <button 
            onClick={() => setActiveView('main')}
            className="p-2 rounded-xl text-gray-600 hover:text-red-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Product Card with Image */}
        <div className="p-4 sm:p-6 rounded-2xl mb-6
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center space-x-4">
            {/* Product Image Placeholder */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0
              bg-gray-100/80 border border-gray-200/60
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
              <span className="text-gray-500 text-xs">Image</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-1">Product Name</h3>
              <p className="text-gray-600 text-sm sm:text-base">Dicribution</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <button className="flex-1 p-4 sm:p-6 rounded-2xl text-center transition-all duration-200
                bg-white/80 backdrop-blur-lg border-2 border-dashed border-gray-300/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:border-blue-500/60 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                <span className="text-gray-600 text-sm sm:text-base">Upload Photo</span>
              </button>
              <button className="flex-1 p-4 sm:p-6 rounded-2xl text-center transition-all duration-200
                bg-white/80 backdrop-blur-lg border-2 border-dashed border-gray-300/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:border-blue-500/60 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                <span className="text-gray-600 text-sm sm:text-base">Upload Video</span>
              </button>
            </div>
          </div>

          {/* Review Text Area */}
          <div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here......"
              className="w-full h-32 p-4 rounded-2xl resize-none transition-all duration-200
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              maxLength={300}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {reviewText.length}/300 Words
            </div>
          </div>

          {/* Rating */}
          <div className="p-4 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl sm:text-3xl transition-transform duration-200 hover:scale-110 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="ml-3 text-gray-700 font-medium text-sm sm:text-base">
                {rating === 5 && 'Excellent'}
                {rating === 4 && 'Good'}
                {rating === 3 && 'Average'}
                {rating === 2 && 'Poor'}
                {rating === 1 && 'Terrible'}
                {rating === 0 && 'Select Rating'}
              </span>
            </div>
          </div>

          {/* Hide Profile Checkbox */}
          <label className="flex items-center space-x-3 p-4 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <input
              type="checkbox"
              checked={hideProfile}
              onChange={(e) => setHideProfile(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700 text-sm sm:text-base">Hide your Profile info</span>
          </label>

          {/* Submit Button */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-medium hover:shadow-lg transition-all duration-200
            shadow-[3px_3px_15px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_20px_rgba(59,130,246,0.4)]
            hover:scale-[1.02] active:scale-[0.98]">
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );

  // Render appropriate view based on activeView state
  switch (activeView) {
    case 'leaveReview':
      return renderLeaveReview();
    default:
      return renderMainView();
  }
}

export default Reviews;