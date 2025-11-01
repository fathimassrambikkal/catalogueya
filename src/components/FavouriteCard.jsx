import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaWhatsapp, FaStar } from "react-icons/fa";
import { useFavourites } from "../context/FavouriteContext";

export default function FavouriteCard({ product }) {
  const navigate = useNavigate();
  const { toggleFavourite, favourites } = useFavourites();

  const isFavourite = favourites.some((item) => item.id === product.id);
  const whatsappNumber = "97400000000"; 

  return (
    <motion.div
      key={product.id}
      onClick={() => navigate(`/salesproduct/${product.id}`)}
      className="relative rounded-[2.5rem] overflow-hidden group cursor-pointer
                 bg-white/10 border border-white/60 backdrop-blur-2xl 
                 shadow-[0_8px_40px_rgba(255,255,255,0.15)] 
                 hover:shadow-[0_8px_80px_rgba(255,255,255,0.3)] 
                 transition-all duration-700"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Section */}
      <div className="relative w-full rounded-3xl overflow-hidden group h-[220px] xs:h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px] xl:h-[450px]">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-105 border-8 border-white/40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>

        {/* Sale Label */}
        <div className="absolute top-4 left-4 bg-white/80 text-gray-800 px-3 py-1 text-xs rounded-full shadow-sm border border-white/40">
          Sale Offer
        </div>

        {/*  Favourite Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(product);
          }}
          className="absolute top-4 right-4 bg-white/80 border border-white/50 rounded-full p-2 hover:bg-white transition"
        >
          {isFavourite ? (
            <AiFillHeart className="text-red-500 w-5 h-5" />
          ) : (
            <AiOutlineHeart className="text-gray-800 w-5 h-5" />
          )}
        </button>
      </div>

      {/* Floating Info Card */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 w-[88%] 
                   bg-white/30 backdrop-blur-xl border border-white/50 
                   rounded-2xl p-4 flex justify-between items-center 
                   shadow-[0_4px_30px_rgba(255,255,255,0.25)]"
      >
        {/* Product Info */}
        <div className="flex flex-col w-[75%] text-white leading-tight">
          <h3 className="font-semibold text-base md:text-lg truncate">
            {product.name}
          </h3>
          <p className="text-xs text-gray-200">
            {product.companyName || product.company} —{" "}
            {product.categoryName || product.category}
          </p>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-white font-bold text-lg md:text-xl">
              QAR {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-xs line-through text-gray-300">
                QAR {product.oldPrice}
              </span>
            )}
          </div>

          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-500"
                }`}
              />
            ))}
            <span className="text-xs text-gray-200 ml-1">
              ({product.rating?.toFixed(1)})
            </span>
          </div>
        </div>

        {/* WhatsApp Icon */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
            product.name
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 bg-green-500/90 hover:bg-green-600 
                     transition p-3 rounded-2xl shadow-lg"
        >
          <FaWhatsapp className="text-white w-6 h-6" />
        </a>
      </div>
    </motion.div>
  );
}
