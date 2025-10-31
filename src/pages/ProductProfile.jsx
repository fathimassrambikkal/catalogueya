import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaWhatsapp,
  FaArrowLeft,
  FaSearchPlus,
  FaTimes,
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";
import { BsArrowsMove } from "react-icons/bs";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { categories } from "../data/categoriesData";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { useFavourites } from "../context/FavouriteContext";

export default function ProductPage() {
  const params = useParams();
  const navigate = useNavigate();
  const whatsappNumber = "97400000000";
  const { favourites, toggleFavourite } = useFavourites();

  // ✅ Get correct product id
  const productId = params.id || params.productId || params.pid;

  // ✅ Find product from categories
  const product = categories
    .flatMap((cat) =>
      cat.companies.flatMap((comp) =>
        (comp.products || []).map((p) => ({
          ...p,
          categoryId: cat.id,
          categoryName: cat.title,
          companyId: comp.id,
          companyName: comp.name,
          image: p.image || p.img, // 🧩 FIXED: support both "image" and "img"
        }))
      )
    )
    .find((p) => String(p.id) === String(productId));

  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [showModal, setShowModal] = useState(false);
  const y = useMotionValue(0);
  const scale = useTransform(y, [-200, 0, 200], [1.2, 1, 1.2]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setShowModal(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId]);

  if (!product)
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        Product not found.
      </div>
    );

  const isFavourite = favourites.some((fav) => fav.id === product.id);

  const handleShare = (p) => {
    const shareData = {
      title: p.name,
      text: `Check out ${p.name} from ${p.companyName} on Catalogueya!`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => alert("Share cancelled."));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("🔗 Link copied to clipboard!");
    }
  };

  // ✅ Similar product logic
  const allProducts = categories.flatMap((cat) =>
    cat.companies.flatMap((comp) =>
      (comp.products || []).map((p) => ({
        ...p,
        categoryId: cat.id,
        companyId: comp.id,
        category: cat.title,
        image: p.image || p.img,
      }))
    )
  );

  const similarProducts = allProducts
    .filter(
      (sp) =>
        sp.id !== product.id &&
        (sp.categoryId === product.categoryId ||
          sp.companyId === product.companyId)
    )
    .slice(0, 4);

  return (
    <>
      {/* ===== Product Section ===== */}
      <motion.section
        key={productId}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-7xl mx-auto px-6 py-12 mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-10 
                   bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden rounded-3xl shadow-sm"
      >
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-4 left-6 z-30 p-3 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition"
        >
          <FaArrowLeft className="text-gray-700 text-lg" />
        </button>

        {/* ===== Left Section ===== */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 order-2 md:order-1">
            {[product.image, product.image2, product.image3, product.image4]
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
          <div className="relative flex-1 order-1 md:order-2 overflow-hidden rounded-xl shadow-2xl group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            <button
              onClick={() => setShowModal(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300"
            >
              <FaSearchPlus className="text-white opacity-0 group-hover:opacity-100 text-3xl transition-opacity duration-300" />
            </button>

            {/* Action Buttons */}
            <div className="absolute top-5 right-5 flex flex-col gap-3 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavourite(product);
                }}
                className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-md hover:bg-white transition"
              >
                <FaHeart
                  className={`text-xl transition-all ${
                    isFavourite ? "text-red-500 scale-110" : "text-gray-400"
                  }`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(product);
                }}
                className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-md hover:bg-white transition"
              >
                <FaShareAlt className="text-gray-600 text-xl" />
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                  product.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md transition"
              >
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* ===== Right Section ===== */}
        <div className="flex flex-col justify-start space-y-6">
          <p className="text-gray-500 uppercase text-sm tracking-wide">
            {product.categoryName || "PRODUCT"}
          </p>

          <h1 className="text-4xl font-semibold text-gray-900 tracking-tighter">
            {product.name}
          </h1>

          {product.companyName && (
            <button
              onClick={() =>
                navigate(
                  `/category/${product.categoryId}/company/${product.companyId}`
                )
              }
              className="text-base text-blue-600 font-medium hover:underline w-fit"
            >
              <span className="text-gray-500">by </span>
              <span className="font-semibold">{product.companyName}</span>
            </button>
          )}

          <div className="flex items-baseline gap-3 mt-2">
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-lg">
                QAR {product.oldPrice}
              </span>
            )}
            <span className="text-2xl font-bold text-green-600">
              QAR {product.price}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed text-base">
            {product.description ||
              `Introducing our ${product.name} – designed for superior quality and style.`}
          </p>

          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating ?? 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-gray-600">
              ({(product.rating ?? 0).toFixed(1)})
            </span>
          </div>
        </div>
      </motion.section>

      {/* Modal */}
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

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tighter text-gray-900 mb-10 text-center">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center">
            {similarProducts.map((sp) => {
              const isFav = favourites.some((f) => f.id === sp.id);
              return (
                <motion.div
                  key={sp.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/category/${sp.categoryId}/company/${sp.companyId}/product/${sp.id}`)}
                  className="relative w-full max-w-[300px] rounded-3xl overflow-hidden group cursor-pointer
                             bg-white/10 border border-white/50 backdrop-blur-2xl 
                             shadow-[0_8px_30px_rgba(255,255,255,0.1)] 
                             hover:shadow-[0_8px_60px_rgba(255,255,255,0.25)] 
                             transition-all duration-700"
                >
                  <div className="relative w-full h-[260px] sm:h-[280px] md:h-[300px] overflow-hidden">
                    <img
                      src={sp.image}
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
                            i < Math.floor(sp.rating ?? 0)
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-200 ml-1">
                        ({(sp.rating ?? 0).toFixed(1)})
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
