import React, { useState, useEffect } from "react";
import {
  FaTrashAlt,
  FaShareAlt,
  FaExternalLinkAlt,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite } from "../store/favouritesSlice";

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

  // ✅ FIXED: Handle image object properly
  const extractImage = (value) => {
    if (!value) return null;
    
    // If it's already a string (old format)
    if (typeof value === "string") return value;
    
    // If it's an object with AVIF/WebP (new format)
    if (typeof value === "object" && value !== null) {
      return value; // Return the object as-is
    }
    
    return null;
  };

  return {
    id: item.id,
    name: extractString(item.name || item.name_en || "Unnamed Product"),
    price: item.price || 0,
    image: extractImage(item.image || item.img), // ✅ Use extractImage instead of extractString
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
  };
};

// ==================== FAVOURITE PAGE ====================
export default function Favourite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const favourites = useSelector((state) => state.favourites.items);
  const [normalizedFavourites, setNormalizedFavourites] = useState([]);

  useEffect(() => {
    const normalized = favourites
      .map((item) => normalizeProductData(item))
      .filter(Boolean);
    setNormalizedFavourites(normalized);
  }, [favourites]);

  const handleProductClick = (item) => {
    if (!item?.id) return;

    if (item.isOnSale) navigate(`/salesproduct/${item.id}`);
    else if (item.isNewArrival) navigate(`/newarrivalprofile/${item.id}`);
    else navigate(`/product/${item.id}`);
  };

  const handleCompanyClick = (item, e) => {
    e.stopPropagation();
    if (item.company_id) navigate(`/company/${item.company_id}`);
  };

  const handleShare = (item, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${getProductUrl(item)}`;

    if (navigator.share) {
      navigator.share({ title: item.name, text: item.name, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const getProductUrl = (item) => {
    if (item.isOnSale) return `/salesproduct/${item.id}`;
    if (item.isNewArrival) return `/newarrivalprofile/${item.id}`;
    return `/product/${item.id}`;
  };

  // ✅ FIXED: Get image URL that handles both string and object formats
  const getImageUrl = (imgData) => {
    const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";
    
    if (!imgData) return "/api/placeholder/300/300";
    
    // If it's a string (old format)
    if (typeof imgData === "string") {
      if (imgData.startsWith("http")) return imgData;
      return `${API_BASE_URL}/${imgData.replace(/^\//, "")}`;
    }
    
    // If it's an object (new format with AVIF/WebP)
    if (typeof imgData === "object" && imgData !== null) {
      // Try WebP first, then any other format
      const imgPath = imgData.webp || imgData.avif || imgData.url || imgData.path || "";
      if (imgPath.startsWith("http")) return imgPath;
      return `${API_BASE_URL}/${imgPath.replace(/^\//, "")}`;
    }
    
    return "/api/placeholder/300/300";
  };

  // ✅ FIXED: Get AVIF and WebP URLs properly
  const getOptimizedImageUrls = (imgData) => {
    const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";
    
    if (!imgData) {
      return {
        avifUrl: null,
        webpUrl: null,
        fallbackUrl: "/api/placeholder/300/300"
      };
    }
    
    // If it's a string (old format)
    if (typeof imgData === "string") {
      const baseUrl = imgData.startsWith("http") 
        ? imgData 
        : `${API_BASE_URL}/${imgData.replace(/^\//, "")}`;
      
      // Generate AVIF/WebP URLs from the base URL
      const avifUrl = baseUrl.replace(/\.(jpg|jpeg|png)$/i, '.avif');
      const webpUrl = baseUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      return {
        avifUrl,
        webpUrl,
        fallbackUrl: baseUrl
      };
    }
    
    // If it's an object (new format)
    if (typeof imgData === "object" && imgData !== null) {
      const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
      };
      
      return {
        avifUrl: getFullUrl(imgData.avif),
        webpUrl: getFullUrl(imgData.webp),
        fallbackUrl: getFullUrl(imgData.webp || imgData.avif || imgData.url || imgData.path) || "/api/placeholder/300/300"
      };
    }
    
    return {
      avifUrl: null,
      webpUrl: null,
      fallbackUrl: "/api/placeholder/300/300"
    };
  };

  // ==================== EMPTY STATE ====================
  if (normalizedFavourites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
        <FaHeart className="text-4xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Favourites Yet</h2>
      </div>
    );
  }

  // ==================== UI ====================
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 mt-24 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-4 sm:-left-6 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-md hover:scale-110 transition"
      >
        <FaArrowLeft className="text-gray-700 text-lg" />
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Your Favourites ({normalizedFavourites.length})
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {normalizedFavourites.map((item) => {
          const { avifUrl, webpUrl, fallbackUrl } = getOptimizedImageUrls(item.image);
          
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm 
                         hover:shadow-lg hover:scale-[1.02] transition-all duration-300
                         cursor-pointer overflow-hidden"
              onClick={() => handleProductClick(item)}
            >
              <div className="w-full h-28 bg-gray-100 overflow-hidden">
                {avifUrl || webpUrl ? (
                  <picture>
                    {avifUrl && <source srcSet={avifUrl} type="image/avif" />}
                    {webpUrl && <source srcSet={webpUrl} type="image/webp" />}
                    <img
                      src={fallbackUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to placeholder
                        e.target.src = "/api/placeholder/300/300";
                      }}
                    />
                  </picture>
                ) : (
                  // Fallback for images without AVIF/WebP
                  <img
                    src={fallbackUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />
                )}
              </div>

              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {item.name}
                </h3>

                <button
                  onClick={(e) => handleCompanyClick(item, e)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {item.company_name}
                </button>

                <div className="flex gap-1 mt-1">
                  {item.isOnSale && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-full">
                      SALE
                    </span>
                  )}
                  {item.isNewArrival && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full">
                      NEW
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-bold text-gray-900">
                    QAR {item.price}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleShare(item, e)}
                      className="p-1.5 hover:bg-gray-100 rounded-full"
                    >
                      <FaShareAlt size={12} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(item);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-full"
                    >
                      <FaExternalLinkAlt size={12} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleFavourite(item));
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-full"
                    >
                      <FaTrashAlt size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}