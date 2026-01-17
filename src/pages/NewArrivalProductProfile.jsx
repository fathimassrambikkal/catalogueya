import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import ReviewModal from "../components/ReviewModal";
import SimilarProducts from "../components/SimilarProducts";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite, openListPopup } from "../store/favouritesSlice";
 import { createCustomerConversation,getProductReviews } from "../api";
import { useFixedWords } from "../hooks/useFixedWords";
import { addProductReview } from "../api";
import { useLocation } from "react-router-dom";



import { getProduct, getCompany } from "../api";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// SVG Icons
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

const HeartIcon = ({ filled = false, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const StarIcon = ({ filled, className = "" }) => (
  <svg 
    className={`${className} `}
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
    className={`${className} `}
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
    className={`${className} `}
    width="17" 
    height="17" 
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.520.263-1.639.742-3.468 1.105z" />
    <circle cx="4" cy="8" r="1" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="12" cy="8" r="1" />
  </svg>
);

const CloseIcon = ({ className = "" }) => (
  <svg 
    className={`${className} `}
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

const PremiumIconButton = ({ onClick, title, children }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    title={title}
    className="
      relative flex items-center justify-center
     w-[clamp(38px,4vw,44px)]
      h-[clamp(38px,4vw,44px)] rounded-[16px]
      bg-white/40 backdrop-blur-2xl
      border border-[rgba(255,255,255,0.28)]
      shadow-[0_8px_24px_rgba(0,0,0,0.18)]
      hover:bg-white/55 transition-all duration-300
      active:scale-95
    "
  >
    <span
      className="absolute inset-0 rounded-[16px]
      bg-gradient-to-br from-white/70 via-white/10 to-transparent
      opacity-40 pointer-events-none "
    />
    <span
      className="absolute inset-0 rounded-[16px]
      bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)]
      opacity-35 pointer-events-none "
    />
    <span
      className="absolute inset-0 rounded-[16px]
      bg-gradient-to-t from-black/20 to-transparent
      opacity-20 pointer-events-none "
    />
    <span className="relative z-10 flex items-center justify-center ">
      {children}
    </span>
  </button>
);

const getSafeRating = (value) => {
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) return 0;
  if (num > 5) return 5;
  return num;
};

const getCountryFromIP = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const res = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      return data.country_name;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (e) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const res = await fetch("https://ipwho.is/", {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        return data.country;
      } catch (fallbackError) {
        clearTimeout(timeoutId);
        throw fallbackError;
      }
    } catch (fallbackError) {
      return null;
    }
  }
};

const buildShowProductPayload = async () => {
  let country = null;
  
  try {
    country = await getCountryFromIP();
  } catch (error) {
  }

  const device = navigator.userAgent;

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null;

  const payload = {
    device,
    ...(country && { country }),
    ...(token && { token }),
  };

  return payload;
};
   






export default function NewArrivalProductProfile() {
  const params = useParams();
  const navigate = useNavigate();
 const location = useLocation();

const dispatch = useDispatch();
const favourites = useSelector((state) => state.favourites.items);
const auth = useSelector((state) => state.auth);

  const { companyId, id: routeProductId, productId, pid } = params;
  const resolvedProductId = routeProductId || productId || pid;
const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

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
const [reviewsLoading, setReviewsLoading] = useState(false);
const [showAllReviews, setShowAllReviews] = useState(false);

  const isFavourite = product ? favourites.some((f) => f.id === product.id) : false;

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/api/placeholder/400/400";
    if (imgPath.startsWith("http")) return imgPath;
    const cleanPath = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
  if (!auth?.user) return;
  if (!product) return;

  const params = new URLSearchParams(location.search);
  const action = params.get("action");

  if (action === "review") {
    setShowReviewModal(true);

    // clean URL
    navigate(location.pathname, { replace: true });
  }
}, [auth?.user, product]);

 






useEffect(() => {
  if (!resolvedProductId) return;

  let mounted = true;

  const fetchReviews = async () => {
    try {
      const res = await getProductReviews(resolvedProductId);

      const apiData = res?.data?.data || {};
      const apiReviews = apiData.reviews || [];

      // ✅ MAP API RESPONSE → UI FORMAT
      const mappedReviews = apiReviews.map((r) => ({
        id: r.review_id,                       
        name: r.user?.name || "Anonymous",        
        rating: Number(r.rating) || 0,            
        comment: r.comment || "",                 
        date: new Date(r.created_at).toLocaleDateString(),
        userImage: r.user?.image || null,         
      }));

      if (mounted) setReviews(mappedReviews);
    } catch (err) {
      console.error("Failed to load product reviews", err);
      if (mounted) setReviews([]);
    }
  };

  fetchReviews();

  return () => {
    mounted = false;
  };
}, [resolvedProductId]);







  useEffect(() => {
  console.log("fw:", fw);
  console.log("write_review:", fw.write_review);
}, [fw]);

  useEffect(() => {
    let mounted = true;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        let productResponse;
        let lastError = null;
        
        try {
          const simplePayload = {
            device: navigator.userAgent,
          };
          productResponse = await getProduct(resolvedProductId, simplePayload);
        } catch (error1) {
          lastError = error1;
          
          try {
            const payload = await buildShowProductPayload();
            productResponse = await getProduct(resolvedProductId, payload);
          } catch (error2) {
            lastError = error2;
            
            try {
              productResponse = await getProduct(resolvedProductId, {});
            } catch (error3) {
              lastError = error3;
              throw error3;
            }
          }
        }

        const productData =
          productResponse?.data?.data?.product ||
          productResponse?.data?.product;

        if (!productData) {
          if (mounted) setError("Product not found in API response");
          return;
        }

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
          category_name: "NEW ARRIVAL",
          discount_percent: productData.discount_percent || null,
          albums: Array.isArray(productData.albums)
            ? productData.albums
                .map(a => a?.path || a?.image || a)
                .filter(Boolean)
            : [],
          isNewArrival: true,
        };

        if (!mounted) return;

        setProduct(transformedProduct);
        
        const mainImage = 
          productData.image || 
          productData.albums?.[0]?.path || 
          productData.albums?.[0]?.image || 
          "";
        
        setSelectedImage(getImageUrl(mainImage));


        if (productData.company_id) {
          setTimeout(async () => {
            try {
              const companyRes = await getCompany(productData.company_id);

              const company =
                companyRes?.data?.data?.company ||
                companyRes?.data?.company ||
                companyRes?.data;

              let list = company?.products || [];
              list = list.filter((p) => p.id !== productData.id);

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
              if (mounted) setSimilarProducts([]);
            }
          }, 300);
        } else {
          if (mounted) setSimilarProducts([]);
        }
      } catch (err) {
        if (mounted) {
          if (err.response?.status === 422) {
            setError(`API validation error (422). Please check the product ID: ${resolvedProductId}`);
          } else if (err.response?.status === 404) {
            setError(`Product not found (404). ID: ${resolvedProductId}`);
          } else {
            setError(`Failed to load product: ${err.message || "Network error"}`);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    if (resolvedProductId) fetchProductData();

    return () => {
      mounted = false;
    };
  }, [resolvedProductId]);

  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (product?.company_id) {
      navigate(`/company/${product.company_id}`);
    }
  };

  const handleChat = useCallback(
  async (e) => {
    e.stopPropagation();

    if (!product?.company_id) {
      console.error("Invalid company ID for chat", product);
      return;
    }

    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const companyId = Number(product.company_id);

    // 🚫 Guest → redirect with intent
    if (!token || userType !== "customer") {
      navigate(`/sign?redirect=/chat-intent/company/${companyId}`);
      return;
    }

    // ✅ Logged-in customer → create/open chat
    try {
      const res = await createCustomerConversation({
        is_group: false,
        participant_ids: [companyId],
      });

      const conversationId =
        res.data?.data?.id ||
        res.data?.conversation?.id ||
        res.data?.id;

      if (!conversationId) {
        console.error("Conversation ID missing");
        return;
      }

      navigate(`/customer-login/chat/${conversationId}`);
    } catch (err) {
      console.error("Chat creation failed", err);
    }
  },
  [product, navigate]
);


  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + getSafeRating(r.rating), 0) /
        reviews.length
      : product?.rating || 0;

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out this new arrival: ${product.name} from ${product.company_name}`,
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
    }
  };

const handleReviewSubmit = async () => {
  if (!reviewName || !reviewText || reviewRating === 0) {
    alert("Please enter your name, rating, and comment.");
    return;
  }

  try {
    // 🔥 SEND TO BACKEND
    await addProductReview(
      resolvedProductId,     // IMPORTANT: use resolvedProductId
      reviewRating,
      reviewText.trim()
    );

    // ✅ Optimistic UI update (instant feedback)
    const newRev = {
      id: Date.now(),
      name: reviewName,
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toLocaleDateString(),
    };

    setReviews((prev) => [...prev, newRev]);

    setShowReviewModal(false);
    setReviewName("");
    setReviewText("");
    setReviewRating(0);

    alert(`⭐ ${newRev.rating}-star review submitted!`);

  } catch (error) {
    console.error("❌ Failed to submit review", error);
    alert(
      error?.response?.data?.message ||
      "Failed to submit review. Please try again."
    );
  }
};


  const handleImageClick = (src) => {
    setSelectedImage(getImageUrl(src));
  };

  if (error && !product) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center py-20 text-lg text-gray-600 ">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          {error || "New arrival product not found."}
          <div className="text-sm text-gray-500 mb-4">
            Product ID: {resolvedProductId}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition "
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 ml-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition "
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const productImages = [
    product?.image,
    ...(product?.albums || []),
  ].filter(Boolean);

  return (
    <>
      {loading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      <button
  onClick={() => navigate(-1)}
  className={backButtonClass}
  aria-label="Go back"
>
  <ArrowLeftIcon className="text-gray-700 transform-gpu" />
</button>

      <section
        key={product?.id || 'loading'}
        className="max-w-[1200px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 bg-white rounded-3xl shadow-sm  animate-fade-in"
      >
        <div className="relative flex flex-col md:sticky md:top-24 h-fit w-full ">
          <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm ">
            
            {product ? (
              <img
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover animate-image-fade"
                onError={(e) => (e.target.src = "/api/placeholder/500/500")}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl" />
            )}

            <div className={`absolute top-4 right-4 flex flex-col gap-3 z-30 ${!product ? 'opacity-40' : ''}`}>
              <PremiumIconButton
                title={isFavourite ? "Remove from favourites" : "Add to favourites"}
                onClick={() => {
  if (!product) return;

  const isAlreadyFav = favourites.some((f) => f.id === product.id);

  // 🔄 always toggle
  dispatch(
    toggleFavourite({
      ...product,
      source: "new_arrivals",
    })
  );

  // 🔐 popup only when ADDING
  if (auth.user && !isAlreadyFav) {
    dispatch(
      openListPopup({
        ...product,
        source: "new_arrivals",
      })
    );
  }
}}


                disabled={!product}
              >
                <HeartIcon
                  filled={isFavourite}
                  className={`w-[clamp(12px,1.1vw,16px)]
    h-[clamp(12px,1.1vw,16px)] ${
                    isFavourite ? "text-red-500" : "text-gray-600 hover:text-red-400"
                  }`}
                />
              </PremiumIconButton>

              <PremiumIconButton title="Share product" onClick={handleShare} disabled={!product}>
                <ShareIcon className=" w-[clamp(13px,1.1vw,16px)]
    h-[clamp(13px,1.1vw,16px)] text-[rgba(18,18,18,0.88)] " />
              </PremiumIconButton>

              <PremiumIconButton title="Chat" onClick={handleChat} disabled={!product}>
                <ChatIcon className=" w-[clamp(13px,1.1vw,17px)]
    h-[clamp(13px,1.1vw,17px)] text-[rgba(18,18,18,0.88)] " />
              </PremiumIconButton>
            </div>

            {productImages.length > 1 ? (
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
                        
                        ${isActive
                          ? "border-gray-900 shadow-xl bg-white/40 scale-105"
                          : "border-gray-300 opacity-80 bg-white/25 hover:scale-105"
                        }
                        active:scale-95
                      `}
                    >
                      {isActive && (
                        <div
                          className="absolute inset-0 rounded-xl border-[2.5px] border-white shadow-lg "
                        />
                      )}

                      <img
                        src={img}
                        className={`w-full h-full object-cover  ${isActive ? 'scale-110' : 'scale-100'}`}
                        onError={(e) => (e.target.src = "/api/placeholder/200/200")}
                      />
                    </button>
                  );
                })}
              </div>
            ) : productImages.length === 0 && product ? (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="w-14 h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6 ">
          <div className="space-y-2 ">
         <p className="text-xs font-medium tracking-[0.18em] uppercase text-gray-500">
  {fw.product}
</p>


            {product ? (
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight ">
                {product.name}
              </h1>
            ) : (
              <div className="h-10 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
            )}

            {product ? (
              product.company_name && (
                <button
                  onClick={handleCompanyClick}
                  className="text-sm text-blue-600 font-medium hover:underline w-fit flex items-center gap-1 "
                >
                  <span className="text-gray-500">{fw.by}</span>
                  {product.company_name}
                </button>
              )
            ) : (
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            )}
          </div>

          <div className="space-y-1 ">
            {product ? (
              <>
                <div className="flex items-baseline gap-2 ">
                  <span className="text-3xl font-semibold text-gray-900 ">
                    {fw.qar} {product.price}
                  </span>

                  {product.oldPrice && (
                    <span className="text-sm line-through text-gray-400 ">
                      QAR {product.oldPrice}
                    </span>
                  )}

                  {product.discount_percent && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 ">
                      -{product.discount_percent}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 ">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      filled={i < Math.round(averageRating)}
                      className={`w-4 h-4  ${
                        i < Math.round(averageRating)
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="h-8 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3 ">
            <h3 className="text-lg font-medium text-gray-900 ">{fw.product_details} </h3>
            {product ? (
              <p className="text-gray-600 leading-relaxed text-sm md:text-base ">
                {product.description ||
                  `Discover our latest ${product.name} — fresh new design and premium quality.`}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
              </div>
            )}
          </div>

<button
  onClick={(e) => {
    e.stopPropagation();

    // 🚫 Guest user → redirect to login with intent
    if (!auth?.user) {
      navigate(
        `/sign?redirect=/product/${resolvedProductId}&action=review`
      );
      return;
    }

    // ✅ Logged-in customer → open review modal
    setShowReviewModal(true);
  }}
  disabled={!product}
  className={`inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-xl transition active:scale-95 ${
    product
      ? "bg-gray-900 text-white hover:bg-gray-800"
      : "bg-gray-200 text-gray-400 cursor-not-allowed"
  }`}
>
  {product ? (fw.write_review || "Write a Review") : "Loading..."}
</button>



      {/* Customer Reviews */}
<div className="space-y-3 transform-gpu">
  <h3 className="text-sm font-semibold text-gray-900 flex items-center justify-between">
    {fw.customer_reviews}
  
  </h3>

  {product && reviews.length > 0 ? (
    <>
      {/* Show only first 2 reviews */}
      {reviews.slice(0, 2).map((rev) => (
        <div
          key={rev.id}
          className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
        >
          <div className="flex justify-between mb-1">
            <span className="font-semibold text-gray-800">{rev.name}</span>
            <span className="text-gray-500 text-xs">{rev.date}</span>
          </div>

          <div className="flex items-center  gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                filled={i < getSafeRating(rev.rating)}
                className={`w-4 h-4 ${
                  i < getSafeRating(rev.rating)
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>

          <p className="text-gray-700 text-sm">{rev.comment}</p>
        </div>
      ))}

      {/* 🔗 VIEW ALL REVIEWS BUTTON */}
   {reviews.length > 2 && (
        <button
          onClick={() =>
            navigate(`/product/${resolvedProductId}/reviews`)
          }
          className="
           group
    w-full mt-2 py-2
    text-sm font-medium
    text-blue-600 hover:text-blue-700
    hover:underline
    transition
    flex items-center gap-1.5
    text-left

    ltr:flex-row
  
          "
        >
         <span>
     {(fw.view_all_reviews || "View all")} {reviews.length}{" "}
    {(fw.reviews || "reviews")}
  </span>
  
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="
      w-4 h-4
      transition-transform duration-200
      transform-gpu

      ltr:group-hover:translate-x-0.5
      rtl:group-hover:-translate-x-0.5

      rtl:scale-x-[-1]
    "
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M13 5l6 7-6 7" />
  </svg>
        </button>
      )}
    </>
  ) : (
    <p className="text-sm text-gray-500">{fw.no_reviews}</p>
  )}
</div>

        </div>
      </section>

      <SimilarProducts 
        products={similarProducts}
        favourites={favourites}
        toggleFavourite={(item) => {
  const isAlreadyFav = favourites.some((f) => f.id === item.id);

  dispatch(
    toggleFavourite({
      ...item,
      source: "new_arrivals",
    })
  );

  if (auth.user && !isAlreadyFav) {
    dispatch(
      openListPopup({
        ...item,
        source: "new_arrivals",
      })
    );
  }
}}

      />

      <Faq />
      <CallToAction />

      {showReviewModal && product && (
        <ReviewModal
          reviews={reviews}
          reviewName={reviewName}
          reviewText={reviewText}
          reviewRating={reviewRating}
          setReviewName={setReviewName}
          setReviewText={setReviewText}
          setReviewRating={setReviewRating}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
}