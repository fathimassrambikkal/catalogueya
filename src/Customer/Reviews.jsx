import React, { useState } from "react";

function Reviews() {
  const [activeView, setActiveView] = useState("main");
  const [activeTab, setActiveTab] = useState("awaiting");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hideProfile, setHideProfile] = useState(false);

  const [awaitingReviews, setAwaitingReviews] = useState([
    { id: 1, productName: "Product Name", description: "Decryption", reviewCount: "3 Ready for Review" },
    { id: 2, productName: "Product Name", description: "Decryption", reviewCount: "9 People reviewed" },
    { id: 3, productName: "Product Name", description: "Decryption", reviewCount: "66 People reviewed" },
    { id: 4, productName: "Product Name", description: "Decryption", reviewCount: "36 People reviewed" }
  ]);

  const [reviewedProducts, setReviewedProducts] = useState([
    { id: 1, productName: "Product Name", description: "Dicribution" }
  ]);

  const deleteAwaitingReview = (id) => {
    setAwaitingReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const deleteReviewedProduct = (id) => {
    setReviewedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // --------------------------------------------------------------------
  // UI UTILITIES (Clean wrappers used multiple times)
  // --------------------------------------------------------------------

  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-white/80 backdrop-blur-lg border border-gray-200/60 
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),
      inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
      rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 w-full overflow-hidden ${className}`}
    >
      {children}
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h2 className="text-sm xs:text-base sm:text-xl font-semibold text-gray-900 mb-4 break-words">
      {children}
    </h2>
  );

  const ImageBox = () => (
    <div
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl 
      bg-gray-100/80 border border-gray-200/60 flex items-center 
      justify-center shadow flex-shrink-0"
    >
      <span className="text-gray-500 text-xs">Img</span>
    </div>
  );

  // --------------------------------------------------------------------
  // MAIN VIEW
  // --------------------------------------------------------------------

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-2 xs:p-3 sm:p-6 overflow-x-hidden w-full">
      <h1 className="text-base xs:text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 break-words px-1">
        My Reviews
      </h1>

      {/* TABS */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex space-x-2 sm:space-x-4 min-w-max pb-1">
          {[
            { key: "awaiting", label: "Awaiting Reviews" },
            { key: "reviewed", label: "Reviewed" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs xs:text-sm font-medium transition-all 
              whitespace-nowrap flex-shrink-0 min-w-[120px]
              ${
                activeTab === tab.key
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white/80 text-gray-700 border border-gray-200/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Awaiting Reviews */}
      {activeTab === "awaiting" && (
        <div className="mt-4 w-full px-1">
          <SectionTitle>Awaiting Reviews</SectionTitle>

          <div className="space-y-4">
            {awaitingReviews.map((review) => (
              <Card key={review.id}>

                {/* Delete Button */}
                <button
                  onClick={() => deleteAwaitingReview(review.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition p-1 
                  rounded-full bg-white/80 border border-gray-200/60 shadow w-7 h-7 flex items-center justify-center"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <ImageBox />

                  <div className="flex-1 min-w-0">
                    {/* Tag */}
                    <span className="text-xs xs:text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      {review.reviewCount}
                    </span>

                    <h3 className="font-semibold text-gray-900 text-xs xs:text-sm sm:text-lg mt-2 mb-1 break-words">
                      {review.productName}
                    </h3>

                    <p className="text-gray-600 text-xs xs:text-sm mb-3 line-clamp-2 break-words">
                      {review.description}
                    </p>

                    <div className="flex justify-center">
                      <button
                        onClick={() => setActiveView("leaveReview")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs xs:text-sm shadow-md hover:shadow-lg"
                      >
                        Leave a review
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Products */}
      {activeTab === "reviewed" && (
        <div className="mt-4 w-full px-1">
          <SectionTitle>Reviewed Products</SectionTitle>

          <span className="text-xs xs:text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            3 Ready for Review
          </span>

          <div className="border-t border-gray-200 my-5"></div>

          <div className="space-y-4">
            {reviewedProducts.map((product) => (
              <Card key={product.id}>
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">

                  <ImageBox />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-lg mb-1">
                      {product.productName}
                    </h3>

                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 break-words">
                      {product.description}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2 justify-end flex-wrap">
                      <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-xs xs:text-sm hover:bg-blue-50">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteReviewedProduct(product.id)}
                        className="border border-red-600 text-red-600 px-4 py-2 rounded-full text-xs xs:text-sm hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // --------------------------------------------------------------------
  // LEAVE REVIEW PAGE
  // --------------------------------------------------------------------

  const renderLeaveReview = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-6 w-full overflow-x-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveView("main")}
          className="p-2 rounded-xl bg-white border shadow min-w-[44px] min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-sm xs:text-base sm:text-xl font-bold">Leave a Review</h1>

        <button
          onClick={() => setActiveView("main")}
          className="p-2 rounded-xl bg-white border shadow min-w-[44px] min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <Card>
        <div className="flex gap-3 sm:gap-4">
          <ImageBox />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-lg font-semibold">Product Name</h3>
            <p className="text-xs sm:text-sm text-gray-600">Dicribution</p>
          </div>
        </div>
      </Card>

      <div className="space-y-6 mt-6">

        {/* Upload buttons */}
        <div className="flex flex-col xs:flex-row gap-3">
          <button className="flex-1 p-4 border-2 border-dashed rounded-xl bg-white">Upload Photo</button>
          <button className="flex-1 p-4 border-2 border-dashed rounded-xl bg-white">Upload Video</button>
        </div>

        {/* Review text */}
        <div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            maxLength={300}
            className="w-full h-32 p-4 rounded-xl bg-white border"
          />
          <div className="text-xs text-right mt-1">{reviewText.length}/300</div>
        </div>

        {/* Star rating */}
        <Card>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="text-center text-sm mt-2">
            {rating === 0 && "Select Rating"}
            {rating === 1 && "Terrible"}
            {rating === 2 && "Poor"}
            {rating === 3 && "Average"}
            {rating === 4 && "Good"}
            {rating === 5 && "Excellent"}
          </div>
        </Card>

        {/* Hide profile */}
        <label className="flex items-center gap-3 p-4 bg-white border rounded-xl">
          <input
            type="checkbox"
            checked={hideProfile}
            onChange={(e) => setHideProfile(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="flex-1 text-sm">Hide your Profile info</span>
        </label>

        {/* Submit button */}
        <button className="w-full py-4 bg-blue-500 text-white rounded-xl shadow">Submit Review</button>
      </div>
    </div>
  );

  return activeView === "leaveReview" ? renderLeaveReview() : renderMainView();
}

export default Reviews;
