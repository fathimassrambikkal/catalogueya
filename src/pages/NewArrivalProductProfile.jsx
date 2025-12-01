import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaWhatsapp, FaArrowLeft, FaHeart, FaShareAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { useFavourites } from "../context/FavouriteContext";
import { Lens } from "../components/Lens";
import { getProduct } from "../api";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

export default function NewArrivalProductProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const whatsappNumber = "97400000000";

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

  const { favourites, toggleFavourite } = useFavourites();
  const isFavourite = product ? favourites.some((f) => f.id === product.id) : false;

  // ✅ Convert relative image path to absolute URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return '/api/placeholder/400/400';
    if (imgPath.startsWith('http')) return imgPath;
    const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // ✅ COMPANY NAME CLICK HANDLER
  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (product?.company_id) {
      navigate(`/company/${product.company_id}`);
    }
  };

  // ✅ Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching new arrival product with ID:', id);
        
        const productResponse = await getProduct(id);
        console.log('📦 API Response:', productResponse);
        
        const productData = productResponse?.data?.data?.product || productResponse?.data?.product;
        
        console.log('🔍 Product data found:', productData);
        
        if (productData) {
          // ✅ CORRECTED: Transform single product data, not an array
          const transformedProduct = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            oldPrice: productData.old_price || null,
            image: getImageUrl(productData.image),
            rating: parseFloat(productData.rating) || 0,
            description: productData.description,
            // ✅ COMPANY DATA FROM API
            company_id: productData.company_id,
            company_name: productData.company_name || "Company",
            category_id: productData.category_id,
            category_name: "NEW ARRIVAL",
            discount_percent: productData.discount_percent || null,
            albums: productData.albums || [],
            isNewArrival: true
          };
          
          console.log('✨ Transformed product:', transformedProduct);
          setProduct(transformedProduct);
          setSelectedImage(getImageUrl(productData.image));
          
          const storageKey = `reviews_newarrival_${transformedProduct.id}`;
          const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
          setReviews(saved);
          
          setSimilarProducts([]);
        } else {
          console.error('❌ No product data found in response');
          setError("Product not found in API response");
        }
      } catch (err) {
        console.error("❌ Error loading product:", err);
        setError(`Failed to load product: ${err.message}`);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchProductData();
  }, [id]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product?.rating || 0;

  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: `Check out this new arrival: ${product?.name} from ${product?.company_name}`,
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
    const storageKey = `reviews_newarrival_${product.id}`;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center py-20 text-lg text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
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
          <div className="text-sm text-gray-500 mb-4">Product ID: {id}</div>
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

  const productImages = [
    product.image,
    ...(product.albums || [])
  ].filter(Boolean);

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 sm:top-8 left-5 sm:left-8 md:top-28 md:left-12 z-30 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition"
      >
        <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
      </button>

      <motion.section
        key={product.id}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 bg-white rounded-3xl shadow-sm"
      >
        {/* Left: Images */}
        <div className="flex flex-col md:flex-row gap-6 md:sticky md:top-24 h-fit">
          {productImages.length > 1 && (
            <div className="flex md:flex-col gap-3 order-2 md:order-1 self-start">
              {productImages.map((src, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(src)}
                  alt={`${product.name}-${idx}`}
                  onClick={() => handleImageClick(src)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border transition-all duration-300 ${
                    selectedImage === getImageUrl(src)
                      ? "border-gray-900 scale-105 shadow-sm"
                      : "border-gray-200 opacity-80 hover:opacity-100"
                  }`}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/200/200';
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative flex-1 order-1 md:order-2 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <Lens zoomFactor={1.8} lensSize={160} disableOnMobile={true}>
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[520px] object-cover rounded-2xl transition-transform duration-500 ease-out hover:scale-[1.02]"
                onError={(e) => {
                  e.target.src = '/api/placeholder/500/500';
                }}
              />
            </Lens>

            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold border border-blue-100 shadow-sm">
              NEW
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-3 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavourite(product);
                }}
                className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition hover:scale-105"
              >
                <FaHeart
                  className={`text-lg ${isFavourite ? "text-red-500" : "text-gray-500"}`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition hover:scale-105"
              >
                <FaShareAlt className="text-gray-600 text-lg" />
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                  product.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition"
              >
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col space-y-6">
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            {product.category_name || "NEW ARRIVAL"}
          </p>

          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">{product.name}</h1>

          {/* ✅ COMPANY NAME AS CLICKABLE LINK */}
          {product.company_name && (
            <button
              onClick={handleCompanyClick}
              className="text-base text-blue-600 font-medium hover:underline w-fit text-left flex items-center gap-1"
            >
              <span className="text-gray-500">by</span>
              {product.company_name}
            </button>
          )}

          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-2xl font-bold text-gray-900">QAR {product.price}</span>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Product Details</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description ||
                `Discover our latest ${product.name} — fresh new design and premium quality.`}
            </p>
          </div>

          {/* Rating + Review Section */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(averageRating) ? "text-gray-950" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-gray-600">({averageRating.toFixed(1)})</span>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg p-2 transition"
              >
                Write a Review
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {reviews.slice(0, 2).map((rev) => (
                <div key={rev.id} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800">{rev.name}</span>
                    <span className="text-gray-500 text-sm">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? "text-gray-950" : "text-gray-300"}`}
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
      </motion.section>

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