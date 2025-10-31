import React, { useState, useRef, useEffect } from "react";
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
              className={`w-full h-[500px] object-cover rounded-xl transition-transform duration-700 ease-out ${
                isZoomed ? "scale-110" : "scale-100"
              }`}
            />
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <FaSearchPlus className="text-white text-5xl" />
            </div>

            {/* ✅ Floating Buttons (Now includes WhatsApp) */}
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

              {/* ✅ WhatsApp Floating Button inside image */}
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

          {/* ✅ Price + WhatsApp Row */}
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

      {/* ====================== Zoom Modal ====================== */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-10 text-white/90 hover:text-white text-4xl z-50"
            >
              <FaTimes />
            </button>

            <motion.div className="relative w-[90%] md:w-1/2 h-[70vh] bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center border border-white/20 shadow-2xl">
              <motion.img
                src={selectedImage}
                alt={product.name}
                style={{ scale }}
                className="max-w-full max-h-full object-contain rounded-xl select-none pointer-events-none transition-transform duration-300 ease-out"
              />
              <motion.div
                drag="y"
                dragConstraints={{ top: -80, bottom: 80 }}
                dragElastic={0.25}
                onDragEnd={() => scale.set(1)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/25 border border-white/40 backdrop-blur-md p-5 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BsArrowsMove className="text-white text-2xl" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================== Similar Products ====================== */}
      {similarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tighter text-gray-900 mb-10 text-center">
            Similar Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center">
            {similarProducts.map((sp) => {
              const isFav = favourites.some((item) => item.id === sp.id);
              return (
                <motion.div
                  key={sp.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setProduct(sp)}
                  className="relative w-full max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                             bg-white/10 border border-white/50 backdrop-blur-2xl 
                             shadow-[0_8px_30px_rgba(255,255,255,0.1)] 
                             hover:shadow-[0_8px_60px_rgba(255,255,255,0.25)] 
                             transition-all duration-700"
                >
                  <div className="relative w-full h-[260px] sm:h-[280px] md:h-[300px] overflow-hidden">
                    <img
                      src={sp.img}
                      alt={sp.name}
                      className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105 border-4 border-white/30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
                  </div>

                  <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[80%]
                               bg-white/30 backdrop-blur-xl border border-white/40 
                               rounded-xl p-3 flex flex-col items-center text-white shadow-lg"
                  >
                    <h3 className="font-semibold text-sm truncate">{sp.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white font-bold text-sm">
                        QAR {sp.price}
                      </span>
                      {sp.oldPrice && (
                        <span className="text-[10px] line-through text-gray-300">
                          QAR {sp.oldPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(sp.rating)
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-200 ml-1">
                        ({sp.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      <Faq />
      <CallToAction />
    </>
  );
}
