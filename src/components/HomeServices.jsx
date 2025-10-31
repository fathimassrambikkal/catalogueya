import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { unifiedData } from "../data/unifiedData";

export default function HomeServices() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { categories } = unifiedData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6); // ✅ Default 6 for desktop

  // ✅ Duplicate categories for smooth scroll illusion
  const duplicatedServices = useMemo(() => [...categories, ...categories], [categories]);
  const totalCards = categories.length;

  // ✅ Adjust visible cards based on screen width
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1600) setCardsPerView(6);
      else if (window.innerWidth >= 1280) setCardsPerView(5);
      else if (window.innerWidth >= 1024) setCardsPerView(4);
      else if (window.innerWidth >= 768) setCardsPerView(3);
      else setCardsPerView(2);
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // ✅ Carousel controls
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? totalCards - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= totalCards - 1 ? 0 : prev + 1));
  };

  const getTranslate = () => {
    if (!containerRef.current) return 0;
    const cardWidth = containerRef.current.offsetWidth / cardsPerView;
    return -(cardWidth * currentIndex);
  };

  // ✅ Reset on resize
  useEffect(() => {
    const handleResize = () => setCurrentIndex(0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Dynamic circle size
  const circleSize =
    cardsPerView >= 6
      ? "w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
      : "w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48";

  return (
    <section className="relative mx-auto py-16 overflow-hidden bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-light font-inter text-gray-800 tracking-tight">
          Home Services
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Explore trusted service categories for your home and garden
        </p>
      </div>

      <div className="relative">
        {/* Left Navigation */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-900/70 hover:bg-gray-800 text-white rounded-full p-2 sm:p-3 transition-all"
        >
          <FaChevronLeft size={18} />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden w-full" ref={containerRef}>
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(${getTranslate()}px)` }}
          >
            {duplicatedServices.map((service, index) => (
              <div
                key={index}
                className="flex-none px-2 flex justify-center"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                {/* Glassmorphic border wrapper */}
                <div
                  className={`relative group rounded-full p-[2px] bg-gradient-to-br from-white/40 via-white/10 to-transparent backdrop-blur-md shadow-lg border border-white/30 hover:scale-105 transition-all duration-300 ${circleSize}`}
                  onClick={() => navigate(`/category/${service.id}`)}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-100 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center rounded-full pb-5">
                      <h3 className="text-white text-xs sm:text-base md:text-lg font-semibold text-center">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Navigation */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-900/70 hover:bg-gray-800 text-white rounded-full p-2 sm:p-3 transition-all"
        >
          <FaChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
