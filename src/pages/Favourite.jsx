import React, { useCallback } from "react";
import {
  FaTrashAlt,
  FaShareAlt,
  FaExternalLinkAlt,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useFavourites } from "../context/FavouriteContext";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categoriesData";

export default function Favourite() {
  const { favourites, toggleFavourite } = useFavourites();
  const navigate = useNavigate();

  // Memoized full product lookup
  const getFullProduct = useCallback((item) => {
    if (item.categoryId && item.companyId) return item;
    for (const cat of categories) {
      for (const comp of cat.companies) {
        const prod = comp.products.find((p) => p.id === item.id);
        if (prod) {
          return {
            ...prod,
            categoryId: cat.id,
            companyId: comp.id,
            categoryName: cat.title,
            companyName: comp.name,
            image: prod.image || prod.img,
          };
        }
      }
    }
    return item;
  }, []);

  // Generate URL for navigation or sharing
  const getItemURL = (item) => {
    const type = item.type?.toLowerCase();
    if (type === "sales" || type === "sale" || type === "salesproduct") {
      return `/salesproduct/${item.id}`;
    }
    if (type === "newarrival" || type === "newarrivalproduct") {
      return `/newarrivalprofile/${item.id}`;
    }
    if (item.categoryId && item.companyId) {
      return `/category/${encodeURIComponent(item.categoryId)}/company/${encodeURIComponent(
        item.companyId
      )}/product/${encodeURIComponent(item.id)}`;
    }
    return "/";
  };

  const handleNavigate = (item) => {
    const fullItem = getFullProduct(item);
    const url = getItemURL(fullItem);
    if (url === "/") {
      alert("This saved item is missing category or company details and cannot be opened.");
    } else {
      navigate(url);
    }
  };

  const handleCategoryClick = (item) => {
    const fullItem = getFullProduct(item);
    const url = getItemURL(fullItem);
    if (url !== "/") navigate(url);
  };

  const handleShare = (item) => {
    const fullItem = getFullProduct(item);
    const url = `${window.location.origin}${getItemURL(fullItem)}`;
    const shareData = {
      title: fullItem.name,
      text: `Check out ${fullItem.name} on Catalogueya!`,
      url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => alert("Share cancelled."));
    } else {
      navigator.clipboard.writeText(url);
      alert("🔗 Link copied to clipboard!");
    }
  };

  if (!favourites || favourites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
        <FaHeart className="text-red-500 text-5xl mb-3" />
        <h2 className="text-2xl font-semibold mb-2">No Saved Items</h2>
        <p className="text-gray-500">
          Your favourite items will appear here 
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 mt-24 relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-4 sm:-left-6 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full
                   border border-white/50 shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-300"
        title="Go Back"
      >
        <FaArrowLeft className="text-gray-700 text-lg sm:text-xl" />
      </button>


      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favourites.map((item) => {
          const fullItem = getFullProduct(item);

          return (
            <motion.div
              key={fullItem.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Product Image */}
              <div
                className="w-full h-40 overflow-hidden rounded-t-2xl"
                onClick={() => handleNavigate(fullItem)}
              >
                <img
                  src={fullItem.img || fullItem.image}
                  alt={fullItem.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-lg font-semibold text-blue-800 cursor-pointer hover:underline"
                    onClick={() => handleNavigate(fullItem)}
                  >
                    {fullItem.name}
                  </h3>

                  {fullItem.categoryName && (
                    <p
                      className="text-sm text-gray-500 mt-1 cursor-pointer hover:underline"
                      onClick={() => handleCategoryClick(fullItem)}
                    >
                      {fullItem.categoryName}
                    </p>
                  )}

                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {fullItem.description || "No description available"}
                  </p>
                </div>

                {/* Price + Buttons */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-800 font-semibold">
                    QAR {fullItem.price}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(fullItem);
                      }}
                      className="text-gray-500 hover:text-blue-600 transition"
                      title="Share"
                    >
                      <FaShareAlt size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(fullItem);
                      }}
                      className="text-gray-500 hover:text-green-600 transition"
                      title="Open"
                    >
                      <FaExternalLinkAlt size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite(fullItem);
                      }}
                      className="text-gray-500 hover:text-red-600 transition"
                      title="Remove"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
