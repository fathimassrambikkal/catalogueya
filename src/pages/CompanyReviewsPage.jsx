import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../data/categoriesData";
import { FaArrowLeft, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CompanyReviewsPage() {
  const { categoryId, companyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const category = categories.find((cat) => cat.id === categoryId);
  const company = category?.companies.find((c) => c.id === companyId);

  const storageKey = `reviews_${companyId}`;
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem(storageKey);
    if (saved) setReviews(JSON.parse(saved));
    else if (company?.reviews) setReviews(company.reviews);
  }, [storageKey, company]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      alert(t("Please complete all fields!"));
      return;
    }

    const updated = [
      ...reviews,
      { ...newReview, id: Date.now(), date: new Date().toLocaleDateString() },
    ];
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewReview({ name: "", rating: 0, comment: "" });
  };

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        {t("Company not found.")}
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : company.rating || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-6 sm:pt-8 lg:pt-10 px-4 sm:px-8 lg:px-20 relative">
      {/* ✅ Fixed Floating Back Button (same as CompanyPage) */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 sm:top-18 md:top-20 lg:top-24 left-4 sm:left-6 md:left-8 lg:left-10
                   z-30 p-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full
                   shadow-sm hover:bg-gray-50 transition-all hover:scale-105"
      >
        <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
      </button>

      {/* Company Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow p-6 mb-10 mt-24 sm:mt-24 lg:mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {company.name}
            </h1>
            <p className="text-gray-600 mb-2">
              {t("Share your experience with")}{" "}
              <span className="font-semibold text-blue-600">{company.name}</span>.
            </p>
          </div>

          {/* Average Rating */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
            <FaStar className="text-gray-950 text-lg" />
            <span className="font-semibold text-gray-800 text-lg">
              {avgRating}
            </span>
            <span className="text-sm text-gray-500">
              ({reviews.length} {t("reviews")})
            </span>
          </div>
        </div>

        {/* Location Info */}
        {company.location && (
          <div className="flex items-center gap-2 mt-4 text-gray-600">
            <FaMapMarkerAlt className="text-blue-500" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                company.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-600"
            >
              {company.location}
            </a>
          </div>
        )}
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow p-6 mb-10"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {t("Customer Reviews")}
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-5">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border-b border-gray-100 pb-4 last:border-none"
              >
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < r.rating ? "text-gray-950" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-auto">{r.date}</span>
                </div>
                <p className="text-gray-700 mb-1">{r.comment}</p>
                <p className="text-sm text-gray-500">– {r.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{t("No reviews yet. Be the first!")}</p>
        )}
      </motion.div>

      {/* Add Review Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow p-6 max-w-xl mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {t("Add Your Review")}
        </h2>

        <input
          type="text"
          placeholder={t("Your Name")}
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          className="border w-full rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <div className="flex items-center gap-2 mb-3">
          <label className="text-gray-700 font-medium">{t("Rating")}:</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <FaStar
                key={r}
                onClick={() => setNewReview({ ...newReview, rating: r })}
                className={`cursor-pointer text-lg ${
                  newReview.rating >= r
                    ? "text-gray-950"
                    : "text-gray-300 hover:text-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        <textarea
          placeholder={t("Write your review...")}
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          className="border w-full rounded-lg px-3 py-2 mb-4 h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition w-full"
        >
          {t("Submit Review")}
        </button>
      </motion.form>

      {/* Optional Map */}
      {company.map && (
        <div className="mt-12 bg-white rounded-2xl shadow overflow-hidden">
          <iframe
            src={company.map}
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            className="border-none rounded-2xl"
          ></iframe>
        </div>
      )}
    </div>
  );
}
