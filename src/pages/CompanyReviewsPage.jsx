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
    serviceRating: 0,
    productRating: 0,
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
    if (
      !newReview.name ||
      !newReview.comment ||
      newReview.rating === 0 ||
      newReview.serviceRating === 0 ||
      newReview.productRating === 0
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

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        {t("Company not found.")}
      </div>
    );
  }

  const overallAvg =
    reviews.length > 0
      ? Math.round(
          reviews.reduce(
            (acc, r) => acc + (r.rating + r.serviceRating + r.productRating) / 3,
            0
          ) / reviews.length
        )
      : 0;

  const avgService =
    reviews.length > 0
      ? Math.round(reviews.reduce((acc, r) => acc + r.serviceRating, 0) / reviews.length)
      : 0;

  const avgProduct =
    reviews.length > 0
      ? Math.round(reviews.reduce((acc, r) => acc + r.productRating, 0) / reviews.length)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 lg:px-20 pt-24 relative">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-30 p-2 bg-white rounded-full shadow hover:scale-105 transition"
      >
        <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
      </button>

      {/* Company Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-xl p-6 mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1>
        {company.location && (
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <FaMapMarkerAlt className="text-blue-500" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline"
            >
              {company.location}
            </a>
          </div>
        )}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <FaStar className="text-gray-900" />
            <span className="font-semibold text-gray-800">{overallAvg}/5</span>
            <span className="text-sm text-gray-500">({reviews.length} {t("reviews")})</span>
          </div>
        </div>
      </motion.div>

      {/* Reviews + Overview */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Ratings Summary */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">{t("Ratings Overview")}</h2>
          <div className="flex  items-center mb-3">
            <span className="w-20 text-gray-700">{t("Service")}</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900" style={{ width: `${(avgService / 5) * 100}%` }} />
            </div>
            <span className="w-8 text-right ml-2">{avgService}</span>
          </div>
          <div className="flex items-center mb-3">
           
            <span className="w-20 text-gray-700">{t("Products")}</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900" style={{ width: `${(avgProduct / 5) * 100}%` }} />
            </div>
            <span className="w-8 text-right ml-2">{avgProduct}</span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-5">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded-xl shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${i < r.rating ? "text-gray-900" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{r.date}</span>
                </div>
                <div className="flex flex-col gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-700 text-sm w-16">{t("Service")}:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${i < r.serviceRating ? "text-gray-900" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div> 
                  <div className="flex items-center gap-1"> 
                    <span className="text-gray-700 text-sm w-16">{t("Products")}:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${i < r.productRating ? "text-gray-900" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{r.comment}</p>
                <p className="text-sm text-gray-500 mt-2">– {r.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">{t("No reviews yet. Be the first!")}</p>
          )}
        </div>
      </div>

      {/* Add Review Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow mt-8 max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4">{t("Add Your Review")}</h2>

        <input
          type="text"
          placeholder={t("Your Name")}
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          className="border w-full rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {["Rating", "Service", "Products"].map((type) => (
          <div className="flex items-center gap-2 mb-3" key={type}>
            <label className="text-gray-700 font-medium w-20">{t(type)}:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <FaStar
                  key={r}
                  onClick={() =>
                    setNewReview({
                      ...newReview,
                      [type === "Rating"
                        ? "rating"
                        : type === "Service"
                        ? "serviceRating"
                        : "productRating"]: r,
                    })
                  }
                  className={`cursor-pointer text-lg ${
                    newReview[
                      type === "Rating"
                        ? "rating"
                        : type === "Service"
                        ? "serviceRating"
                        : "productRating"
                    ] >= r
                      ? "text-gray-900"
                      : "text-gray-300 hover:text-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}

        <textarea
          placeholder={t("Write your review...")}
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
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
        <div className="mt-12 bg-white rounded-xl shadow overflow-hidden">
          <iframe
            src={company.map}
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            className="border-none"
          ></iframe>
        </div>
      )}
    </div>
  );
}
