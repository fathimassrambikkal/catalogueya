import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CompanyReviewsPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const storageKey = `reviews_${companyId}`;

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    serviceRating: 0,
    productRating: 0,
    comment: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem(storageKey);
    if (saved) setReviews(JSON.parse(saved));
  }, [storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !newReview.name ||
      !newReview.comment ||
      !newReview.rating ||
      !newReview.serviceRating ||
      !newReview.productRating
    ) {
      alert(t("Please complete all fields!"));
      return;
    }

    const updated = [
      ...reviews,
      { ...newReview, id: Date.now(), date: new Date().toLocaleDateString() },
    ];

    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setNewReview({
      name: "",
      rating: 0,
      serviceRating: 0,
      productRating: 0,
      comment: "",
    });
  };

  const avg = (key) =>
    reviews.length
      ? Math.round(reviews.reduce((a, b) => a + b[key], 0) / reviews.length)
      : 0;

  const overallAvg =
    reviews.length > 0
      ? Math.round(
          reviews.reduce(
            (a, r) => a + (r.rating + r.serviceRating + r.productRating) / 3,
            0
          ) / reviews.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 lg:px-20 pt-24 relative">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-30 p-2 bg-white rounded-full shadow"
      >
        <FaArrowLeft />
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow rounded-xl p-6 mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          {companyId?.replace("-", " ")}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <FaStar />
          <span className="font-semibold">{overallAvg}/5</span>
          <span className="text-sm text-gray-500">
            ({reviews.length} {t("reviews")})
          </span>
        </div>
      </motion.div>

      {/* Ratings */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">{t("Ratings Overview")}</h2>

          {[
            { label: "Service", value: avg("serviceRating") },
            { label: "Products", value: avg("productRating") },
          ].map((r) => (
            <div key={r.label} className="flex items-center mb-3">
              <span className="w-20">{t(r.label)}</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900"
                  style={{ width: `${(r.value / 5) * 100}%` }}
                />
              </div>
              <span className="ml-2">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="lg:col-span-2 space-y-5">
          {reviews.length ? (
            reviews.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded-xl shadow">
                <div className="flex justify-between mb-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < r.rating ? "text-gray-900" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{r.date}</span>
                </div>
                <p className="text-gray-700">{r.comment}</p>
                <p className="text-sm text-gray-500 mt-2">– {r.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">{t("No reviews yet.")}</p>
          )}
        </div>
      </div>

      {/* Add Review */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mt-8 max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4">{t("Add Your Review")}</h2>

        <input
          placeholder={t("Your Name")}
          className="border w-full p-2 mb-3 rounded"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
        />

        {["rating", "serviceRating", "productRating"].map((key) => (
          <div className="flex gap-2 mb-3" key={key}>
            {[1,2,3,4,5].map((n) => (
              <FaStar
                key={n}
                className={`cursor-pointer ${
                  newReview[key] >= n ? "text-gray-900" : "text-gray-300"
                }`}
                onClick={() => setNewReview({ ...newReview, [key]: n })}
              />
            ))}
          </div>
        ))}

        <textarea
          placeholder={t("Write your review")}
          className="border w-full p-2 mb-4 rounded"
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          {t("Submit Review")}
        </button>
      </form>
    </div>
  );
}
