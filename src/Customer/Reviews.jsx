import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  addProductReview,
  addCompanyReview,
  editReview,
  deleteReview,
} from "../api"
import AwaitingReviews from './AwaitingReviews'
import ReviewedItems from './ReviewedItems'
import LeaveReview from './LeaveReview'

function Reviews() {
  const [activeView, setActiveView] = useState('main');
  const [activeTab, setActiveTab] = useState('awaiting');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hideProfile, setHideProfile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [reviewedItems, setReviewedItems] = useState([]);

  const customer = useSelector(state => state.auth.user);
  const hasFetched = useRef(false);

// Reviews.jsx
const handleSubmitReview = async () => {
  if (!rating || !reviewText || !selectedItem) return;

  try {
    // 1️⃣ Call correct API
    if (selectedItem.type === "company") {
      await addCompanyReview(
        selectedItem.company_id,
        rating,
        reviewText,
        selectedItem.service_name ?? "General Service"
      );
    } else {
      await addProductReview(
        selectedItem.product_id,
        rating,
        reviewText
      );
    }

    // 2️⃣ Optimistically add to reviewed list
    const optimisticReview = {
      review_id: `temp-${Date.now()}`,
      productName: selectedItem.productName,
      description: selectedItem.description,
      type: selectedItem.type,
      rating,
      comment: reviewText,
      company_id: selectedItem.company_id,
      product_id: selectedItem.product_id,
      service_name: selectedItem.service_name,
      reviewedDate: "Just now",
      reviewedTime: "",
    };

    setReviewedItems(prev => [optimisticReview, ...prev]);

    // 3️⃣ Remove from awaiting
    selectedItem?.removeCallback?.(selectedItem.id);

    // 4️⃣ Switch back to main view
    setActiveView("main");

    // 5️⃣ Force backend refresh
    setRefreshTrigger(prev => prev + 1);

    // 6️⃣ Reset form
    setRating(0);
    setReviewText("");
    setSelectedItem(null);

  } catch (err) {
    console.error("❌ Submit review failed", err);
  }
};


const handleEditReview = async (item, updateReviewedItemCallback) => {
  if (
    !selectedItem?.review_id ||
    typeof selectedItem.review_id !== "number"
  ) {
    console.warn("⛔ Cannot edit optimistic review");
    return;
  }

  try {
    await editReview(selectedItem.review_id, rating, reviewText);

    if (updateReviewedItemCallback) {
      updateReviewedItemCallback(selectedItem.review_id, {
        rating,
        comment: reviewText,
      });
    }

    setActiveView("main");
    setRating(0);
    setReviewText("");
    setSelectedItem(null);
    setHideProfile(false);

  } catch (err) {
    console.error("❌ Edit review failed:", err);
  }
};


  const handleDeleteReview = async (reviewId, itemId, removeReviewedItemCallback) => {
    console.log("🗑 Deleting review:", reviewId);
    
    try {
      await deleteReview(reviewId);
      
      if (removeReviewedItemCallback) {
        removeReviewedItemCallback(reviewId);
      }
      
      console.log("🎉 Review deleted successfully!");
      
    } catch (err) {
      console.error("❌ Delete review failed:", err);
    }
  };

  const startLeaveReview = (item, removeAwaitingItemCallback) => {
    setSelectedItem({ ...item, removeCallback: removeAwaitingItemCallback });
    setRating(0);
    setReviewText('');
    setActiveView('leaveReview');
  };

  const startEditReview = (item, updateReviewedItemCallback) => {
    setSelectedItem({ ...item, updateCallback: updateReviewedItemCallback });
    setRating(item.rating || 0);
    setReviewText(item.comment || '');
    setActiveView('leaveReview');
  };

  const renderMainView = () => {
    return (
      <div className="min-h-full 
      
 p-4 sm:p-6 ">
        
        {/* ===== Updated Header Section ===== */}
        <div className="relative mt-10 mb-6">
          {/* Center title */}
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center">
            My Reviews
          </h1>

          {/* Tabs */}
          <div
            className="
              mt-4 md:mt-0
              flex justify-center md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2
            "
          >
            <div className="
              flex
              bg-white/70 backdrop-blur-md
              rounded-2xl
              border border-gray-200/60
              shadow-sm
              p-1
              gap-1
            ">
              {/* Awaiting Reviews Button */}
              <button
                onClick={() => {
                  console.log("📁 Switching to awaiting tab");
                  setActiveTab('awaiting');
                }}
                className={`
                  relative
                  px-5 md:px-8 py-2.5
                  rounded-xl
                  text-[10px] md:text-base font-semibold
                  transition-all duration-300
                  ${
                    activeTab === "awaiting"
                      ? "bg-blue-500/15 text-blue-600 shadow-inner"
                      : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                Awaiting Reviews
              </button>

              {/* Reviewed Button */}
              <button
                onClick={() => {
                  console.log("📁 Switching to reviewed tab");
                  setActiveTab('reviewed');
                }}
                className={`
                  px-5 md:px-8 py-2.5
                  rounded-xl
                  text-[10px] md:text-base font-semibold
                  transition-all duration-300
                  ${
                    activeTab === "reviewed"
                      ? "bg-blue-500/15 text-blue-600 shadow-inner"
                      : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                Reviewed
              </button>
            </div>
          </div>
        </div>
        {/* ===== End Header Section ===== */}

        {activeTab === 'awaiting' && (
          <AwaitingReviews onStartLeaveReview={startLeaveReview} />
        )}

        {activeTab === 'reviewed' && (
          <ReviewedItems
  reviewedItems={reviewedItems}
  setReviewedItems={setReviewedItems}
  onStartEditReview={startEditReview}
  onDeleteReview={handleDeleteReview}
  refreshTrigger={refreshTrigger}
/>

        )}
      </div>
    );
  };

  const renderLeaveReview = () => (
    <LeaveReview
      selectedItem={selectedItem}
      reviewText={reviewText}
      setReviewText={setReviewText}
      rating={rating}
      setRating={setRating}
      hideProfile={hideProfile}
      setHideProfile={setHideProfile}
      onCancel={() => {
        console.log("↩️ Cancelling review/editing, returning to main");
        setActiveView('main');
        setRating(0);
        setReviewText('');
        setSelectedItem(null);
        setHideProfile(false);
      }}
      onSubmit={() => {
        console.log("💾 Saving review...");
        if (selectedItem?.review_id) {
          console.log("🔄 This is an EDIT operation");
          handleEditReview(selectedItem, selectedItem.updateCallback);
        } else {
          console.log("🆕 This is a NEW review submission");
          handleSubmitReview(selectedItem, selectedItem?.removeCallback);
        }
      }}
    />
  );

  switch (activeView) {
    case 'leaveReview':
      return renderLeaveReview();
    default:
      return renderMainView();
  }
}

export default Reviews;