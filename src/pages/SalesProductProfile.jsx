import React, { useState, useRef, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaWhatsapp,
  FaArrowLeft,
  FaHeart,
  FaShareAlt,
  FaTimes,
  FaSearchPlus,
} from "react-icons/fa";
import { BsArrowsMove } from "react-icons/bs";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { salesProducts } from "../data/salesData";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { useFavourites } from "../context/FavouriteContext";

export default function SalesProductProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const whatsappNumber = "97400000000";

  const [product, setProduct] = useState(
    salesProducts.find((p) => String(p.id) === String(id))
  );
  const [selectedImage, setSelectedImage] = useState(product?.img);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);
  const scale = useMotionValue(1);

  const { favourites, toggleFavourite } = useFavourites();
  const isFavourite = favourites.some((item) => item.id === product?.id);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.img);
      setIsZoomed(false);
    }
  }, [product]);

  if (!product)
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        Product not found.
      </div>
    );

  const handleCompanyClick = () => {
    if (product?.companyId && product?.categoryId) {
      navigate(`/category/${product.categoryId}/company/${product.companyId}`);
    } else {
      alert("Company information not available.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this sale product: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("🔗 Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const similarProducts = salesProducts
    .filter(
      (sp) =>
        sp.id !== product.id &&
        (sp.categoryId === product.categoryId ||
          sp.companyId === product.companyId)
    )
    .slice(0, 4);

  return (
    <>
      {/* ====================== Product Profile ====================== */}
      <motion.section
        key={product.id}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-7xl mx-auto px-6 py-12 mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-10 
                   bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden rounded-3xl shadow-sm"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-4 left-6 z-30 p-3 bg-white/60 backdrop-blur-md rounded-full 
                     border border-white/70 shadow-md hover:bg-white/80 transition"
        >
          <FaArrowLeft className="text-gray-700 text-lg" />
        </button>

        {/* ====================== Images Column ====================== */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 order-2 md:order-1">
            {[product.img, product.img2, product.img3, product.img4]
              .filter(Boolean)
              .map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name}-${idx}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border transition-all duration-300 ${
                    selectedImage === img
                      ? "border-gray-800 scale-105 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
          </div>

          {/* Main Image */}
          <div
            className="relative flex-1 order-1 md:order-2 overflow-hidden rounded-xl shadow-2xl group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              ref={imgRef}
              src={selectedImage}
              alt={product.name}
              className={`w-full h-[450px] object-cover rounded-xl transition-transform duration-700 ease-out ${
                isZoomed ? "scale-110" : "scale-100"
              }`}
            />
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <FaSearchPlus className="text-white text-5xl" />
            </div>

            {/*  Floating Buttons  */}
            <div className="absolute top-5 right-5 flex flex-col gap-3 z-30">
              {/* Favourite */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavourite(product);
                }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full shadow-md transition backdrop-blur-md border ${
                  isFavourite
                    ? "bg-red-100 text-red-600 border-red-200"
                    : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"
                }`}
              >
                <FaHeart
                  className={`text-lg ${
                    isFavourite ? "text-red-500" : "hover:text-red-400"
                  }`}
                />
              </motion.button>

              {/* Share */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-blue-50 shadow-md backdrop-blur-md border border-white/50"
              >
                <FaShareAlt className="text-lg" />
              </motion.button>

              {/*  WhatsApp Floating Button inside image */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                  product.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md transition"
              >
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* ====================== Details Column ====================== */}
        <div className="flex flex-col justify-start space-y-6">
          <p className="text-gray-500 uppercase text-sm tracking-wide">
            {product.category || "SALE PRODUCT"}
          </p>

          {(product.companyName || product.company) && (
            <div className="flex items-center gap-1.5">
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                by
              </p>
              <button
                onClick={handleCompanyClick}
                className="text-sm sm:text-base font-semibold text-blue-600 hover:underline tracking-tight"
              >
                {product.companyName || product.company}
              </button>
            </div>
          )}

          <h1 className="text-4xl font-semibold text-gray-900 tracking-tighter">
            {product.name}
          </h1>

          {/*  Price + WhatsApp Row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-3">
              {product.oldPrice && (
                <span className="text-gray-400 line-through text-lg">
                  QAR {product.oldPrice}
                </span>
              )}
              <span className="text-2xl font-bold text-green-600">
                QAR {product.price}
              </span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed text-base">
            {product.description ||
              `Don't miss out on our special sale for ${product.name}! Premium quality at a discounted price.`}
          </p>

          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-gray-600">
              ({product.rating?.toFixed(1)})
            </span>
          </div>

          {product.offerEnds && (
            <p className="text-red-600 text-sm font-medium">
              Offer ends on {product.offerEnds}
            </p>
          )}
        </div>
      </motion.section>

      {/* ====================== Similar Products (Sales Style) ====================== */}
      {similarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-10 sm:py-14">
          <h2 className="text-3xl font-semibold tracking-tighter text-gray-900 mb-10 text-center">
            Similar Products
          </h2>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 place-items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {similarProducts.map((sp) => {
              const isFav = favourites.some((item) => item.id === sp.id);
              return (
                <motion.div
                  key={sp.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setProduct(sp)}
                  className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                             bg-white/10 border border-white/30 backdrop-blur-2xl 
                             shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                             hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] 
                             transition-all duration-700"
                >
                  {/* Favourite Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(sp);
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full shadow-md transition backdrop-blur-md border 
                      ${
                        isFav
                          ? "bg-red-100 text-red-600 border-red-200"
                          : "bg-white/80 text-gray-600 border-white/50 hover:bg-red-50"
                      }`}
                  >
                    <FaHeart
                      className={`text-xs sm:text-sm md:text-base ${
                        isFav ? "text-red-500" : "hover:text-red-400"
                      }`}
                    />
                  </motion.button>

                  {/* Product Image */}
                  <div className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] overflow-hidden rounded-t-3xl">
                    <img
                      src={sp.img}
                      alt={sp.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top rounded-t-3xl transition-transform duration-500 group-hover:scale-105 border-b border-white/20"
                    />
                    {/* Bottom-left rating */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(sp.rating)
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-white/90 ml-1">
                        ({sp.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div
                    className="relative w-full rounded-b-3xl p-3 sm:p-4 border-t border-white/20 
                               bg-white/10 backdrop-blur-xl 
                               before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:rounded-b-3xl before:pointer-events-none 
                               shadow-[0_4px_20px_rgba(255,255,255,0.15)] 
                               flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex flex-col w-[80%] z-10">
                      <h3 className="font-semibold text-[11px] xs:text-xs sm:text-sm truncate text-gray-900 mb-1">
                        {sp.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] xs:text-[12px] sm:text-sm font-bold text-gray-900">
                          QAR {sp.price}
                        </span>
                        {sp.oldPrice && (
                          <span className="text-[9px] xs:text-[10px] sm:text-xs line-through text-gray-500">
                            QAR {sp.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp Icon */}
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                        sp.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-green-500/80 rounded-full text-white shadow-md hover:bg-green-600/90 transition z-10"
                      title="Chat on WhatsApp"
                    >
                      <FaWhatsapp className="text-sm sm:text-base md:text-lg" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}
      
      <Faq />
      <CallToAction />
    </>
  );
}
