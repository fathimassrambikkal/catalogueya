import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaShareAlt, FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useFavourites } from "../context/FavouriteContext";
import { newArrivalProducts } from "../data/newArrivalData";
import CallToAction from "../components/CallToAction";

export default function NewArrivalProductPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Relevance");
  const { favourites, toggleFavourite } = useFavourites();
  const whatsappNumber = "97400000000";

  // ✅ Sorting logic
  const sortedProducts = [...newArrivalProducts].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      case "Rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // ✅ Share button logic
  const handleShare = (product, e) => {
    e.stopPropagation();
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Catalogueya!`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => alert("Share cancelled."));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <section className="relative min-h-screen pt-28 px-6 md:px-12 lg:px-16 pb-24 overflow-hidden bg-gray-50">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-40 left-6 md:left-12 z-20 group"
        >
          <div className="relative p-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.1)] 
            transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_35px_rgba(0,0,0,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-full opacity-70"></div>
            <FaArrowLeft className="relative text-gray-800 text-lg group-hover:text-gray-900 transition-colors" />
          </div>
        </button>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-light tracking-tighter text-gray-900 mb-16 text-center relative z-10">
          All New Arrivals
        </h1>

        {/* Sort Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10 text-gray-600">
          <p>{sortedProducts.length} Products Found</p>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2 focus:outline-none text-gray-700"
            >
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid (Glassmorphic cards) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10"

        >
          {sortedProducts.map((product) => {
            const isFavourite = favourites.some((item) => item.id === product.id);

            return (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/newarrivalprofile/${product.id}`)}
                className="
                  relative w-full max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                  bg-white/10 border border-white/50 backdrop-blur-2xl 
                  shadow-[0_8px_30px_rgba(255,255,255,0.1)] 
                  hover:shadow-[0_8px_60px_rgba(255,255,255,0.25)] 
                  transition-all duration-700 mx-auto
                "
              >
                {/* Product Image */}
                <div className="relative w-full h-[280px] sm:h-[300px] rounded-3xl overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105 border-4 border-white/30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>

                  {/* New Label */}
                  <div className="absolute top-3 left-3 bg-white/80 text-gray-800 px-2 py-0.5 text-[10px] rounded-full border border-white/40">
                    NEW
                  </div>

                  {/* Icons (Share + Favourite) */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={(e) => handleShare(product, e)}
                      className="bg-white/80 border border-white/40 rounded-full p-1.5 hover:bg-white transition"
                    >
                      <FaShareAlt className="text-gray-800 w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite(product);
                      }}
                      className="bg-white/80 border border-white/40 rounded-full p-1.5 hover:bg-white transition"
                    >
                      {isFavourite ? (
                        <AiFillHeart className="text-red-500 w-4 h-4" />
                      ) : (
                        <AiOutlineHeart className="text-gray-800 w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Floating Glass Info Card */}
                <div
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[75%]
                             bg-white/30 backdrop-blur-xl border border-white/40 
                             rounded-xl p-3 flex justify-between items-center 
                             shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                >
                  <div className="flex flex-col w-[70%] text-white leading-tight">
                    <h3 className="font-semibold text-sm truncate">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-200">
                      {product.categoryName || product.category}
                    </p>

                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-white font-bold text-sm">
                        QAR {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-[10px] line-through text-gray-300">
                          QAR {product.oldPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-200 ml-1">
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                      product.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 bg-green-500/90 hover:bg-green-600 
                               transition p-2 rounded-xl shadow-lg"
                  >
                    <FaWhatsapp className="text-white w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <CallToAction />
    </>
  );
}
