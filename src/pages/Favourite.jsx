import React from "react";
import {
  FaTrashAlt,
  FaShareAlt,
  FaExternalLinkAlt,
  FaHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useFavourites } from "../context/FavouriteContext";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categoriesData";

export default function Favourite() {
  const { favourites, toggleFavourite } = useFavourites();
  const navigate = useNavigate();

  // Helper to complete product info
  const getFullProduct = (item) => {
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
  };

  // Navigate to correct product page
  const handleNavigate = (item) => {
    const fullItem = getFullProduct(item);
    const type = fullItem.type?.toLowerCase();

    if (type === "sales" || type === "sale" || type === "salesproduct") {
      navigate(`/salesproduct/${fullItem.id}`);
      return;
    }

    if (type === "newarrival" || type === "newarrivalproduct") {
      navigate(`/newarrivalprofile/${fullItem.id}`);
      return;
    }

    if (fullItem.categoryId && fullItem.companyId && fullItem.id) {
      navigate(
        `/category/${encodeURIComponent(fullItem.categoryId)}/company/${encodeURIComponent(
          fullItem.companyId
        )}/product/${encodeURIComponent(fullItem.id)}`
      );
      return;
    }

    console.warn("⚠️ Missing product details, cannot navigate:", fullItem);
    alert(
      "This saved item is missing category or company details and cannot be opened."
    );
  };

  const handleCategoryClick = (item) => {
    const fullItem = getFullProduct(item);
    if (fullItem.categoryId && fullItem.companyId && fullItem.id) {
      navigate(
        `/category/${encodeURIComponent(fullItem.categoryId)}/company/${encodeURIComponent(
          fullItem.companyId
        )}/product/${encodeURIComponent(fullItem.id)}`
      );
    } else {
      console.warn("⚠️ Missing category/company info:", fullItem);
    }
  };

  const handleShare = (item) => {
    const fullItem = getFullProduct(item);
    let url;

    if (
      fullItem.type === "sales" ||
      fullItem.type === "sale" ||
      fullItem.type === "salesproduct"
    ) {
      url = `${window.location.origin}/salesproduct/${fullItem.id}`;
    } else if (
      fullItem.type === "newarrival" ||
      fullItem.type === "newarrivalproduct"
    ) {
      url = `${window.location.origin}/newarrivalprofile/${fullItem.id}`;
    } else if (fullItem.categoryId && fullItem.companyId) {
      url = `${window.location.origin}/category/${fullItem.categoryId}/company/${fullItem.companyId}/product/${fullItem.id}`;
    } else {
      url = window.location.origin;
    }

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
          Your favourite items will appear here ❤️
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 mt-24">
      <div className="flex items-center gap-3 border-b pb-4 mb-10">
        <FaHeart className="text-red-500 text-3xl" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Saved Items
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {favourites.map((item) => {
          const fullItem = getFullProduct(item);

          return (
            <motion.div
              key={fullItem.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col md:flex-row bg-white border border-gray-200 rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <h3
                    className="text-xl font-semibold text-blue-800 cursor-pointer hover:underline"
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

                  <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                    {fullItem.description || "No description available"}
                  </p>
                </div>

                <div className="flex items-center gap-6 mt-5">
                  <button
                    onClick={() => handleShare(fullItem)}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="Share"
                  >
                    <FaShareAlt size={20} />
                  </button>

                  <button
                    onClick={() => handleNavigate(fullItem)}
                    className="text-gray-500 hover:text-green-600 transition"
                    title="Open"
                  >
                    <FaExternalLinkAlt size={20} />
                  </button>

                  <button
                    onClick={() => toggleFavourite(fullItem)}
                    className="text-gray-500 hover:text-red-600 transition"
                    title="Remove"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </div>

              <div
                className="w-full md:w-1/2 cursor-pointer overflow-hidden"
                onClick={() => handleNavigate(fullItem)}
              >
                <img
                  src={fullItem.img || fullItem.image}
                  alt={fullItem.name}
                  className="w-full h-56 md:h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
