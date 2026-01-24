// src/components/SimilarProducts.jsx
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useFixedWords } from "../hooks/useFixedWords";
import SmartImage from "./SmartImage"; // ✅ Import SmartImage

const HeartIcon = ({ filled, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SimilarProducts = memo(function SimilarProducts({
  products,
  favourites,
  toggleFavourite,
}) {
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  if (!products?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-light text-gray-900 mb-12">
        {fw.similar_products}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((sp) => {
          const isFav = favourites.some((f) => f.id === sp.id);

          return (
            <Link
              key={sp.id}
              to={`/newarrivalprofile/${sp.id}`}
              className="
                relative w-full max-w-[280px] sm:max-w-[300px]
    rounded-3xl overflow-hidden group cursor-pointer
    bg-white/10 border border-white/30 backdrop-blur-2xl
    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
    hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]
    transition-all duration-700
              "
            >
              {/* Favourite */}
              <button
                type="button"
                aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavourite(sp);
                }}
                className={`
                  
                   h-[clamp(28px,3.2vw,36px)]
    w-[clamp(28px,3.2vw,36px)] 
                  
                  bg-white/80 border border-white/60
              
                  hover:scale-110 active:scale-95
                   absolute top-2 right-2 sm:top-3 sm:right-3 z-20
    flex items-center justify-center
    p-[clamp(6px,0.8vw,9px)]
     rounded-full
    shadow-md transition backdrop-blur-md
     ${isFav
        ? "bg-red-100 text-red-600 border-red-200"
        : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"}
    `}
              >
                <HeartIcon filled={isFav} className={`
        w-[clamp(11px,1.1vw,16px)]
        h-[clamp(11px,1.1vw,16px)]
        ${isFav ? "text-red-500" : "text-gray-600 hover:text-red-400"}
      `} />
              </button>

              {/* ✅ Image with SmartImage */}
              <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden rounded-t-3xl">
                <SmartImage
                  image={sp.image}
                  alt={sp.name}
                  className="
                     w-full h-full object-cover 
      transition-transform duration-500
      group-hover:scale-105
      border-b border-white/20
                  "
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    console.error("Failed to load similar product image:", sp.image);
                    e.target.src = "/api/placeholder/400/400";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate
                         text-[11px] xs:text-[10px] sm:text-[14px] md:text-xs">
                  {sp.name}
                </h3>
                <span className="font-bold text-gray-900
                            text-[10px] xs:text-[10px] sm:text-[11px] md:text-xs">
                  {fw.qar} {sp.price}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
});

export default SimilarProducts;