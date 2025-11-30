import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaWhatsapp,
  FaArrowLeft,
  FaHeart,
  FaShareAlt,
  FaComments,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useFavourites } from "../context/FavouriteContext";
import { useAuth } from "../context/AuthContext.jsx";
import { getProduct, getSettings, getFixedWords } from "../api"; 
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { Lens } from "../components/Lens";

// Memoized image component to prevent re-renders
const MemoizedImage = React.memo(({ src, alt, className, onError, onClick }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onError={onError}
    onClick={onClick}
    loading="lazy"
  />
));

export default function ProductProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const whatsappNumber = "97400000000";
  const { favourites, toggleFavourite } = useFavourites();
  const { isAuthenticated, user } = useAuth();

  const { companyId, id: routeProductId, productId, pid } = params;
  const resolvedProductId = routeProductId || productId || pid;

  const [product, setProduct] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState({});
  const [fixedWords, setFixedWords] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  // API base URL for images
  const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

  // ✅ Convert relative image path to absolute URL
  const getImageUrl = useCallback((imgPath) => {
    if (!imgPath) return '/api/placeholder/400/400';
    if (imgPath.startsWith('http')) return imgPath;
    const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
    return `${API_BASE_URL}/${cleanPath}`;
  }, [API_BASE_URL]);

  // Memoized values for better performance
  const productImages = useMemo(() => {
    if (!product) return [];
    const images = [
      product?.image,
      product?.image2,
      product?.image3,
      product?.image4,
      ...(product.albums || [])
    ].filter(Boolean).map(getImageUrl);
    return images.length > 0 ? images : [getImageUrl('/api/placeholder/400/400')];
  }, [product, getImageUrl]);

  const averageRating = useMemo(() => {
    const getSafeRating = (rating) => {
      if (typeof rating === 'number') return rating;
      if (typeof rating === 'string') return parseFloat(rating) || 0;
      return 0;
    };

    if (reviews.length > 0) {
      return reviews.reduce((sum, r) => sum + getSafeRating(r.rating), 0) / reviews.length;
    }
    return getSafeRating(product?.rating);
  }, [reviews, product]);

  const basePath = useMemo(() => {
    if (product?.category_id && product?.company_id) {
      return `/category/${product.category_id}/company/${product.company_id}`;
    } else if (product?.company_id) {
      return `/company/${product.company_id}`;
    }
    return "/";
  }, [product]);

  const isFavourite = useMemo(() => 
    favourites.some((fav) => fav.id === product?.id),
    [favourites, product]
  );

  // Optimized handlers
  const handleChat = useCallback((e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please register or login to start a chat with the seller.");
      navigate("/register");
      return;
    }
    alert(`Starting chat about ${product.name} with ${product.company_name}`);
  }, [isAuthenticated, navigate, product]);

  const handleShare = useCallback((p) => {
    const shareData = {
      title: p.name,
      text: `Check out ${p.name} from ${p.company_name} on Catalogueya!`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => alert("Share cancelled."));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("🔗 Link copied to clipboard!");
    }
  }, []);

  const handleReviewSubmit = useCallback(() => {
    if (!reviewName || !reviewText || reviewRating === 0) {
      alert("Please enter your name, rating, and comment.");
      return;
    }

    const storageKey = `reviews_${product.id}`;
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
    setShowReviewModal(false);
    setReviewText("");
    setReviewRating(0);
    setReviewName("");
  }, [reviewName, reviewText, reviewRating, product]);

  const handleThumbnailClick = useCallback((img) => {
    setSelectedImage(img);
  }, []);

  const handleToggleFavourite = useCallback((product) => {
    toggleFavourite(product);
  }, [toggleFavourite]);

  const handleCompanyClick = useCallback((e) => {
    e.stopPropagation();
    if (product?.company_id) {
      navigate(`/company/${product.company_id}`);
    }
  }, [navigate, product]);

  // ✅ UPDATED: Fetch product data using getProduct API
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchProductData = async () => {
      try {
        console.log('🔄 Fetching product with ID:', resolvedProductId);
        
        // Use getProduct API to fetch product data
        const productResponse = await getProduct(resolvedProductId);
        console.log('📦 API Response:', productResponse);
        
        // Extract product data from API response
        const productData = productResponse?.data?.data?.product || productResponse?.data?.product;
        
        console.log('🔍 Product data found:', productData);
        
        if (productData && mounted) {
          // Transform product data to match your component structure
          const transformedProduct = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            oldPrice: productData.old_price || null,
            image: getImageUrl(productData.image),
            image2: getImageUrl(productData.albums?.[0] || productData.image),
            image3: getImageUrl(productData.albums?.[1] || productData.image),
            image4: getImageUrl(productData.albums?.[2] || productData.image),
            rating: parseFloat(productData.rating) || 0,
            description: productData.description,
            // ✅ COMPANY DATA FROM API
            company_id: productData.company_id,
            company_name: productData.company_name || "Company",
            category_id: productData.category_id,
            category_name: productData.category_name || "Product",
            discount_percent: productData.discount_percent || null,
            albums: productData.albums || [],
            // Additional fields for compatibility
            companyName: productData.company_name || "Company",
            categoryName: productData.category_name || "Product",
            companyId: productData.company_id
          };
          
          console.log('✨ Transformed product:', transformedProduct);
          setProduct(transformedProduct);
          setSelectedImage(transformedProduct.image);
          
          // Load reviews from localStorage
          const storageKey = `reviews_${transformedProduct.id}`;
          const savedReviews = JSON.parse(localStorage.getItem(storageKey)) || [];
          setReviews(savedReviews);
          
          // Set similar products to empty (you can fetch similar products if needed)
          setSimilarProducts([]);
        } else if (mounted) {
          console.error('❌ No product data found in response');
          setError("Product not found in API response");
        }
      } catch (err) {
        console.error("❌ Error loading product:", err);
        if (mounted) {
          setError(`Failed to load product: ${err.message}`);
        }
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
  }, [resolvedProductId, getImageUrl]);

  // Separate effects for independent data
  useEffect(() => {
    getSettings().then((res) => setSettings(res.data || {})).catch(() => {});
    getFixedWords().then((res) => setFixedWords(res.data || {})).catch(() => {});
  }, []);

  // Safe rating calculation
  const getSafeRating = useCallback((rating) => {
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseFloat(rating) || 0;
    return 0;
  }, []);

  const formatRating = useCallback((rating) => {
    const safeRating = getSafeRating(rating);
    return safeRating.toFixed(1);
  }, [getSafeRating]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        Product not found.
      </div>
    );
  }

  return (
    <>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 sm:top-8 left-5 sm:left-8 md:top-28 md:left-12 z-30 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition"
      >
        <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
      </button>

      {/* Product Section */}
      <motion.section
        key={resolvedProductId}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 bg-white rounded-3xl shadow-sm"
      >
        {/* Left: Image Gallery */}
        <div className="flex flex-col md:flex-row gap-6 md:sticky md:top-24 h-fit">
          <div className="flex md:flex-col gap-3 order-2 md:order-1 self-start">
            {productImages.map((img, idx) => (
              <MemoizedImage
                key={idx}
                src={img}
                alt={`${product.name}-${idx}`}
                onClick={() => handleThumbnailClick(img)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border transition-all duration-300 ${
                  selectedImage === img
                    ? "border-gray-900 scale-105 shadow-sm"
                    : "border-gray-200 opacity-80 hover:opacity-100"
                }`}
                onError={(e) => {
                  e.target.src = "/api/placeholder/200/200";
                }}
              />
            ))}
          </div>

          <div className="relative flex-1 order-1 md:order-2 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <Lens zoomFactor={1.8} lensSize={160} disableOnMobile={true}>
              <MemoizedImage
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-2xl transition-transform duration-500 ease-out hover:scale-[1.02]"
                onError={(e) => {
                  e.target.src = "/api/placeholder/500/500";
                }}
              />
            </Lens>

            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavourite(product);
                }}
                className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <FaHeart
                  className={`text-lg ${
                    isFavourite ? "text-red-500" : "text-gray-500"
                  }`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(product);
                }}
                className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <FaShareAlt className="text-gray-600 text-lg" />
              </button>

              {/* CHAT ICON - Only show for authenticated users */}
              {isAuthenticated && (
                <button
                  onClick={handleChat}
                  className="p-3 rounded-full bg-blue-500 text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                  title="Chat with seller"
                >
                  <FaComments className="text-lg" />
                </button>
              )}

              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                  product.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-green-500 text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col space-y-6">
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            {product.category_name || "Product"}
          </p>

          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            {product.name}
          </h1>

          {/* ✅ UPDATED: Company name as clickable link */}
          {product.company_name && (
            <button
              onClick={handleCompanyClick}
              className="text-base text-blue-600 font-medium hover:underline w-fit text-left"
            >
              <span className="text-gray-500">by </span>
              {product.company_name}
            </button>
          )}

          <div className="flex items-baseline gap-3 mt-2">
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-lg">
                QAR {product.oldPrice}
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              QAR {product.price}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Product Details
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description ||
                `Introducing our ${product.name} – designed for superior quality and style.`}
            </p>
          </div>

          {/* Chat prompt for unauthenticated users */}
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-800 text-sm mb-2">
                💬 Want to chat with the seller about this product?
              </p>
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Register now to enable chat
              </button>
            </div>
          )}

          {/* Rating + Review Section */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating) ? "text-gray-950" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-gray-600 text-sm">({formatRating(averageRating)})</span>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg p-2 transition"
              >
                Write a Review
              </button>
            </div>

            <div className="space-y-2">
              {reviews.slice(0, 2).map((rev) => (
                <div key={rev.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50 shadow-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800">{rev.name}</span>
                    <span className="text-gray-500 text-sm">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${i < getSafeRating(rev.rating) ? "text-gray-950" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm">{rev.comment}</p>
                </div>
              ))}
              {reviews.length > 2 && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  View {reviews.length - 2} more review(s)
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Similar Products Section */}
      {similarProducts.length > 0 ? (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-light text-gray-900 text-start mb-12">
            Similar Products from {product.company_name}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavourite(sp);
                    }}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-100 shadow-sm transition-all hover:scale-110 ${
                      isFav ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    <FaHeart className="text-lg" />
                  </button>

                  <div className="w-full h-[220px] overflow-hidden rounded-t-2xl">
                    <MemoizedImage
                      src={sp.image}
                      alt={sp.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/300";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 text-sm truncate mb-1">{sp.name}</h3>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="text-sm font-semibold">QAR {sp.price}</span>
                      {sp.oldPrice && (
                        <span className="text-xs line-through text-gray-400">QAR {sp.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-gray-500 text-center">
            No similar products found from this company.
          </p>
        </div>
      )}

      <Faq />
      <CallToAction />

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Customer Reviews
              </h3>

              <div className="max-h-[50vh] overflow-y-auto mb-4 space-y-3">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-gray-800">{rev.name}</span>
                        <span className="text-gray-500 text-sm">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${i < getSafeRating(rev.rating) ? "text-gray-950" : "text-gray-300"}`}
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

              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Write a Review</h3>

              <input
                type="text"
                placeholder="Your Name"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />

              <div className="flex justify-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    onClick={() => setReviewRating(i + 1)}
                    className={`w-7 h-7 cursor-pointer transition ${
                      i < reviewRating ? "text-gray-950" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700"
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
    </>
  );
}