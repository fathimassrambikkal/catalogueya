import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HeartIcon, ChatIcon, StarIcon ,WhatsappIcon} from "./SvgIcon";
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
    "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-[0_6px_16px_rgba(79,70,229,0.25)]",

  limited_edition:
    "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-[0_6px_16px_rgba(147,51,234,0.25)]",

  low_in_stock:
    "bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-[0_6px_16px_rgba(245,158,11,0.25)]",

  out_of_stock:
    "bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-sm",

  new_arrivals:
    "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-[0_6px_16px_rgba(59,130,246,0.25)]",

  on_sales:
    "bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-[0_6px_16px_rgba(244,63,94,0.25)]",

  limited_stock:
    "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-[0_6px_16px_rgba(249,115,22,0.25)]"
};

  return (
    <div
      onClick={() => onNavigate(product)}
      className="
        relative
        flex flex-col         
        w-full max-w-[300px]
        h-[200px] xs:h-[220px] sm:h-[260px]   
        rounded-2xl
        overflow-hidden
        group
        cursor-pointer
        bg-white/10
        border border-white/30
        backdrop-blur-2xl
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
      "
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
      </div>

      {/* IMAGE SLOT (UNCHANGED) */}
      <div className="relative w-full h-[190px] xs:h-[210px] sm:h-[250px] overflow-hidden rounded-t-2xl">
        
        
{product.highlight && (
  <div
    className={`
      absolute top-3 left-3 z-20
      px-3 py-[4px]
      rounded-full
      text-[11px] font-semibold tracking-wide
      ${badgeStyles[product.highlight] || "bg-white/75 backdrop-blur-xl text-gray-700 border border-white/70"}
    `}
  >
    {fw[product.highlight] || product.highlight.replace("_", " ")}
  </div>
)}
        
        
        {imageSlot}

        {/* {product.rating !== undefined && (
          <div
  className="
    absolute
    bottom-[clamp(8px,1vw,12px)]
    left-[clamp(8px,1vw,12px)]
    flex items-center
    gap-[clamp(3px,0.5vw,6px)]
    bg-black/40
    backdrop-blur-md
    px-[clamp(6px,0.9vw,10px)]
    py-[clamp(3px,0.6vw,6px)]
    rounded-[clamp(6px,0.8vw,10px)]
    z-20
  "
>
  {Array.from({ length: 5 }).map((_, i) => (
    <StarIcon
      key={i}
      filled={i < Math.round(product.rating)}
      className="
        w-[clamp(9px,1vw,13px)]
        h-[clamp(9px,1vw,13px)]
        text-white/90
      "
    />
  ))}

  <span
    className="
      ml-[clamp(2px,0.4vw,4px)]
      text-[clamp(9px,1vw,12px)]
      text-white/90
      leading-none
    "
  >
    {Number(product.rating).toFixed(1)}
  </span>
</div>

        )} */}
      </div>

      {/* BOTTOM CONTENT (FIXED HEIGHT, SAME LOOK) */}
      <div
        className="
          flex items-center justify-between
          gap-[clamp(6px,1vw,14px)]
          w-full
          px-[clamp(10px,1.6vw,18px)]
          py-[clamp(8px,1.2vw,14px)]
          h-[72px] sm:h-[80px]      /* ✅ FIXED INFO HEIGHT */
          border-t border-white/20
          bg-white/75
          backdrop-blur-xl
        "
      >
    {/* PRODUCT NAME + PRICE */}
    <div className="flex flex-col min-w-0 flex-1">
      <h3
        className="
          font-medium
          text-gray-900
          truncate
          tracking-[-0.01em]
          text-[clamp(10.5px,1.2vw,12.5px)]
          leading-[1.25]
        "
      >
        {product.name}
      </h3>

{/* RATING */}
{product.rating !== undefined && (
  <div className="flex items-center gap-[4px] mt-[2px]">
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
      mt-[clamp(2px,0.4vw,4px)]
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
      mt-[clamp(2px,0.4vw,4px)]
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
        text-[clamp(10px,1vw,11px)]
      "
    >
      {i18n.language === "ar"
        ? `${currency} ${product.price}`
        : `${product.price} ${currency}`}
    </span>
  </div>
)}


    </div>

    {/* CHAT ICON */}
{/* <button
  // onClick={(e) => {
  //   e.stopPropagation();
  //   onChat(product);
  // }}
  aria-label="Chat"
  title="Chat"
  className="
    relative
    flex-shrink-0
    flex items-center justify-center

    p-[clamp(6px,0.8vw,9px)]
    rounded-full

    bg-white/40
    backdrop-blur-2xl
    border border-[rgba(255,255,255,0.28)]
    shadow-[0_8px_24px_rgba(0,0,0,0.18)]

    hover:bg-white/55
    transition-all duration-300

    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-black/20
  "
>
  {/* Chrome liquid highlight */}
  {/* <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/70 via-white/10 to-transparent opacity-40 pointer-events-none" />

  {/* Glass ribbon streak */}
  {/* <span className="absolute inset-0 rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0)_45%)] opacity-35 pointer-events-none" /> */}

  {/* Titanium depth */}
  {/* <span className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-20 pointer-events-none" />  */}

  {/* <ChatIcon
    className="
      relative z-10
      w-[clamp(12px,1.1vw,16px)]
      h-[clamp(12px,1.1vw,16px)]
      text-[rgba(18,18,18,0.88)]
      drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]
    "
  /> */}

  {/* <WhatsappIcon
  size={16}
  className="relative z-10"
/>
</button> */}
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
      flex items-center justify-center
      p-[clamp(6px,0.8vw,9px)]
      rounded-full
      bg-white/40
      backdrop-blur-2xl
      border border-[rgba(255,255,255,0.28)]
      shadow-[0_8px_24px_rgba(0,0,0,0.18)]

      hover:bg-white/55
      transition-all duration-300
      hover:scale-105
    "
  >
  <WhatsappIcon className="w-[clamp(12px,3.5vw,18px)] h-[clamp(12px,3.5vw,18px)] relative z-10" />

  </button>
)}



      </div>
    </div>
  );
});
