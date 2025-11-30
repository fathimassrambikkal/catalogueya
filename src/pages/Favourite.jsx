import React, { useState, useEffect } from "react";
import {
  FaTrashAlt,
  FaShareAlt,
  FaExternalLinkAlt,
  FaHeart,
  FaArrowLeft,
  FaBuilding,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useFavourites } from "../context/FavouriteContext";
import { useNavigate } from "react-router-dom";

// Enhanced normalization function to handle objects and product types
const normalizeProductData = (item) => {
  if (!item || !item.id) return null;

  // Helper function to extract string from objects
  const extractString = (value) => {
    if (!value) return "";
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.name || value.title || value.value || "";
    }
    return String(value);
  };

  // Helper function to extract ID from objects
  const extractId = (value) => {
    if (!value) return null;
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'object') {
      return value.id || value._id || value.value || null;
    }
    return null;
  };

  // Helper function to extract boolean from various formats
  const extractBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return false;
  };

  return {
    id: item.id,
    name: extractString(item.name || item.name_en || "Unnamed Product"),
    price: item.price || 0,
    image: extractString(item.image || item.img || '/api/placeholder/300/300'),
    company_name: extractString(item.company_name || "Company"),
    company_id: extractId(item.company_id),
    // ✅ PROPERLY DETECT PRODUCT TYPES
    isOnSale: extractBoolean(item.isOnSale) || item.category_name === "SALE" || item.category_name === "Sale",
    isNewArrival: extractBoolean(item.isNewArrival) || item.category_name === "NEW ARRIVAL" || item.category_name === "New Arrival",
    // Preserve original category for detection
    category_name: extractString(item.category_name),
  };
};

export default function Favourite() {
  const { favourites, toggleFavourite } = useFavourites();
  const navigate = useNavigate();
  const [normalizedFavourites, setNormalizedFavourites] = useState([]);

  // Normalize favourites data on component mount and when favourites change
  useEffect(() => {
    const normalized = favourites
      .map(item => normalizeProductData(item))
      .filter(Boolean);
    
    // Debug log to see what product types are detected
    console.log("🔄 Normalized favourites with types:", normalized.map(item => ({
      id: item.id,
      name: item.name,
      isOnSale: item.isOnSale,
      isNewArrival: item.isNewArrival,
      category_name: item.category_name
    })));
    
    setNormalizedFavourites(normalized);
  }, [favourites]);

  // Handle product navigation - FIXED to use proper routes
  const handleProductClick = (item) => {
    if (!item || !item.id) return;
    
    console.log("📍 Navigating product:", {
      id: item.id,
      name: item.name,
      isOnSale: item.isOnSale,
      isNewArrival: item.isNewArrival,
      category: item.category_name
    });

    // Navigate based on product type with proper routes
    if (item.isOnSale) {
      navigate(`/salesproduct/${item.id}`);
    } else if (item.isNewArrival) {
      navigate(`/newarrivalprofile/${item.id}`);
    } else {
      // Default to regular product profile
      navigate(`/product/${item.id}`);
    }
  };

  // Handle company navigation
  const handleCompanyClick = (item, e) => {
    e.stopPropagation();
    
    if (item.company_id && item.company_id !== "null" && item.company_id !== "undefined") {
      navigate(`/company/${item.company_id}`);
    } else {
      alert("Company information not available");
    }
  };

  // Handle share
  const handleShare = (item, e) => {
    e.stopPropagation();
    
    // Get correct URL based on product type
    const url = `${window.location.origin}${getProductUrl(item)}`;
    const shareData = {
      title: item.name,
      text: `Check out ${item.name} on Catalogueya!`,
      url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => alert("Share cancelled."));
    } else {
      navigator.clipboard.writeText(url);
      alert("🔗 Link copied to clipboard!");
    }
  };

  // Get product URL for sharing - FIXED to match your routes
  const getProductUrl = (item) => {
    if (item.isOnSale) {
      return `/salesproduct/${item.id}`;
    } else if (item.isNewArrival) {
      return `/newarrivalprofile/${item.id}`;
    } else {
      return `/product/${item.id}`;
    }
  };

  // Get image URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return '/api/placeholder/300/300';
    if (imgPath.startsWith('http')) return imgPath;
    
    const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";
    const cleanPath = String(imgPath).startsWith('/') ? String(imgPath).slice(1) : String(imgPath);
    return `${API_BASE_URL}/${cleanPath}`;
  };

  if (!normalizedFavourites || normalizedFavourites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
        <FaHeart className="text-4xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Favourites Yet</h2>
        <p className="text-gray-500 max-w-md">
          Items you add to favourites will appear here. Start exploring our products!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 mt-24 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-4 sm:-left-6 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full
                   border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300"
        title="Go Back"
      >
        <FaArrowLeft className="text-gray-700 text-lg sm:text-xl" />
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Your Favourites ({normalizedFavourites.length})
        </h1>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {normalizedFavourites.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            onClick={() => handleProductClick(item)}
          >
            {/* Product Image */}
            <div className="w-full h-48 overflow-hidden rounded-t-2xl bg-gray-100">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = '/api/placeholder/300/300';
                  e.target.className = "w-full h-full object-cover bg-gray-200";
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Product Name */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {item.name}
              </h3>

              {/* Company Name - CLICKABLE */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={(e) => handleCompanyClick(item, e)}
                  className="text-sm text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors text-left"
                  title={`Visit ${item.company_name} page`}
                >
                  {item.company_name}
                </button>
              </div>

              {/* Product Type Badge */}
              <div className="mb-2">
                {item.isOnSale && (
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-2">
                    SALE
                  </span>
                )}
                {item.isNewArrival && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {/* Price + Action Buttons */}
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-bold text-lg">
                  QAR {item.price || "N/A"}
                </span>

                <div className="flex items-center gap-2">
                  {/* Share Button */}
                  <button
                    onClick={(e) => handleShare(item, e)}
                    className="text-gray-500 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-50"
                    title="Share"
                  >
                    <FaShareAlt size={16} />
                  </button>

                  {/* View Details Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(item);
                    }}
                    className="text-gray-500 hover:text-green-600 transition p-2 rounded-full hover:bg-green-50"
                    title="View Details"
                  >
                    <FaExternalLinkAlt size={16} />
                  </button>

                  {/* Remove from Favourites Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(item);
                    }}
                    className="text-gray-500 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50"
                    title="Remove from Favourites"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}