import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { HeartIcon, ChatIcon } from "./SvgIcon";

export const ProductCard = memo(({
  product,
  imageSlot,         
  isFav,
  onToggleFavourite,
  onNavigate,
  onChat,
  priceSlot,
  currency,
}) => {
  const { i18n } = useTranslation();

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
            rounded-full shadow-md transition backdrop-blur-md border
            ${isFav
              ? "bg-red-100 text-red-600 border-red-200"
              : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"}
          `}
        >
          <HeartIcon
            filled={isFav}
            className="w-[clamp(11px,1.1vw,16px)] h-[clamp(11px,1.1vw,16px)]"
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onChat(product);
          }}
          className="p-[clamp(5px,0.8vw,8px)] rounded-full bg-white/40 backdrop-blur-2xl border shadow"
        >
          <ChatIcon className="w-[clamp(12px,1.1vw,16px)] h-[clamp(12px,1.1vw,16px)]" />
        </button>
      </div>

      {/* IMAGE SLOT (rendered by NewArrivals) */}
      <div className="relative w-full h-[160px] xs:h-[180px] sm:h-[200px] overflow-hidden rounded-t-2xl">
        {imageSlot}
      </div>

      {/* BOTTOM CONTENT */}
    <div className="w-full rounded-b-2xl p-3 border-t border-white/20 
                bg-white/70 backdrop-blur-xl flex flex-col">
  <h3 className="font-semibold text-gray-900 truncate
                 text-[11px] sm:text-[14px]">
    {product.name}
  </h3>

  {priceSlot ? (
    priceSlot
  ) : (
    <span className="font-bold text-gray-900   text-[11px] sm:text-[14px] md:text-xs mt-1">
      {i18n.language === "ar"
        ? `${currency} ${product.price}`
        : `${product.price} ${currency}`}
    </span>
  )}
</div>

    </div>
  );
});
