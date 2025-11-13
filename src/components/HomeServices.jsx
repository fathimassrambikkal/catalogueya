import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { unifiedData } from "../data/unifiedData";
import { getCategories, getSettings, getFixedWords } from "../api";

export default function HomeServices() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [categories, setCategories] = useState(unifiedData.categories || []);
  const [fixedWords, setFixedWords] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);

  // Fetch backend data
  useEffect(() => {
    getCategories().then(res => res?.data?.length && setCategories(res.data)).catch(console.warn);
    getFixedWords().then(res => res?.data && setFixedWords(res.data)).catch(console.warn);
  }, []);

  // Duplicate for infinite scroll
  const duplicatedCategories = useMemo(() => [...categories, ...categories], [categories]);
  const totalCards = categories.length;

  // Responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1600) setCardsPerView(6);
      else if (width >= 1280) setCardsPerView(5);
      else if (width >= 1024) setCardsPerView(4);
      else setCardsPerView(4);
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // Infinite carousel logic
  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? totalCards - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex(prev => (prev >= totalCards - 1 ? 0 : prev + 1));
  };

  const getTranslate = () => {
    if (!containerRef.current) return 0;
    const cardWidth = containerRef.current.offsetWidth / cardsPerView;
    return -(cardWidth * currentIndex);
  };

  // Slightly larger circle sizes on md
  const circleSize = "w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full";

  return (
    <section className="relative mx-auto py-8 sm:py-12 lg:py-10 overflow-hidden bg-neutral-100">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
          {fixedWords?.homeServicesTitle || "Home Services"}
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          {fixedWords?.homeServicesSubtitle ||
            "Explore trusted service categories for your home and garden"}
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
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-out flex-nowrap"
            style={{ transform: `translateX(${getTranslate()}px)` }}
            ref={containerRef}
          >
            {duplicatedCategories.map((service, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-1 sm:px-2 flex justify-center items-center"
                style={{ flexBasis: `${100 / cardsPerView}%` }}
              >
                <div
                  className={`relative group aspect-square ${circleSize} p-[2px] 
                              bg-gradient-to-br from-white/40 via-white/10 to-transparent 
                              backdrop-blur-md shadow-lg border border-white/30 hover:scale-105 
                              transition-all duration-300`}
                  onClick={() => navigate(`/category/${service.id}`)}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title_en || service.title}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-100 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                      <h3 className="text-white text-[10px] sm:text-xs md:text-sm font-medium text-center px-3 py-[4px] leading-tight bg-black/10 rounded-sm backdrop-blur-sm shadow-md group-hover:bg-black/10 transition duration-300">
                        {service.title_en || service.title}
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
