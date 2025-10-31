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

export default function Favourite() {
  const { favourites, toggleFavourite } = useFavourites();
  const navigate = useNavigate();

  // 🧭 Handles navigation based on item type
  const handleNavigate = (item) => {
    if (item.type === "sales") {
      navigate(`/salesproduct/${item.id}`);
    } else if (item.type === "newarrival") {
      navigate(`/newarrivalproduct/${item.id}`);
    } else {
      navigate(`/product/${item.id}`); // fallback
    }
  };

  // 📤 Handles sharing link
  const handleShare = (item) => {
    const baseUrl =
      item.type === "sales"
        ? `/salesproduct/${item.id}`
        : item.type === "newarrival"
        ? `/newarrivalproduct/${item.id}`
        : `/product/${item.id}`;

    const shareData = {
      title: item.name,
      text: `Check out this product: ${item.name}`,
      url: window.location.origin + baseUrl,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  // ❤️ Empty state
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

  // 💾 Favourite cards
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 mt-24">
      <div className="flex items-center gap-3 border-b pb-4 mb-10">
        <FaHeart className="text-red-500 text-3xl" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Saved Items
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {favourites.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col md:flex-row bg-white border border-gray-200 rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Info */}
            <div className="flex-1 flex flex-col justify-between p-6">
              <div>
                <h3
                  className="text-xl font-semibold text-blue-800 cursor-pointer hover:underline"
                  onClick={() => handleNavigate(item)}
                >
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-3">
                  {item.description || "No description available"}
                </p>
              </div>

              <div className="flex items-center gap-6 mt-5">
                <button
                  onClick={() => handleShare(item)}
                  className="text-gray-500 hover:text-blue-600 transition"
                  title="Share"
                >
                  <FaShareAlt size={20} />
                </button>

                <button
                  onClick={() => handleNavigate(item)}
                  className="text-gray-500 hover:text-green-600 transition"
                  title="Open"
                >
                  <FaExternalLinkAlt size={20} />
                </button>

                <button
                  onClick={() => toggleFavourite(item)}
                  className="text-gray-500 hover:text-red-600 transition"
                  title="Remove"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>

            {/* Image */}
            <div
              className="w-full md:w-1/2 cursor-pointer overflow-hidden"
              onClick={() => handleNavigate(item)}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-56 md:h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
