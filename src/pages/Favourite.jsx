import React, { useState, useEffect, useMemo } from "react";
import {
  HeartIcon,
  ShareIcon,
  ArrowOutward,
  TrashIcon,
} from "../components/SvgIcon";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite } from "../store/favouritesSlice";
import BackButton from "../components/BackButton";
import { useTranslation } from "react-i18next";

// ==================== NORMALIZE PRODUCT ====================
const normalizeProductData = (item) => {
  if (!item || !item.id) return null;

  const extractString = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value.name || value.title || value.value || "";
    }
    return String(value);
  };

  const extractId = (value) => {
    if (!value) return null;
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "object") {
      return value.id || value._id || value.value || null;
    }
    return null;
  };

  const extractBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    if (typeof value === "number") return value === 1;
    return false;
  };

  const normalizeImage = (image) => {
    if (!image) return null;
    
    if (typeof image === 'object' && !Array.isArray(image)) {
      return image.avif || image.webp || image.url || image.path || null;
    }
    
    if (typeof image === 'string') return image;
    
    return null;
  };

  return {
    id: item.id,
    name: extractString(item.name || item.name_en || "Unnamed Product"),
    price: item.price || 0,
    image: normalizeImage(item.image || item.img),
    company_name: extractString(item.company_name || "Company"),
    company_id: extractId(item.company_id),
    isOnSale:
      extractBoolean(item.isOnSale) ||
      item.category_name === "SALE" ||
      item.category_name === "Sale",
    isNewArrival:
      extractBoolean(item.isNewArrival) ||
      item.category_name === "NEW ARRIVAL" ||
      item.category_name === "New Arrival",
    category_name: extractString(item.category_name),
    source: item.source || "favourites",
    // Store raw product for proper navigation
    rawProduct: item,
  };
};

// ==================== GET IMAGE URL ====================
const getImageUrl = (imgPath) => {
  if (!imgPath) return "/api/placeholder/300/300";
  
  if (typeof imgPath === 'string') {
    return imgPath.startsWith("http") 
      ? imgPath 
      : `https://catalogueyanew.com.awu.zxu.temporary.site/${imgPath.replace(/^\//, "")}`;
  }
  
  return "/api/placeholder/300/300";
};

// ==================== PRODUCT URL ====================
const getProductUrl = (item, language = "en") => {
  // Use language prefix for all routes
  const basePath = language !== "en" ? `/${language}` : "";
  
  // Check if raw product has specific source info
  if (item.rawProduct) {
    const source = item.rawProduct.source;
    if (source === "sales" || item.isOnSale) {
      return `${basePath}/salesproduct/${item.id}`;
    }
    if (source === "new_arrivals" || item.isNewArrival) {
      return `${basePath}/newarrivalprofile/${item.id}`;
    }
  }
  
  // Default to regular product page
  return `${basePath}/product/${item.id}`;
};

// ==================== PRODUCT CARD COMPONENT ====================
const ProductCard = ({ item, dispatch, navigate, language, isRTL }) => {
  const handleProductClick = () => {
    if (!item?.id) return;
    navigate(getProductUrl(item, language));
  };

  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (item.company_id) {
      const basePath = language !== "en" ? `/${language}` : "";
      navigate(`${basePath}/company/${item.company_id}`);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${getProductUrl(item, language)}`;

    if (navigator.share) {
      navigator.share({ title: item.name, text: item.name, url });
    } else {
      navigator.clipboard.writeText(url);
      // Optional: Add toast notification
      alert(language === "ar" ? "تم نسخ الرابط" : "Link copied to clipboard!");
    }
  };

  const handleRemoveFavourite = (e) => {
    e.stopPropagation();
    dispatch(toggleFavourite(item));
  };

  // Format price based on language
  const formatPrice = () => {
    const priceNum = Number(item.price);
    if (isNaN(priceNum)) {
      return language === "ar" ? "السعر غير متاح" : "Price not available";
    }
    
    if (language === "ar") {
      return `${priceNum.toLocaleString("ar-QA")} ريال قطري`;
    }
    return `QAR ${priceNum.toFixed(2)}`;
  };

  // Get position classes based on RTL
  const getPositionClasses = (position) => {
    if (position === "badges") {
      return isRTL ? "top-2 right-2" : "top-2 left-2";
    }
    if (position === "actions") {
      return isRTL ? "top-2 left-2" : "top-2 right-2";
    }
    return "";
  };

  return (
    <div
      key={item.id}
      className="bg-white rounded-lg border border-gray-200 
                 hover:border-gray-300 transition-colors duration-200
                 cursor-pointer overflow-hidden flex flex-col
                 hover:shadow-md group"
      onClick={handleProductClick}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Image Container */}
      <div className="relative w-full pt-[100%] bg-gray-100 overflow-hidden">
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-300
                     group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/300";
            e.target.onerror = null;
          }}
        />
        
        {/* Category Badges */}
        <div className={`absolute ${getPositionClasses("badges")} flex flex-col gap-1`}>
          {item.isOnSale && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-red-500 text-white rounded">
              {language === "ar" ? "تخفيض" : "SALE"}
            </span>
          )}
          {item.isNewArrival && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-500 text-white rounded">
              {language === "ar" ? "جديد" : "NEW"}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className={`absolute ${getPositionClasses("actions")} flex flex-col gap-2`}>
          {/* Remove Button */}
          <button
            onClick={handleRemoveFavourite}
            className="p-1.5 bg-white/90 backdrop-blur-sm 
                     rounded-full hover:bg-white transition-colors
                     shadow-sm hover:shadow-md"
            aria-label={language === "ar" ? "إزالة من المفضلة" : "Remove from favourites"}
          >
            <TrashIcon size={14} className="text-gray-600" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 bg-white/90 backdrop-blur-sm 
                     rounded-full hover:bg-white transition-colors
                     shadow-sm hover:shadow-md"
            aria-label={language === "ar" ? "مشاركة المنتج" : "Share product"}
          >
            <ShareIcon size={14} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-1 text-start">
          {item.name}
        </h3>

        {/* Company */}
        <button
          onClick={handleCompanyClick}
          className="text-[10px] sm:text-xs text-gray-500 
                   hover:text-blue-600 text-left mb-2
                   transition-colors duration-200"
        >
          {item.company_name}
        </button>

        {/* Price and View Button */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm sm:text-base font-semibold text-gray-900">
            {formatPrice()}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick();
            }}
            className="p-1.5 hover:bg-gray-100 rounded-full 
                     transition-colors flex items-center gap-1"
            aria-label={language === "ar" ? "عرض المنتج" : "View product"}
          >
            <span className="text-xs text-gray-600 hidden sm:inline">
              {language === "ar" ? "عرض" : "View"}
            </span>
            <ArrowOutward 
              size={14} 
              className="text-gray-600"
              style={{ transform: isRTL ? "scaleX(-1)" : "none" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== EMPTY STATE COMPONENT ====================
const EmptyState = ({ language }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <HeartIcon className="w-10 h-10 text-gray-400" />
    </div>
    <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-gray-800">
      {language === "ar" ? "لا توجد منتجات مفضلة" : "No Favourites Yet"}
    </h2>
    <p className="text-gray-500 max-w-md">
      {language === "ar" 
        ? "المنتجات التي تضيفها إلى المفضلة ستظهر هنا" 
        : "Products you add to favourites will appear here"}
    </p>
  </div>
);

// ==================== MAIN FAVOURITE COMPONENT ====================
export default function Favourite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  const favourites = useSelector((state) => state.favourites.items);
  const [normalizedFavourites, setNormalizedFavourites] = useState([]);
  const [isRTL, setIsRTL] = useState(i18n.language === "ar");

  // Update RTL when language changes
  useEffect(() => {
    setIsRTL(i18n.language === "ar");
  }, [i18n.language]);

  // Normalize favourites data
  useEffect(() => {
    const normalized = favourites
      .map((item) => normalizeProductData(item))
      .filter(Boolean);
    
    // Sort by most recently added
    const sorted = [...normalized].sort((a, b) => {
      // This assumes newer items are at the end of the array
      // Adjust based on your actual data structure
      return normalized.indexOf(b) - normalized.indexOf(a);
    });
    
    setNormalizedFavourites(sorted);
  }, [favourites]);

  // Memoize text content based on language
  const pageTitle = useMemo(() => 
    i18n.language === "ar" ? "مفضلاتك" : "Your Favourites",
    [i18n.language]
  );

  const itemCountText = useMemo(() => {
    const count = normalizedFavourites.length;
    if (i18n.language === "ar") {
      return `${count} ${count === 1 ? 'عنصر' : 'عناصر'}`;
    }
    return `${count} ${count === 1 ? 'item' : 'items'}`;
  }, [normalizedFavourites.length, i18n.language]);

  // Handle back navigation with language consideration
  const handleBackClick = () => {
    const basePath = i18n.language !== "en" ? `/${i18n.language}` : "";
    navigate(basePath || "/");
  };

  // ==================== EMPTY STATE ====================
  if (normalizedFavourites.length === 0) {
    return (
      <div className="min-h-screen w-full py-20 sm:py-24 px-4 sm:px-6 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton 
              variant="text" 
              className="mb-4" 
              onClick={handleBackClick}
            />
          </div>
          
          <EmptyState language={i18n.language} />
        </div>
      </div>
    );
  }

  // ==================== MAIN UI ====================
  return (
    <div className="min-h-screen w-full py-6 sm:py-8 px-3 sm:px-4 md:px-6 relative bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4" dir={isRTL ? "rtl" : "ltr"}>
            {/* Back Button */}
            <div>
              <BackButton 
                variant="text" 
                className="mb-4" 
                onClick={handleBackClick}
              />
            </div>
            
            {/* Title Section */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 text-start">
                {pageTitle}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1 text-start">
                {itemCountText}
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {normalizedFavourites.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              dispatch={dispatch}
              navigate={navigate}
              language={i18n.language}
              isRTL={isRTL}
            />
          ))}
        </div>

        {/* Mobile-only bottom spacing */}
        <div className="h-16 sm:h-0"></div>
      </div>
    </div>
  );
}