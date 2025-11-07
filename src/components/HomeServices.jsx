import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { unifiedData } from "../data/unifiedData";

export default function HomeServices() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { categories } = unifiedData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);

  const duplicatedServices = useMemo(() => [...categories, ...categories], [categories]);
  const totalCards = categories.length;

  // 🔹 Responsive number of cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1600) setCardsPerView(6);
      else if (width >= 1280) setCardsPerView(5);
      else if (width >= 1024) setCardsPerView(4);
      else if (width >= 768) setCardsPerView(4);
      else if (width >= 480) setCardsPerView(4);
      else setCardsPerView(4);
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // 🔹 Carousel Controls
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

  useEffect(() => {
    const handleResize = () => setCurrentIndex(0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Dynamic circle size
  const circleSize =
    cardsPerView >= 6
      ? "w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
      : cardsPerView === 4
      ? "w-34 h-34 sm:w-38 sm:h-38 md:w-42 md:h-42 lg:w-46 lg:h-46"
      : "w-34 h-34 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48";

  return (
    <section className="relative mx-auto py-8 sm:py-12 lg:py-10 overflow-hidden bg-gray-50">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
          Home Services
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Explore trusted service categories for your home and garden
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 
                     bg-gray-950 hover:bg-gray-800 text-white rounded-full 
                     p-1.5 sm:p-2.5 transition-all shadow-md"
        >
          <FaChevronLeft size={16} />
        </button>

        {/* Carousel */}
        <div className="overflow-hidden w-full" ref={containerRef}>
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(${getTranslate()}px)` }}
          >
            {duplicatedServices.map((service, index) => (
              <div
                key={index}
                className="flex-none px-[3px] sm:px-[5px] flex justify-center items-center"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <div
                  className={`relative group aspect-square rounded-full p-[2px] bg-gradient-to-br 
                              from-white/40 via-white/10 to-transparent backdrop-blur-md 
                              shadow-lg border border-white/30 hover:scale-105 
                              transition-all duration-300 ${circleSize}`}
                  onClick={() => navigate(`/category/${service.id}`)}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-100 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center rounded-full pb-2">
                      <h3 className="text-white text-[9px] sm:text-xs md:text-sm font-semibold text-center px-1 leading-tight">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 
                     bg-gray-950 hover:bg-gray-800 text-white rounded-full 
                     p-1.5 sm:p-2.5 transition-all shadow-md"
        >
          <FaChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
