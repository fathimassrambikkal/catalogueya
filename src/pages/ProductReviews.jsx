import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductReviews } from "../api";
import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";
const StarIcon = ({ filled, className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
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
const backButtonClass =
  "absolute top-20 left-4 sm:left-8 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300 transform-gpu active:scale-95";


export default function ProductReviews() {
 const { productId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fixedWords } = useFixedWords();
  const { i18n } = useTranslation(); 
  const fw = fixedWords?.fixed_words || {};
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getProductReviews(productId);
        const apiReviews = res?.data?.data?.reviews || [];

        const mapped = apiReviews.map((r) => ({
          id: r.review_id,
          name: r.user?.name || "Anonymous",
          rating: Number(r.rating) || 0,
          comment: r.comment || "",
          date: new Date(r.created_at).toLocaleDateString(),
        }));

        setReviews(mapped);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <section className="w-full  px-6 py-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={backButtonClass}
        aria-label="Go back"
      >
        <ArrowLeftIcon className="text-gray-700" />
      </button>

      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-900 mb-6 mt-12 ">
        {fw.customer_reviews}
      </h1>

      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-800">
                  {rev.name}
                </span>
                <span className="text-xs text-gray-500">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                filled={i < Math.round(rev.rating)}
                className={`w-4 h-4 ${
                  i < Math.round(rev.rating)
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>


              <p className="text-sm text-gray-700 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      )}
    </section>
  );
}
