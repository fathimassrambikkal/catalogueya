import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaWhatsapp, FaArrowLeft, FaHeart, FaShareAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "../data/categoriesData";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { useFavourites } from "../context/FavouriteContext";
import { Lens } from "../components/Lens";

export default function ProductProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const whatsappNumber = "97400000000";
  const { favourites, toggleFavourite } = useFavourites();

  const productId = params.id || params.productId || params.pid;

  const product = categories
    .flatMap((cat) =>
      cat.companies.flatMap((comp) =>
        (comp.products || []).map((p) => ({
          ...p,
          categoryId: cat.id,
          categoryName: cat.title,
          companyId: comp.id,
          companyName: comp.name,
          image: p.image || p.img,
        }))
      )
    )
    .find((p) => String(p.id) === String(productId));

  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviews, setReviews] = useState([]);

  // ✅ Load per-product reviews only
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      window.scrollTo({ top: 0, behavior: "smooth" });

      const storageKey = `reviews_${product.id}`; // changed to product.id
      const savedReviews = JSON.parse(localStorage.getItem(storageKey)) || [];
      setReviews(savedReviews);
    }
  }, [productId]);

  if (!product)
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        Product not found.
      </div>
    );

  const isFavourite = favourites.some((fav) => fav.id === product.id);

  const handleShare = (p) => {
    const shareData = {
      title: p.name,
      text: `Check out ${p.name} from ${p.companyName} on Catalogueya!`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => alert("Share cancelled."));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("🔗 Link copied to clipboard!");
    }
  };

  const allProducts = categories.flatMap((cat) =>
    cat.companies.flatMap((comp) =>
      (comp.products || []).map((p) => ({
        ...p,
        categoryId: cat.id,
        companyId: comp.id,
        category: cat.title,
        image: p.image || p.img,
      }))
    )
  );

  const similarProducts = allProducts
    .filter(
      (sp) =>
        sp.id !== product.id &&
        (sp.categoryId === product.categoryId || sp.companyId === product.companyId)
    )
    .slice(0, 4);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating || 0;

  // ✅ Save reviews per product only
  const handleReviewSubmit = () => {
    if (!reviewName || !reviewText || reviewRating === 0) {
      alert("Please enter your name, rating, and comment.");
      return;
    }

    const storageKey = `reviews_${product.id}`; // changed to product.id
    const savedReviews = JSON.parse(localStorage.getItem(storageKey)) || [];

    const newReviewObj = {
      id: Date.now(),
      name: reviewName,
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toLocaleDateString(),
    };

    const updatedReviews = [...savedReviews, newReviewObj];
    localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);

    alert(`⭐ ${reviewRating}-star review submitted!`);

    setShowReviewModal(false);
    setReviewText("");
    setReviewRating(0);
    setReviewName("");
  };

  return (
    <>
      {/* ===== Back Button ===== */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 sm:top-8 left-6 sm:left-8 md:top-28 md:left-12 z-30 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition"
      >
        <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
      </button>

      <motion.section
        key={productId}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-7xl mx-auto px-6 pt-32 pb-12 md:pt-36 md:pb-16 grid grid-cols-1 md:grid-cols-2 gap-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden rounded-3xl shadow-sm"
      >
        {/* ===== Left Section ===== */}
        <div className="flex flex-col md:flex-row gap-6 md:sticky md:top-28 h-fit">
          <div className="flex md:flex-col gap-3 order-2 md:order-1 self-start">
            {[product.image, product.image2, product.image3, product.image4]
              .filter(Boolean)
              .map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name}-${idx}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border transition-all duration-300 ${
                    selectedImage === img
                      ? "border-gray-800 scale-105 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
          </div>

          <div className="relative flex-1 order-1 md:order-2 overflow-hidden rounded-xl shadow-2xl group">
            <Lens zoomFactor={1.8} lensSize={160} disableOnMobile={true}>
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </Lens>
            <div className="absolute top-5 right-5 flex flex-col gap-3 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavourite(product);
                }}
                className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-md hover:bg-white transition"
              >
                <FaHeart
                  className={`text-xl transition-all ${
                    isFavourite ? "text-red-500 scale-110" : "text-gray-400"
                  }`}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(product);
                }}
                className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-md hover:bg-white transition"
              >
                <FaShareAlt className="text-gray-600 text-xl" />
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                  product.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md transition"
              >
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* ===== Right Section ===== */}
        <div className="flex flex-col justify-start space-y-6 pr-2">
          <div className="">
            <p className="text-gray-500 uppercase text-sm tracking-wide">
              {product.categoryName || "PRODUCT"}
            </p>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tighter">
              {product.name}
            </h1>

            {product.companyName && (
              <button
                onClick={() =>
                  navigate(`/category/${product.categoryId}/company/${product.companyId}`)
                }
                className="text-base text-blue-600 font-medium hover:underline w-fit"
              >
                <span className="text-gray-500">by </span>
                <span className="font-semibold">{product.companyName}</span>
              </button>
            )}

            <div className="flex items-baseline gap-3 mt-2">
              {product.oldPrice && (
                <span className="text-gray-400 line-through text-lg">
                  QAR {product.oldPrice}
                </span>
              )}
              <span className="text-2xl font-bold text-green-600">
                QAR {product.price}
              </span>
            </div>

            <h3 className="text-xl text-gray-800 mt-3">Product Details</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description ||
                `Introducing our ${product.name} – designed for superior quality and style.`}
            </p>

            {/* ===== Rating + Review Section ===== */}
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600">({averageRating.toFixed(1)})</span>
                </div>
                {/* ✅ New “Write a Review” Button */}
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-sm text-white font-medium bg-gray-800 rounded-lg p-2"
                >
                  Write a Review
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {reviews.slice(0, 2).map((rev) => (
                  <div
                    key={rev.id}
                    className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-gray-800">{rev.name}</span>
                      <span className="text-gray-500 text-sm">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm">{rev.comment}</p>
                  </div>
                ))}

                {reviews.length > 2 && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View {reviews.length - 2} more review(s)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== Review Modal (unchanged) ===== */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Customer Reviews
              </h3>

              <div className="max-h-[50vh] overflow-y-auto mb-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{rev.name}</span>
                        <span className="text-gray-500 text-sm">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No reviews yet – be the first to review!
                  </p>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                Write a Review
              </h3>

              <input
                type="text"
                placeholder="Your Name"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />

              <div className="flex justify-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    onClick={() => setReviewRating(i + 1)}
                    className={`w-7 h-7 cursor-pointer transition ${
                      i < reviewRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
                rows="4"
              ></textarea>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={!reviewText || !reviewName || reviewRating === 0}
                  className={`px-4 py-2 text-sm rounded-lg text-white ${
                    reviewText && reviewName && reviewRating
                      ? "bg-gray-900 hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Similar Products + FAQ + CTA ===== */}
      {similarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-semibold tracking-tighter text-gray-900 mb-10 text-center">
            Similar Products
          </h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {similarProducts.map((sp) => {
              const isFav = favourites.some((f) => f.id === sp.id);
              return (
                <motion.div
                  key={sp.id}
                  whileHover={{ scale: 1.03 }}
                  className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer bg-white/10 border border-white/30 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] transition-all duration-700"
                  onClick={() =>
                    navigate(
                      `/category/${sp.categoryId}/company/${sp.companyId}/product/${sp.id}`
                    )
                  }
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(sp);
                    }}
                    className={`absolute top-2 right-2 z-20 p-2 rounded-full border backdrop-blur-md shadow-md transition ${
                      isFav
                        ? "bg-red-100 text-red-600 border-red-200"
                        : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"
                    }`}
                  >
                    <FaHeart className={`text-sm ${isFav ? "text-red-500" : ""}`} />
                  </button>

                  <div className="relative w-full h-[200px] sm:h-[230px] overflow-hidden rounded-t-3xl">
                    <img
                      src={sp.image}
                      alt={sp.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-t-3xl transition-transform duration-500 group-hover:scale-105 border-b border-white/20"
                    />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(sp.rating ?? 0)
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-white/90 ml-1">
                        ({(sp.rating ?? 0).toFixed(1)})
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full rounded-b-3xl p-4 border-t border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-between">
                    <div className="flex flex-col w-[80%]">
                      <h3 className="font-semibold text-[12px] sm:text-sm truncate text-gray-900 mb-1">
                        {sp.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-[12px] font-bold text-gray-900">
                          QAR {sp.price}
                        </span>
                        {sp.oldPrice && (
                          <span className="text-[10px] line-through text-gray-500">
                            QAR {sp.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                        sp.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-green-500/80 rounded-full text-white shadow-md hover:bg-green-600/90 transition"
                    >
                      <FaWhatsapp className="text-sm" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      <Faq />
      <CallToAction />
    </>
  );
}
