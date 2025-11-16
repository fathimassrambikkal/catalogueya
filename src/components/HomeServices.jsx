import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { unifiedData } from "../data/unifiedData";
import { getCategories, getFixedWords } from "../api";

export default function HomeServices() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [categories, setCategories] = useState(unifiedData.categories || []);
  const [fixedWords, setFixedWords] = useState({});
  const [cardsPerView, setCardsPerView] = useState(6);

  // Fetch backend data using async/await
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const catRes = await getCategories();
        if (mounted && catRes?.data?.length) setCategories(catRes.data);

        const wordsRes = await getFixedWords();
        if (mounted && wordsRes?.data) setFixedWords(wordsRes.data);
      } catch (err) {
        console.warn("Failed to fetch home services data:", err);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  
  useEffect(() => {
    let timeout;
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1600) setCardsPerView(6);
      else if (width >= 1280) setCardsPerView(5);
      else if (width >= 1024) setCardsPerView(4);
      else setCardsPerView(4);
    };
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateCardsPerView, 100);
    };
    updateCardsPerView();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  // Duplicate categories for seamless loop
  const duplicatedCategories = useMemo(() => [...categories, ...categories], [categories]);

  // Smooth continuous scroll
  const scrollRef = useRef(0);
  const requestRef = useRef(null);
  const isPaused = useRef(false);
  const SCROLL_SPEED = 0.25;

  useEffect(() => {
    let lastTime = performance.now();

    const step = (time) => {
      if (!containerRef.current || isPaused.current) {
        requestRef.current = requestAnimationFrame(step);
        return;
      }

      const deltaTime = time - lastTime;
      lastTime = time;

      const containerWidth = containerRef.current.scrollWidth / 2;
      scrollRef.current += SCROLL_SPEED * (deltaTime / 16);

      if (scrollRef.current >= containerWidth) scrollRef.current = 0;

      containerRef.current.style.transform = `translateX(-${scrollRef.current}px)`;
      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current);
  }, [duplicatedCategories]);

  // Smooth arrow scroll
  const smoothScroll = (distance) => {
    if (!containerRef.current) return;
    const start = scrollRef.current;
    const end = scrollRef.current + distance;
    let progress = 0;

    const animate = () => {
      if (!containerRef.current) return;
      progress += 0.05;
      scrollRef.current = start + (end - start) * Math.min(progress, 1);
      containerRef.current.style.transform = `translateX(-${scrollRef.current}px)`;
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  };

  const handlePrev = () => smoothScroll(-(containerRef.current.offsetWidth / cardsPerView));
  const handleNext = () => smoothScroll(containerRef.current.offsetWidth / cardsPerView);

  // Touch/swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    isPaused.current = true;
  };
  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current - touchX;
    scrollRef.current += diff;
    containerRef.current.style.transform = `translateX(-${scrollRef.current}px)`;
    touchStartX.current = touchX;
  };
  const handleTouchEnd = () => {
    isPaused.current = false;
  };

  const circleSize = "w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full";

  return (
    <section className="relative mx-auto py-8 sm:py-12 lg:py-10 overflow-hidden bg-neutral-100">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
          {fixedWords?.homeServicesTitle || "Home Services"}
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          {fixedWords?.homeServicesSubtitle || "Explore trusted service categories for your home and garden"}
        </p>
      </div>

      {/* Carousel */}
      <div className="relative px-4 sm:px-8 md:px-12 lg:px-16">
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 
                     bg-gray-950 hover:bg-gray-800 text-white rounded-full 
                     p-1.5 sm:p-2.5 transition-all shadow-md"
        >
          <FaChevronLeft size={16} />
        </button>

        <div
          className="overflow-hidden w-full"
          onMouseEnter={() => (isPaused.current = true)}
          onMouseLeave={() => (isPaused.current = false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex flex-nowrap will-change-transform" ref={containerRef}>
            {duplicatedCategories.map((service, index) => (
              <div
                key={`${service.id}-${index}`}
                className="flex-shrink-0 px-1 sm:px-2 flex justify-center items-center"
                style={{ flexBasis: `${100 / cardsPerView}%` }}
              >
                <div
                  className={`relative group aspect-square ${circleSize} p-[2px] 
                              bg-gradient-to-br from-white/40 via-white/10 to-transparent 
                              shadow-lg border border-white/30 hover:scale-105 transition-transform duration-300`}
                  onClick={() => navigate(`/category/${service.id}`)}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title_en || service.title}
                      loading="lazy"
                      decoding="async"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-100 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                      <h3 className="text-white text-[10px] sm:text-xs md:text-sm font-medium text-center px-3 py-[4px] leading-tight bg-black/10 rounded-sm transition duration-300">
                        {service.title_en || service.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
