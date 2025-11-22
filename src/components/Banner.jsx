import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import banner1 from "../assets/banner1.avif";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";
import SearchBar from "../components/SearchBar";

const images = [banner1, banner2, banner3];

const responsiveImages = [
  {
    src: banner1,
    alt: "Modern living room banner 1",
    srcSet: `
      ${banner1} 1920w,
      ${banner1} 1280w,
      ${banner1} 640w
    `
  },
  {
    src: banner2,
    alt: "Elegant kitchen interior banner 2",
    srcSet: `
      ${banner2} 1920w,
      ${banner2} 1280w,
      ${banner2} 640w
    `
  },
  {
    src: banner3,
    alt: "Cozy bedroom design banner 3",
    srcSet: `
      ${banner3} 1920w,
      ${banner3} 1280w,
      ${banner3} 640w
    `
  }
];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [progress, setProgress] = useState(0);
  const resizeTimeout = useRef(null);
  const progressInterval = useRef(null);

  // Preload images asynchronously (non-blocking)
  useEffect(() => {
    responsiveImages.forEach((img) => {
      if (!loadedImages[img.src]) {
        const preloadImg = new Image();
        preloadImg.src = img.src;
        preloadImg.onload = () =>
          setLoadedImages((prev) => ({ ...prev, [img.src]: true }));
      }
    });
  }, [loadedImages]);

  // Auto-slide every 5s with progress indicator
  useEffect(() => {
    const startProgress = () => {
      setProgress(0);
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval.current);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            return 0;
          }
          return prev + 1;
        });
      }, 50); // Update every 50ms for smooth progress (5000ms / 100 = 50ms per 1%)
    };

    startProgress();

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex]);

  // Reset progress when manually changing slide
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Window resize handler with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sectionHeight = useMemo(
    () => (windowWidth < 640 ? "h-[60vh]" : "h-[90vh] md:h-[90vh] lg:h-screen"),
    [windowWidth]
  );

  // Motion variants
  const container = useMemo(
    () => ({
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: windowWidth < 640 ? 0.02 : 0.04 }
      }
    }),
    [windowWidth]
  );

  const child = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: "easeOut" }
      }
    }),
    []
  );

  const headingText = "Welcome to Catalogueya";

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  return (
    <section
      className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center`}
    >
      {/* Preload first banner with responsive image */}
      <picture>
        <source
          srcSet={responsiveImages[0].srcSet}
          sizes="100vw"
          type="image/avif"
        />
        <img
          src={responsiveImages[0].src}
          alt={responsiveImages[0].alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          style={{ transform: "translateZ(0)" }}
        />
      </picture>

      {/* Fade between images with GPU acceleration */}
      {responsiveImages.map((img, index) => {
        const isActive = index === currentIndex;
        return (
          <motion.img
            key={index}
            src={img.src}
            srcSet={img.srcSet}
            alt={img.alt}
            className="absolute w-full h-full object-cover"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              opacity: loadedImages[img.src] ? (isActive ? 1 : 0) : 0,
              willChange: "opacity, transform",
              transform: "translateZ(0)"
            }}
            loading={index === 0 ? "eager" : "lazy"}
          />
        );
      })}

      {/* Overlay Content */}
      <motion.div
        className="absolute z-10 inset-0 flex flex-col items-center justify-center gap-6 px-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>

        <motion.h2
          variants={container}
          className="font-extrabold  text-center text-white
                     drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex flex-wrap justify-center
                     text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl tracking-tight px-4"
        >
          {headingText.split("").map((char, i) => (
            <motion.span key={i} variants={child} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          variants={child}
          className="text-white/90 text-md md:text-xl lg:text-2xl font-semibold tracking-wide text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] max-w-2xl -mt-4 sm:-mt-1"
        >
          Enhance Everyday Living.
        </motion.p>
      </motion.div>

      {/* Glassmorphic Navigation Dots with Progress Bar - Smaller size */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          {responsiveImages.map((_, idx) => (
            <button
              key={idx}
              className="relative group"
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {idx === currentIndex ? (
                // Active dot with expanding width
                <div className="relative">
                  {/* Background track */}
                  <div 
                    className={`
                      ${windowWidth < 640 ? "w-6 h-1" : "w-8 h-1.5"} 
                      bg-white/30 rounded-full overflow-hidden
                    `}
                  />
                  {/* Progress fill */}
                  <motion.div
                    className={`
                      absolute top-0 left-0 h-full bg-white rounded-full
                      ${windowWidth < 640 ? "h-1" : "h-1.5"}
                    `}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ) : (
                // Inactive dot
                <div
                  className={`
                    ${windowWidth < 640 ? "w-2 h-2" : "w-2.5 h-2.5"} 
                    rounded-full transition-all duration-300 ease-out
                    bg-white/40 group-hover:bg-white/60
                  `}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}