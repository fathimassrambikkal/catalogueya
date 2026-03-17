import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HeartIcon, StarIcon ,WhatsappIcon, ServiceIcon } from "./SvgIcon";
import { useFixedWords } from "../hooks/useFixedWords";
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
  const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

  const handleHeartClick = (e) => {
    e.stopPropagation();
    onToggleFavourite(product);
  };


  const navigate = useNavigate();
const badgeStyles = {
  best_seller:
    "bg-black text-white",

  limited_edition:
    "bg-gray-900 text-white",

  low_in_stock:
    "bg-amber-50 text-amber-700 border border-amber-200",

  new_arrivals:
    "bg-blue-50 text-blue-600 border border-blue-200",

  on_sales:
    "bg-rose-50 text-rose-600 border border-rose-200",

  limited_stock:
    "bg-orange-50 text-orange-600 border border-orange-200",

  out_of_stock:
    "bg-gray-100 text-gray-500 border border-gray-200"
};

  return (
    <div
      onClick={() => onNavigate(product)}
      className="
        relative
        flex flex-col         
        w-full max-w-[320px]
       
        h-[220px] xs:h-[240px] sm:h-[260px] md:h-[280px]

        rounded-[20px]
        overflow-hidden
        group
        cursor-pointer
     
      
       bg-white
border border-gray-100
shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_14px_rgba(0,0,0,0.05)]

      "
    >
      {/* TOP RIGHT ACTIONS */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
        <button
          onClick={handleHeartClick}
          className={`
            p-[clamp(6px,0.8vw,8px)]
            rounded-full  border 
            flex items-center justify-center
           
            backdrop-blur-sm
            transition-all duration-150
            shadow-[0_1px_6px_rgba(0,0,0,0.10)]
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
      </div>

      {/* IMAGE SLOT (UNCHANGED) */}
      <div className="relative w-full 
 h-[148px] xs:h-[166px] sm:h-[186px] md:h-[206px] overflow-hidden rounded-t-2xl">
        
        
{product.highlight && (
  <div
    className={`
        absolute top-3 left-3 z-20
      px-[clamp(8px,0.9vw,12px)]
py-[clamp(3px,0.4vw,5px)]
text-[clamp(9px,0.9vw,11px)]
      rounded-full
      
      font-medium
      tracking-[0.03em]
      
     
      ${badgeStyles[product.highlight] || "bg-white/80 backdrop-blur-md text-gray-700 border border-white/70"}
    `}
  >
    {fw[product.highlight] || product.highlight.replace("_", " ")}
  </div>
)}
{product.type === "service" && (
<div
  className="
    absolute bottom-3 left-3 z-20
    flex items-center gap-2
    px-3 py-1.5
    rounded-md
    text-[10px] font-medium uppercase tracking-wider
    bg-transparent
    text-white
    border border-white/30
    backdrop-blur-3xl
    shadow-[0_2px_4px_rgba(0,0,0,0.1)]
  "
>
  <ServiceIcon className="w-3 h-3 text-white/90" />
  <span>{fw.service || "Service"}</span>
</div>
)}
       
        
        {imageSlot}

    
      </div>

      {/* BOTTOM CONTENT (FIXED HEIGHT, SAME LOOK) */}
      <div
        className="
          flex items-center justify-between
          gap-[clamp(6px,1vw,14px)]
          w-full
          px-[clamp(10px,1.6vw,18px)]
          py-[clamp(12px,1.8vw,18px)]
          min-h-[72px] sm:min-h-[80px]
          border-t border-white/20
          bg-white
          backdrop-blur-xl 
        "
      >
    {/* PRODUCT NAME + PRICE */}
    <div className="flex flex-col min-w-0 flex-1 pr-2">
      <h3
        className="
         
         
          text-[clamp(11.5px,1.35vw,14px)]
          


      
            whitespace-nowrap overflow-hidden text-ellipsis


            font-normal text-gray-900
            truncate leading-[1.3] tracking-[-0.01em]

        "
      >
        {product.name}
      </h3>

{/* RATING */}
{product.rating !== undefined && (
  <div className="flex items-center gap-[4px] mt-[4px]">
    <StarIcon
      filled={true}
      className="w-[11px] h-[11px] text-gray-900"
    />

    <span className="text-[10.5px] text-gray-600 font-medium leading-none">
      {Number(product.rating).toFixed(1)}
    </span>
  </div>
)}
{priceSlot ? (
  <div
    className="
      mt-[clamp(4px,0.5vw,6px)]
      whitespace-nowrap
      flex-shrink-0
      leading-[1.2]
    "
  >
    {priceSlot}
  </div>
) : (
  <div
    className="
      mt-[clamp(4px,0.5vw,6px)]
      whitespace-nowrap
      flex-shrink-0
      leading-[1.2]
    "
  >
    <span
      className="
        font-semibold
        text-gray-900
        tracking-tight
        text-[clamp(11.5px,1.2vw,13px)]
      "
    >
      {i18n.language === "ar"
        ? `${currency} ${product.price}`
        : `${product.price} ${currency}`}
    </span>
  </div>
)}


    </div>


{(product?.whatsapp || product?.watsapp) && (
  <button
    onClick={(e) => {
      e.stopPropagation();

      let phone = product.whatsapp || product.watsapp;
      if (!phone) return;

      // If full URL
      if (phone.startsWith("http")) {
        window.open(phone, "_blank");
        return;
      }

      // If normal number like +974 31098634
      const cleanNumber = phone.replace(/\D/g, "");
      if (cleanNumber) {
        window.open(`https://wa.me/${cleanNumber}`, "_blank");
      }
    }}
    aria-label="WhatsApp"
    title="WhatsApp"
    className="


      relative
      flex-shrink-0
      
      p-[clamp(6px,0.8vw,9px)]
    
      backdrop-blur-2xl
    
     
      hover:scale-105



       
          
              flex items-center justify-center
              rounded-full border
              transition-all duration-150
              active:scale-90
              bg-[#25D366]/10 border-[#25D366]/25 text-[#25D366]
              hover:bg-[#25D366]/18 hover:border-[#25D366]/40
              shadow-[0_1px_4px_rgba(37,211,102,0.12)]
    "
  >
  <WhatsappIcon className="w-[clamp(12px,3.5vw,18px)] h-[clamp(12px,3.5vw,18px)] relative z-10" />

  </button>
)}



      </div>
    </div>
  );
});
