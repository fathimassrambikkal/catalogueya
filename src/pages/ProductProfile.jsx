import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft, FaHeart, FaShareAlt } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

import { useFavourites } from "../context/FavouriteContext";
import { useAuth } from "../context/AuthContext.jsx";
import { getProduct, getCompany } from "../api";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { Lens } from "../components/Lens";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// ✅ Reusable VisionOS-style glass / titanium icon button
const PremiumIconButton = ({ onClick, title, children }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    title={title}
    className="
      relative flex items-center justify-center
      w-10 h-10 rounded-[16px]
      bg-white/40 backdrop-blur-2xl
      border border-[rgba(255,255,255,0.28)]
      shadow-[0_8px_24px_rgba(0,0,0,0.18)]
      hover:bg-white/55 transition-all duration-300
    "
  >
    <span
      className="absolute inset-0 rounded-[16px]
      bg-gradient-to-br from-white/70 via-white/10 to-transparent
      opacity-40 pointer-events-none"
    />
    <span
      className="absolute inset-0 rounded-[16px]
      bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)]
      opacity-35 pointer-events-none"
    />
    <span
      className="absolute inset-0 rounded-[16px]
      bg-gradient-to-t from-black/20 to-transparent
      opacity-20 pointer-events-none"
    />
    <span className="relative z-10 flex items-center justify-center">
      {children}
    </span>
  </button>
);

// ✅ Safe rating helper
const getSafeRating = (value) => {
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) return 0;
  if (num > 5) return 5;
  return num;
};

export default function ProductProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const { isAuthenticated } = useAuth();

  const { companyId, id: routeProductId, productId, pid } = params;
  const resolvedProductId = routeProductId || productId || pid;

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFavourite = product
    ? favourites.some((f) => f.id === product.id)
    : false;

  // ✅ Convert relative image path to absolute URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/api/placeholder/400/400";
    if (imgPath.startsWith("http")) return imgPath;
    const cleanPath = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // ✅ COMPANY NAME CLICK HANDLER
  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (product?.company_id) {
      navigate(`/company/${product.company_id}`);
    }
  };

  // ✅ Chat handler with Auth gate
  const handleChat = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isAuthenticated) {
        alert("Please register or login to start a chat with the seller.");
        navigate("/register");
        return;
      }
      // You can replace this with your actual chat logic
      alert(`Starting chat about ${product.name} with ${product.company_name}`);
    },
    [isAuthenticated, navigate, product]
  );

  // ✅ Fetch product + similar products
  useEffect(() => {
    let mounted = true;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productResponse = await getProduct(resolvedProductId);
        const productData =
          productResponse?.data?.data?.product ||
          productResponse?.data?.product;

        if (!productData) {
          if (mounted) setError("Product not found in API response");
          return;
        }

        // ⭐ Transform main product
        const transformedProduct = {
          id: productData.id,
          name: productData.name,
          price: productData.price,
          oldPrice: productData.old_price || null,
          image: getImageUrl(productData.image),
          rating: parseFloat(productData.rating) || 0,
          description: productData.description,
          company_id: productData.company_id,
          company_name: productData.company_name || "Company",
          category_id: productData.category_id,
          category_name: productData.category_name || "PRODUCT",
          discount_percent: productData.discount_percent || null,
          albums: productData.albums || [],
        };

        if (!mounted) return;

        setProduct(transformedProduct);
        setSelectedImage(getImageUrl(productData.image));

        // ⭐ Load saved reviews (normal products key)
        const storageKey = `reviews_${transformedProduct.id}`;
        const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
        setReviews(saved);

        // ⭐ Fetch similar products using company_id
        if (productData.company_id) {
          try {
            const companyRes = await getCompany(productData.company_id);

            const company =
              companyRes?.data?.data?.company ||
              companyRes?.data?.company ||
              companyRes?.data;

            let list = company?.products || [];

            // Remove current product
            list = list.filter((p) => p.id !== productData.id);

            // Normalize similar products
            list = list.map((p) => ({
              ...p,
              image: p.image?.startsWith("http")
                ? p.image
                : `${API_BASE_URL}/${p.image?.replace(/^\//, "")}`,
              company_name:
                p.company_name || productData.company_name || "Company",
              company_id: p.company_id || productData.company_id,
            }));

            if (mounted) setSimilarProducts(list);
          } catch (err) {
            console.warn("Failed to load similar products:", err);
            if (mounted) setSimilarProducts([]);
          }
        } else {
          if (mounted) setSimilarProducts([]);
        }
      } catch (err) {
        console.error("❌ Error loading product:", err);
        if (mounted) setError(`Failed to load product: ${err.message}`);
      } finally {
        if (mounted) {
          setLoading(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    fetchProductData();

    return () => {
      mounted = false;
    };
  }, [resolvedProductId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + getSafeRating(r.rating), 0) /
        reviews.length
      : product?.rating || 0;

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out ${product.name} from ${product.company_name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("🔗 Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleReviewSubmit = () => {
    if (!reviewName || !reviewText || reviewRating === 0) {
      alert("Please enter your name, rating, and comment.");
      return;
    }
    const storageKey = `reviews_${product.id}`;
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    const newRev = {
      id: Date.now(),
      name: reviewName,
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toLocaleDateString(),
    };
    const updated = [...saved, newRev];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setReviews(updated);
    setShowReviewModal(false);
    setReviewName("");
    setReviewText("");
    setReviewRating(0);
    alert(`⭐ ${newRev.rating}-star review submitted!`);
  };

  const handleImageClick = (src) => {
    setSelectedImage(getImageUrl(src));
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center py-20 text-lg text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          Loading product...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center py-20 text-lg text-gray-600">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          {error || "Product not found."}
          <div className="text-sm text-gray-500 mb-4">
            Product ID: {resolvedProductId}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const productImages = [product.image, ...(product.albums || [])].filter(
    Boolean
  );

  return (
    <>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 sm:top-8 left-5 sm:left-8 md:top-28 md:left-12 z-30 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition"
      >
        <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
      </button>

      {/* Main layout – same style as NewArrivalProductProfile */}
      <motion.section
        key={product.id}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1200px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 bg-white rounded-3xl shadow-sm"
      >
        {/* LEFT: Image viewer – VisionOS style with internal thumbnails */}
        <div className="relative flex flex-col md:sticky md:top-24 h-fit w-full">
          {/* MAIN IMAGE WRAPPER */}
          <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {/* MAIN IMAGE (Animated) */}
            <Lens zoomFactor={1.8} lensSize={160} disableOnMobile={true}>
              <motion.img
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                initial={{ opacity: 0.6, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/api/placeholder/500/500")}
              />
            </Lens>

            {/* CATEGORY Badge (neutral, since this is general product) */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gray-50 text-gray-700 text-sm font-semibold border border-gray-100 shadow-sm">
              {product.category_name || "PRODUCT"}
            </div>

            {/* RIGHT SIDE ICONS */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 z-30">
              <PremiumIconButton
                title={isFavourite ? "Remove from favourites" : "Add to favourites"}
                onClick={() => toggleFavourite(product)}
              >
                <FaHeart
                  className={`text-[17px] ${
                    isFavourite ? "text-red-500" : "text-[rgba(18,18,18,0.88)]"
                  }`}
                />
              </PremiumIconButton>

              <PremiumIconButton title="Share product" onClick={handleShare}>
                <FaShareAlt className="text-[16px] text-[rgba(18,18,18,0.88)]" />
              </PremiumIconButton>

              {/* Chat – no WhatsApp here, as requested */}
              <PremiumIconButton title="Chat with seller" onClick={handleChat}>
                <LuMessageSquareMore className="text-[17px] text-[rgba(18,18,18,0.88)]" />
              </PremiumIconButton>
            </div>

            {/* THUMBNAIL PREVIEW STRIP (Inside Image Bottom Center) */}
            {productImages.length > 1 && (
              <div
                className="
                  absolute bottom-4 left-1/2 -translate-x-1/2
                  flex items-center gap-3
                  px-3 py-2 rounded-2xl
                  bg-white/55 backdrop-blur-xl border border-white/40
                  shadow-[0_8px_20px_rgba(0,0,0,0.15)]
                  z-30
                "
              >
                {productImages.map((src, idx) => {
                  const img = getImageUrl(src);
                  return (
                    <motion.img
                      key={idx}
                      src={img}
                      onClick={() => handleImageClick(src)}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{
                        scale: selectedImage === img ? 1.08 : 1.03,
                      }}
                      transition={{ duration: 0.25 }}
                      className={`
                        w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover cursor-pointer 
                        border transition-all duration-300
                        ${
                          selectedImage === img
                            ? "border-gray-900 shadow-md"
                            : "border-gray-300 opacity-80"
                        }
                      `}
                      onError={(e) =>
                        (e.target.src = "/api/placeholder/200/200")
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Product details panel */}
        <div className="flex flex-col gap-6">
          {/* Category + Title + Company */}
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-gray-500">
              {product.category_name || "PRODUCT"}
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
              {product.name}
            </h1>

            {product.company_name && (
              <button
                onClick={handleCompanyClick}
                className="text-sm text-blue-600 font-medium hover:underline w-fit flex items-center gap-1"
              >
                <span className="text-gray-500">by</span>
                {product.company_name}
              </button>
            )}
          </div>

          {/* Price + rating */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">
                QAR {product.price}
              </span>

              {product.oldPrice && (
                <span className="text-sm line-through text-gray-400">
                  QAR {product.oldPrice}
                </span>
              )}

              {product.discount_percent && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                  -{product.discount_percent}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(averageRating)
                      ? "text-gray-900"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {product.description ||
                `Introducing our ${product.name} – designed for superior quality and style.`}
            </p>
          </div>

          {/* Chat prompt for unauthenticated users */}
          {!isAuthenticated && (
            <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-800 text-sm mb-2">
                💬 Want to chat with the seller about this product?
              </p>
              <button
                onClick={handleRegisterClick}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Register now to enable chat
              </button>
            </div>
          )}

          {/* Write Review Button */}
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Write a Review
          </button>

          {/* Customer Reviews */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center justify-between">
              Customer Reviews
              {reviews.length > 0 && (
                <span className="text-xs font-normal text-gray-500">
                  {reviews.length} review{reviews.length > 1 ? "s" : ""}
                </span>
              )}
            </h3>

            <div className="space-y-2">
              {reviews.slice(0, 2).map((rev) => (
                <div
                  key={rev.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800">
                      {rev.name}
                    </span>
                    <span className="text-gray-500 text-xs">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < getSafeRating(rev.rating)
                            ? "text-gray-950"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-sm">{rev.comment}</p>
                </div>
              ))}

              {reviews.length === 0 && (
                <p className="text-sm text-gray-500">
                  No reviews yet – be the first to share your experience.
                </p>
              )}

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
      </motion.section>

      {/* ⭐ Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-light text-gray-900 text-start mb-12">
            Similar Products
          </h2>

          <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((sp) => {
              const isFav = favourites.some((f) => f.id === sp.id);

              return (
                <motion.div
                  key={sp.id}
                  whileHover={{ scale: 1.03 }}
                  className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/product/${sp.id}`)}
                >
                  {/* ❤️ Favourite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(sp);
                    }}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full border border-gray-200 
                      bg-white hover:bg-gray-100 shadow-sm transition-all hover:scale-110 
                      ${isFav ? "text-red-500" : "text-gray-500"}`}
                  >
                    <FaHeart className="text-lg" />
                  </button>

                  {/* Product Image */}
                  <div className="w-full h-[220px] overflow-hidden rounded-t-2xl">
                    <img
                      src={sp.image}
                      alt={sp.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/300";
                      }}
                    />
                  </div>

                  {/* Title + Price */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 text-sm truncate mb-1">
                      {sp.name}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="text-sm font-semibold">
                        QAR {sp.price}
                      </span>
                      {sp.oldPrice && (
                        <span className="text-xs line-through text-gray-400">
                          QAR {sp.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      <Faq />
      <CallToAction />

      {/* Review Modal – Glass Skiper style with list + form */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-lg px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.3, 1] }}
              className="
                w-full max-w-lg rounded-3xl
                bg-white/55 backdrop-blur-2xl
                border border-white/30
                shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                p-6 space-y-6
              "
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Reviews
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="
                    h-8 w-8 flex items-center justify-center rounded-full
                    bg-white/60 text-gray-500 hover:bg-white
                  "
                >
                  ✕
                </button>
              </div>

              {/* All reviews list */}
              <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-1">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="border border-white/40 rounded-2xl p-4 bg-white/60"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-gray-800">
                          {rev.name}
                        </span>
                        <span className="text-gray-500 text-xs">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < getSafeRating(rev.rating)
                                ? "text-gray-950"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-sm">
                    No reviews yet – be the first to review!
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-white/40">
                <h3 className="text-md font-semibold text-gray-900">
                  Write a Review
                </h3>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="
                      w-full rounded-xl px-3 py-2.5 text-sm
                      bg-white/60 border border-white/20
                      placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-gray-900/40
                    "
                  />
                </div>

                {/* Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Rating
                  </label>
                  <div
                    className="
                      flex items-center justify-center gap-3 px-4 py-2.5
                      rounded-xl bg-white/50 border border-white/20
                    "
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        className="transition-transform duration-150"
                      >
                        <FaStar
                          className={`w-6 h-6 ${
                            i < reviewRating ? "text-gray-900" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows="4"
                    className="
                      w-full rounded-xl px-3 py-2.5 text-sm
                      bg-white/60 border border-white/20
                      placeholder:text-gray-400
                      resize-none
                      focus:outline-none focus:ring-2 focus:ring-gray-900/40
                    "
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="
                      px-4 py-2 text-sm rounded-xl
                      bg-white/70 text-gray-700
                      hover:bg-white transition
                    "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    disabled={!reviewText || !reviewName || reviewRating === 0}
                    className={`
                      px-4 py-2 text-sm rounded-xl text-white
                      ${
                        reviewText && reviewName && reviewRating
                          ? "bg-gray-900 hover:bg-gray-800"
                          : "bg-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
