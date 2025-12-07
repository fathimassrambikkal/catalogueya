import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { useFavourites } from "../context/FavouriteContext";
import { getProduct, getCompany } from "../api";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// SVG Icons
const ArrowLeftIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
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

const HeartIcon = ({ filled, className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="17" 
    height="17" 
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

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

const ShareIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="16" 
    height="16" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </svg>
);

const ChatIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="17" 
    height="17" 
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
    <circle cx="4" cy="8" r="1" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="12" cy="8" r="1" />
  </svg>
);

const CloseIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="16" 
    height="16" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

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
      transform-gpu
      active:scale-95
    "
  >
    <span
      className="absolute inset-0 rounded-[16px]
      bg-gradient-to-br from-white/70 via-white/10 to-transparent
      opacity-40 pointer-events-none transform-gpu"
    />
    <span
      className="absolute inset-0 rounded-[16px]
      bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)]
      opacity-35 pointer-events-none transform-gpu"
    />
    <span
      className="absolute inset-0 rounded-[16px]
      bg-gradient-to-t from-black/20 to-transparent
      opacity-20 pointer-events-none transform-gpu"
    />
    <span className="relative z-10 flex items-center justify-center transform-gpu">
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

export default function SalesProductProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // ✅ Fetch product + similar products
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productResponse = await getProduct(id);
        const productData =
          productResponse?.data?.data?.product || productResponse?.data?.product;

        if (!productData) {
          setError("Product not found in API response");
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
          category_name: "SALE",
          discount_percent: productData.discount_percent || null,
          albums: productData.albums || [],
          isOnSale: true,
        };

        setProduct(transformedProduct);
        setSelectedImage(getImageUrl(productData.image));

        // ⭐ Load saved reviews
        const storageKey = `reviews_sale_${transformedProduct.id}`;
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
              company_name: p.company_name || productData.company_name || "Company",
              company_id: p.company_id || productData.company_id,
            }));

            setSimilarProducts(list);
          } catch (err) {
            console.warn("Failed to load similar products:", err);
            setSimilarProducts([]);
          }
        } else {
          setSimilarProducts([]);
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
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out this sale product: ${product.name} from ${product.company_name}`,
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
    const storageKey = `reviews_sale_${product.id}`;
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
      <div className="flex justify-center items-center min-h-screen transform-gpu">
        <div className="text-center py-20 text-lg text-gray-600 transform-gpu">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4 transform-gpu" />
          Loading product...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen transform-gpu">
        <div className="text-center py-20 text-lg text-gray-600 transform-gpu">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          {error || "Product not found."}
          <div className="text-sm text-gray-500 mb-4 transform-gpu">Product ID: {id}</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition transform-gpu"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const productImages = [product.image, ...(product.albums || [])].filter(Boolean);

  return (
    <>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 sm:top-8 left-5 sm:left-8 md:top-28 md:left-12 z-30 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition transform-gpu"
      >
        <ArrowLeftIcon className="text-gray-700 text-sm sm:text-md md:text-lg transform-gpu" />
      </button>

      {/* Main layout */}
      <section
        key={product.id}
        className="max-w-[1200px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 bg-white rounded-3xl shadow-sm transform-gpu animate-fade-in"
      >
        {/* LEFT: Image viewer – VisionOS style with internal thumbnails */}
        <div className="relative flex flex-col md:sticky md:top-24 h-fit w-full transform-gpu">
          {/* MAIN IMAGE WRAPPER */}
          <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm transform-gpu">
              <img
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transform-gpu animate-image-fade"
                onError={(e) => (e.target.src = "/api/placeholder/500/500")}
              />
            

            {/* SALE Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold border border-red-100 shadow-sm transform-gpu">
              SALE
            </div>

            {/* RIGHT SIDE ICONS */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 z-30 transform-gpu">
              <PremiumIconButton
                title={isFavourite ? "Remove from favourites" : "Add to favourites"}
                onClick={() => toggleFavourite(product)}
              >
                <HeartIcon
                  filled={isFavourite}
                  className={`text-[17px] transform-gpu ${
                    isFavourite ? "text-red-500" : "text-[rgba(18,18,18,0.88)]"
                  }`}
                />
              </PremiumIconButton>

              <PremiumIconButton title="Share product" onClick={handleShare}>
                <ShareIcon className="text-[16px] text-[rgba(18,18,18,0.88)] transform-gpu" />
              </PremiumIconButton>

              <PremiumIconButton title="Chat">
                <ChatIcon className="text-[17px] text-[rgba(18,18,18,0.88)] transform-gpu" />
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
                  transform-gpu
                "
              >
                {productImages.slice(0, 5).map((src, idx) => {
                  const img = getImageUrl(src);
                  const isActive = selectedImage === img;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleImageClick(src)}
                      className={`
                        relative
                        w-14 h-14 md:w-16 md:h-16
                        rounded-xl overflow-hidden
                        flex items-center justify-center
                        border transition-all duration-300
                        transform-gpu
                        ${isActive
                          ? "border-gray-900 shadow-xl bg-white/40 scale-105"
                          : "border-gray-300 opacity-80 bg-white/25 hover:scale-105"
                        }
                        active:scale-95
                      `}
                    >
                      {/* Smooth highlight outline */}
                      {isActive && (
                        <div
                          className="absolute inset-0 rounded-xl border-[2.5px] border-white shadow-lg transform-gpu"
                        />
                      )}

                      {/* Thumbnail image */}
                      <img
                        src={img}
                        className={`w-full h-full object-cover transform-gpu ${isActive ? 'scale-110' : 'scale-100'}`}
                        onError={(e) => (e.target.src = "/api/placeholder/200/200")}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Product details panel */}
        <div className="flex flex-col gap-6 transform-gpu">
          {/* Category + Title + Company */}
          <div className="space-y-2 transform-gpu">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-gray-500 transform-gpu">
              {product.category_name || "SALE"}
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight transform-gpu">
              {product.name}
            </h1>

            {product.company_name && (
              <button
                onClick={handleCompanyClick}
                className="text-sm text-blue-600 font-medium hover:underline w-fit flex items-center gap-1 transform-gpu"
              >
                <span className="text-gray-500">by</span>
                {product.company_name}
              </button>
            )}
          </div>

          {/* Price + rating */}
          <div className="space-y-1 transform-gpu">
            <div className="flex items-baseline gap-2 transform-gpu">
              <span className="text-3xl font-semibold text-gray-900 transform-gpu">
                QAR {product.price}
              </span>

              {product.oldPrice && (
                <span className="text-sm line-through text-gray-400 transform-gpu">
                  QAR {product.oldPrice}
                </span>
              )}

              {product.discount_percent && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 transform-gpu">
                  -{product.discount_percent}%
                </span>
              )}
            </div>

            {/* ⭐ Rating */}
            <div className="flex items-center gap-1 transform-gpu">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  filled={i < Math.round(averageRating)}
                  className={`w-4 h-4 transform-gpu ${
                    i < Math.round(averageRating) ? "text-gray-900" : "text-gray-400"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 transform-gpu">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3 transform-gpu">
            <h3 className="text-lg font-medium text-gray-900 transform-gpu">Product Details</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base transform-gpu">
              {product.description ||
                `Don't miss our sale price for ${product.name} — high quality at a reduced rate.`}
            </p>
          </div>

          {/* Write Review Button */}
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition transform-gpu active:scale-95"
          >
            Write a Review
          </button>

          {/* Customer Reviews */}
          <div className="space-y-3 transform-gpu">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center justify-between transform-gpu">
              Customer Reviews
              {reviews.length > 0 && (
                <span className="text-xs font-normal text-gray-500 transform-gpu">
                  {reviews.length} review{reviews.length > 1 ? "s" : ""}
                </span>
              )}
            </h3>

            <div className="space-y-2 transform-gpu">
              {reviews.slice(0, 2).map((rev) => (
                <div
                  key={rev.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm transform-gpu"
                >
                  <div className="flex justify-between mb-1 transform-gpu">
                    <span className="font-semibold text-gray-800 transform-gpu">{rev.name}</span>
                    <span className="text-gray-500 text-xs transform-gpu">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-1 transform-gpu">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        filled={i < getSafeRating(rev.rating)}
                        className={`w-4 h-4 transform-gpu ${
                          i < getSafeRating(rev.rating)
                            ? "text-gray-950"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-sm transform-gpu">{rev.comment}</p>
                </div>
              ))}

              {reviews.length === 0 && (
                <p className="text-sm text-gray-500 transform-gpu">
                  No reviews yet – be the first to share your experience.
                </p>
              )}

              {reviews.length > 2 && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-sm text-blue-600 hover:underline transform-gpu"
                >
                  View {reviews.length - 2} more review(s)
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20 transform-gpu">
          <h2 className="text-3xl font-light text-gray-900 text-start mb-12 transform-gpu">
            Similar Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 transform-gpu">
            {similarProducts.map((sp) => {
              const isFav = favourites.some((f) => f.id === sp.id);

              return (
                <div
                  key={sp.id}
                  className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer transform-gpu hover:scale-[1.03]"
                  onClick={() => navigate(`/salesproduct/${sp.id}`)}
                >
                  {/* ❤️ Favourite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(sp);
                    }}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full border border-gray-200 
                      bg-white hover:bg-gray-100 shadow-sm transition-all hover:scale-110 
                      active:scale-90 transform-gpu
                      ${isFav ? "text-red-500" : "text-gray-500"}`}
                  >
                    <HeartIcon
                      filled={isFav}
                      className="text-lg transform-gpu"
                    />
                  </button>

                  {/* Product Image */}
                  <div className="w-full h-[220px] overflow-hidden rounded-t-2xl transform-gpu">
                    <img
                      src={sp.image}
                      alt={sp.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 transform-gpu"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/300";
                      }}
                    />
                  </div>

                  {/* Title + Price */}
                  <div className="p-4 transform-gpu">
                    <h3 className="font-medium text-gray-800 text-sm truncate mb-1 transform-gpu">
                      {sp.name}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-700 transform-gpu">
                      <span className="text-sm font-semibold transform-gpu">QAR {sp.price}</span>
                      {sp.oldPrice && (
                        <span className="text-xs line-through text-gray-400 transform-gpu">
                          QAR {sp.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Faq />
      <CallToAction />

      {/* Review Modal – Glass Skiper style with list + form */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-lg px-4 animate-fade-in transform-gpu"
        >
          <div
            className="
              w-full max-w-lg rounded-3xl
              bg-white/55 backdrop-blur-2xl
              border border-white/30
              shadow-[0_12px_32px_rgba(0,0,0,0.12)]
              p-6 space-y-6
              animate-slide-up
              transform-gpu
            "
          >
            <div className="flex items-center justify-between transform-gpu">
              <h3 className="text-lg font-semibold text-gray-900 transform-gpu">
                Customer Reviews
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="
                  h-8 w-8 flex items-center justify-center rounded-full
                  bg-white/60 text-gray-500 hover:bg-white
                  transition transform-gpu
                  active:scale-95
                "
              >
                <CloseIcon className="w-4 h-4 transform-gpu" />
              </button>
            </div>

            {/* All reviews list */}
            <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-1 transform-gpu">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="border border-white/40 rounded-2xl p-4 bg-white/60 transform-gpu"
                  >
                    <div className="flex justify-between mb-1 transform-gpu">
                      <span className="font-semibold text-gray-800 transform-gpu">
                        {rev.name}
                      </span>
                      <span className="text-gray-500 text-xs transform-gpu">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1 transform-gpu">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          filled={i < getSafeRating(rev.rating)}
                          className={`w-4 h-4 transform-gpu ${
                            i < getSafeRating(rev.rating)
                              ? "text-gray-950"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm transform-gpu">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center text-sm transform-gpu">
                  No reviews yet – be the first to review!
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2 border-t border-white/40 transform-gpu">
              <h3 className="text-md font-semibold text-gray-900 transform-gpu">
                Write a Review
              </h3>

              {/* Name */}
              <div className="space-y-1.5 transform-gpu">
                <label className="text-xs font-medium text-gray-700 transform-gpu">
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
                    transform-gpu
                  "
                />
              </div>

              {/* Rating */}
              <div className="space-y-1.5 transform-gpu">
                <label className="text-xs font-medium text-gray-700 transform-gpu">
                  Rating
                </label>
                <div
                  className="
                    flex items-center justify-center gap-3 px-4 py-2.5
                    rounded-xl bg-white/50 border border-white/20
                    transform-gpu
                  "
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                      className="transition-transform duration-150 transform-gpu active:scale-95"
                    >
                      <StarIcon
                        filled={i < reviewRating}
                        className={`w-6 h-6 transform-gpu`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1.5 transform-gpu">
                <label className="text-xs font-medium text-gray-700 transform-gpu">
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
                    transform-gpu
                  "
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-1 transform-gpu">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="
                    px-4 py-2 text-sm rounded-xl
                    bg-white/70 text-gray-700
                    hover:bg-white transition
                    transform-gpu
                    active:scale-95
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={!reviewText || !reviewName || reviewRating === 0}
                  className={`
                    px-4 py-2 text-sm rounded-xl text-white
                    transform-gpu
                    active:scale-95
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
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes image-fade {
          0% {
            opacity: 0.6;
            transform: scale(1.03);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-image-fade {
          animation: image-fade 0.35s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.22s cubic-bezier(0.25, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}