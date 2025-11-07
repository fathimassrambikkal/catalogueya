import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaWhatsapp,
  FaArrowLeft,
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "../data/categoriesData";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";
import { useFavourites } from "../context/FavouriteContext";
import { Lens } from "../components/Lens";

export default function ProductProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const whatsappNumber = "97400000000";
  const { favourites, toggleFavourite } = useFavourites();

  const productId = params.id || params.productId || params.pid;

  const product = categories
    .flatMap((cat) =>
      cat.companies.flatMap((comp) =>
        (comp.products || []).map((p) => ({
          ...p,
          categoryId: cat.id,
          categoryName: cat.title,
          companyId: comp.id,
          companyName: comp.name,
          image: p.image || p.img,
        }))
      )
    )
    .find((p) => String(p.id) === String(productId));

  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      window.scrollTo({ top: 0, behavior: "smooth" });
      const storageKey = `reviews_${product.id}`;
      const savedReviews = JSON.parse(localStorage.getItem(storageKey)) || [];
      setReviews(savedReviews);
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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating || 0;

  const handleReviewSubmit = () => {
    if (!reviewName || !reviewText || reviewRating === 0) {
      alert("Please enter your name, rating, and comment.");
      return;
    }

    const storageKey = `reviews_${product.id}`;
    const savedReviews = JSON.parse(localStorage.getItem(storageKey)) || [];

    const newReviewObj = {
      id: Date.now(),
      name: reviewName,
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toLocaleDateString(),
    };

    const updatedReviews = [...savedReviews, newReviewObj];
    localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
    alert(`⭐ ${reviewRating}-star review submitted!`);
    setShowReviewModal(false);
    setReviewText("");
    setReviewRating(0);
    setReviewName("");
  };

  return (
    <>
   
    <button
        onClick={() => navigate(-1)}
        className="absolute top-20 sm:top-8 left-5 sm:left-8 md:top-28 md:left-12 z-30 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/70 shadow-md hover:bg-white/80 transition"
      >
        <FaArrowLeft className="text-gray-700 text-sm sm:text-md md:text-lg" />
      </button>

      {/* Product Section */}
      <motion.section
        key={productId}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 bg-white rounded-3xl shadow-sm"
      >
        {/* Left: Image Gallery */}
        <div className="flex flex-col md:flex-row gap-6 md:sticky md:top-24 h-fit">
          <div className="flex md:flex-col gap-3 order-2 md:order-1 self-start">
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
                      ? "border-gray-900 scale-105 shadow-sm"
                      : "border-gray-200 opacity-80 hover:opacity-100"
                  }`}
                />
              ))}
          </div>

          <div className="relative flex-1 order-1 md:order-2 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <Lens zoomFactor={1.8} lensSize={160} disableOnMobile={true}>
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-2xl transition-transform duration-500 ease-out hover:scale-[1.02]"
              />
            </Lens>

            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavourite(product);
                }}
                className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <FaHeart
                  className={`text-lg ${
                    isFavourite ? "text-red-500" : "text-gray-500"
                  }`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(product);
                }}
                className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <FaShareAlt className="text-gray-600 text-lg" />
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
                  product.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-green-500 text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col space-y-6">
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            {product.categoryName}
          </p>

          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
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
              {product.companyName}
            </button>
          )}

          <div className="flex items-baseline gap-3 mt-2">
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-lg">
                QAR {product.oldPrice}
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              QAR {product.price}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Product Details
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description ||
                `Introducing our ${product.name} – designed for superior quality and style.`}
            </p>
          </div>

          {/* Rating + Review */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? "text-gray-950"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-gray-600 text-sm">
                  ({averageRating.toFixed(1)})
                </span>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="text-sm text-white bg-gray-900 hover:bg-gray-800 rounded-lg px-4 py-2 font-medium transition"
              >
                Write a Review
              </button>
            </div>

            {/* Preview Reviews */}
            <div className="space-y-2">
              {reviews.slice(0, 2).map((rev) => (
                <div
                  key={rev.id}
                  className="border border-gray-100 rounded-xl p-3 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800">
                      {rev.name}
                    </span>
                    <span className="text-gray-500 text-sm">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? "text-gray-950" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-light text-gray-900 text-start mb-12">
            Similar Products
          </h2>
          <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((sp) => {
              const isFav = favourites.some((f) => f.id === sp.id);
              return (
                <motion.div
                  key={sp.id}
                  whileHover={{ scale: 1.03 }}
                  className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/category/${sp.categoryId}/company/${sp.companyId}/product/${sp.id}`
                    )
                  }
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(sp);
                    }}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-100 shadow-sm transition-all hover:scale-110 ${
                      isFav ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    <FaHeart className="text-lg" />
                  </button>

                  <div className="w-full h-[220px] overflow-hidden rounded-t-2xl">
                    <img
                      src={sp.image}
                      alt={sp.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 text-sm truncate mb-1">
                      {sp.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="text-sm font-semibold">
                        QAR {sp.price}
                      </span>
                      {sp.oldPrice && (
                        <span className="text-xs line-through text-gray-400">
                          QAR {sp.oldPrice}
                        </span>
                      )}
                    </div>
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
