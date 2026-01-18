import React, { memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StarIcon, HeartIcon, ChatIcon } from "./SvgIcon";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

export const ProductCard = memo(({ 
  product, 
  isFav, 
  onToggleFavourite, 
  onNavigate, 
  onChat, 
  currency,
  showDiscount = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { i18n } = useTranslation();

  const imageUrl = product?.img 
    ? (product.img.startsWith('http') ? product.img : `${API_BASE_URL}/${product.img}`)
    : null;

  // Preload image immediately
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setImageLoaded(true);
    }
  }, [imageUrl]);

  const discountPercentage = product.oldPrice ? 
    Math.round(((parseFloat(product.oldPrice) - parseFloat(product.price)) / parseFloat(product.oldPrice)) * 100) : 
    0;

  const handleHeartClick = (e) => {
    e.stopPropagation();
    onToggleFavourite(product);
  };

  return (
    <div
      className="relative flex-none rounded-2xl overflow-hidden group cursor-pointer
               bg-white/10 border border-white/30 backdrop-blur-2xl 
               shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
               hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
               transition-all duration-700"
      onClick={() => onNavigate(product)}
    >
      {/* TOP RIGHT ACTIONS */}
    <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
  <button
    onClick={handleHeartClick}
    className={`
      p-[clamp(6px,0.8vw,8px)]
      rounded-full
      shadow-md
      transition
      backdrop-blur-md
      border
      ${isFav
        ? "bg-red-100 text-red-600 border-red-200"
        : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"}
    `}
  >
    <HeartIcon
      filled={isFav}
      className={`
        w-[clamp(11px,1.1vw,16px)]
        h-[clamp(11px,1.1vw,16px)]
        ${isFav ? "text-red-500" : "text-gray-600 hover:text-red-400"}
      `}
    />
  </button>


<button
  onClick={(e) => {
    e.stopPropagation();
    onChat(product);
  }}
  title="Chat"
  className="
    relative
    p-[clamp(5px,0.8vw,8px)]
    rounded-full
    bg-white/40
    backdrop-blur-2xl
    border border-[rgba(255,255,255,0.28)]
    shadow-[0_8px_24px_rgba(0,0,0,0.18)]
    hover:bg-white/55
    transition-all
    duration-300 
  "
>
  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/70 via-white/10 to-transparent opacity-40 pointer-events-none" />
  <span className="absolute inset-0 rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)] opacity-35 pointer-events-none" />
  <span className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-20 pointer-events-none" />

  <ChatIcon
    className="
      relative z-10
          w-[clamp(12px,1.1vw,16px)]
        h-[clamp(12px,1.1vw,16px)]
        text-[rgba(18,18,18,0.88)]
        drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]
    "
  />
</button>

      </div>

      {/* DISCOUNT BADGE - Responsive text sizing */}
      {showDiscount && discountPercentage > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[8px] xs:text-[9px] sm:text-[10px] font-bold px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
          -{discountPercentage}%
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative w-full h-[160px] xs:h-[180px] sm:h-[200px] overflow-hidden rounded-t-2xl">
        {imageUrl && imageLoaded ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="eager"
            fetchpriority="high"
            decoding="async"
            className="w-full h-full object-cover object-top rounded-t-2xl border-b border-white/20 
                     transition-transform duration-300 ease-out
                     group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-t-2xl relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        )}

        {/* RATING - Responsive text sizing */}
        <div
  className="
    absolute bottom-2 left-2
    flex items-center
    gap-[clamp(2px,0.4vw,4px)]
    bg-black/40
    backdrop-blur-md
    px-[clamp(6px,0.8vw,8px)]
    py-[clamp(3px,0.5vw,5px)]
    rounded-lg
  "
>
  {Array.from({ length: 5 }).map((_, i) => (
    <StarIcon
      key={i}
      filled={i < Math.floor(product.rating ?? 0)}
      className={`
        w-[clamp(7px,0.9vw,10px)]
        h-[clamp(7px,0.9vw,10px)]
        ${i < Math.floor(product.rating ?? 0) ? "text-white" : "text-white/40"}
      `}
    />
  ))}

  <span
    className="
      ml-[clamp(2px,0.4vw,4px)]
      text-[clamp(8px,1vw,11px)]
      text-white/90
      leading-none
    "
  >
    {(product.rating ?? 0).toFixed(1)}
  </span>
</div>

      </div>

      {/* BOTTOM CONTENT - Only product description changes for 350px */}
      <div
        className="relative w-full rounded-b-2xl p-3 border-t border-white/20 
                   bg-white/70 backdrop-blur-xl
                   shadow-[0_4px_20px_rgba(255,255,255,0.15)] 
                   flex items-center justify-between overflow-hidden"
      >
        <div className="flex flex-col w-[99%] z-10">
          {/* Product Name - Fixed for 350px screens */}
          <h3 className="font-semibold text-gray-900 mb-1 truncate
                         text-[11px] xs:text-[10px] sm:text-[14px] md:text-xs">
            {product.name}
          </h3>
          
          {/* Price Section - Fixed for 350px screens */}
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900
                            text-[10px] xs:text-[10px] sm:text-[11px] md:text-xs">
              {i18n.language === "ar" ? `${currency} ${product.price}` : `${product.price} ${currency}`}
            </span>
            {product.oldPrice && (
              <span className="line-through text-gray-500
                              text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px]">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});