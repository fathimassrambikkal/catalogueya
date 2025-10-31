import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaStar, FaShareAlt, FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useFavourites } from "../context/FavouriteContext";
import { salesProducts } from "../data/salesData";
import CallToAction from "../components/CallToAction";

export default function SalesProductPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Relevance");
  const { favourites, toggleFavourite } = useFavourites();
  const whatsappNumber = "97400000000";

  // ✅ Sort logic
  const sortedProducts = [...salesProducts].sort((a, b) => {
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

  const container = useMemo(
    () => ({
      hidden: {},
      visible: { transition: { staggerChildren: 0.1 } },
    }),
    []
  );

  const cardVariant = useMemo(
    () => ({
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    }),
    []
  );

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
      <section className="relative min-h-screen pt-28 px-4 sm:px-8 md:px-12 lg:px-16 pb-24 bg-gray-50">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-40 left-6 md:left-12 z-20 group"
        >
          <div className="relative p-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 shadow-md transition-all duration-300 hover:scale-110">
            <FaArrowLeft className="relative text-gray-800 text-lg group-hover:text-gray-900 transition-colors" />
          </div>
        </button>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-16 text-center">
          Sales Products
        </h1>

        {/* Sort Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-gray-600">
          <p className="text-sm sm:text-base md:text-lg">
            {sortedProducts.length} Products Found
          </p>
          <div className="flex items-center gap-3 text-sm sm:text-base">
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

        {/* Product Grid — Same layout as Sales.jsx */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 place-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={container}
        >
          {sortedProducts.map((product) => {
            const isFav = favourites.some((item) => item.id === product.id);

            return (
              <motion.div
                key={product.id}
                variants={cardVariant}
                className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                  bg-white/10 border border-white/50 backdrop-blur-2xl 
                  shadow-[0_8px_30px_rgba(255,255,255,0.1)] 
                  hover:shadow-[0_8px_60px_rgba(255,255,255,0.25)] 
                  transition-all duration-700"
                onClick={() => navigate(`/salesproduct/${product.id}`)}
              >
                {/* Favourite Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite({
                      ...product,
                      type: "sales",
                    });
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-2 right-2 sm:top-3 sm:right-4 z-20 p-1.5 sm:p-2.5 rounded-full shadow-md transition backdrop-blur-md border 
                    ${
                      isFav
                        ? "bg-red-100 text-red-600 border-red-200"
                        : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"
                    }`}
                >
                  {isFav ? (
                    <AiFillHeart className="text-xs sm:text-sm md:text-base text-red-500" />
                  ) : (
                    <AiOutlineHeart className="text-xs sm:text-sm md:text-base hover:text-red-400" />
                  )}
                </motion.button>

                {/* Image */}
                <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[260px] md:h-[300px] rounded-3xl overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover object-top rounded-3xl transition-transform duration-500 group-hover:scale-105 border-2 sm:border-4 border-white/30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
                </div>

                {/* Info Section */}
                <div
                  className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 w-[88%]
                             bg-white/30 backdrop-blur-xl border border-white/40 
                             rounded-xl p-2 sm:p-3 flex flex-col items-center text-white shadow-lg"
                >
                  <h3 className="font-semibold text-[10px] xs:text-xs sm:text-sm md:text-base truncate text-center mb-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between w-full mt-1">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-[10px] xs:text-[11px] sm:text-sm font-bold text-white">
                          QAR {product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-[8px] xs:text-[9px] sm:text-[10px] line-through text-gray-300">
                            QAR {product.oldPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center mt-0.5 sm:mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-2 h-2 xs:w-2.5 sm:w-3 xs:h-2.5 sm:h-3 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        ))}
                        <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-200 ml-1">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                        product.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 bg-green-500 rounded-full text-white shadow-md hover:bg-green-600 transition ml-2 sm:ml-3"
                      title="Chat on WhatsApp"
                    >
                      <FaWhatsapp className="text-xs sm:text-sm md:text-lg" />
                    </a>
                  </div>
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
