import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.webp";
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
    `,
    id: "banner-1"
  },
  {
    src: banner2,
    alt: "Elegant kitchen interior banner 2",
    srcSet: `
      ${banner2} 1920w,
      ${banner2} 1280w,
      ${banner2} 640w
    `,
    id: "banner-2"
  },
  {
    src: banner3,
    alt: "Cozy bedroom design banner 3",
    srcSet: `
      ${banner3} 1920w,
      ${banner3} 1280w,
      ${banner3} 640w
    `,
    id: "banner-3"
  }
];

/* Intersection observer */
const useIsInViewport = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [ref]);

  return isVisible;
};

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const sectionRef = useRef(null);
  const resizeTimeout = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimestamp = useRef(0);
  const isInView = useIsInViewport(sectionRef);

  // Preload images asynchronously (non-blocking)
  useEffect(() => {
    responsiveImages.forEach((img) => {
      if (!loadedImages[img.id]) {
        const preloadImg = new Image();
        preloadImg.src = img.src;
        preloadImg.onload = () =>
          setLoadedImages((prev) => ({ ...prev, [img.id]: true }));
      }
    });
  }, [loadedImages]);

  // Auto-slide animation with requestAnimationFrame
  useEffect(() => {
    if (responsiveImages.length === 0) return;

    const SLIDE_TIME = 5000;

    const tick = (now) => {
      if (!lastTimestamp.current) lastTimestamp.current = now;

      if (now - lastTimestamp.current >= SLIDE_TIME) {
        setCurrentIndex((prev) => (prev + 1) % responsiveImages.length);
        lastTimestamp.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    if (isInView) animationFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isInView, responsiveImages.length]);

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

  const handleDotClick = useCallback((i) => {
    lastTimestamp.current = performance.now();
    setCurrentIndex(i);
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

  const headingText = useMemo(() => "Welcome to Catalogueya", []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center`}
    >
      {/* Preload first banner with responsive image */}
      {responsiveImages[0]?.src && (
        <link rel="preload" as="image" href={responsiveImages[0].src} />
      )}

      {/* Background images with low z-index approach */}
      {responsiveImages.map((img, index) => {
        const isActive = index === currentIndex;
        return (
          <motion.img
            key={img.id}
            src={img.src}
            srcSet={img.srcSet}
            alt={img.alt}
            width="1920"
            height="1080"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            onLoad={() =>
              setLoadedImages((prev) => ({ ...prev, [img.id]: true }))
            }
            className="absolute inset-0 w-full h-full object-cover"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              opacity: loadedImages[img.id] ? (isActive ? 1 : 0) : 0,
              willChange: "opacity, transform",
              transform: "translateZ(0)"
            }}
          />
        );
      })}

      {/* Skeleton loading */}
      {!loadedImages[responsiveImages[0]?.id] && responsiveImages.length > 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      )}

      {/* Overlay Content with proper z-index */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 z-10"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-2xl z-30">
          <SearchBar />
        </div>

        <motion.h2
          variants={container}
          className="font-extrabold tracking-tight text-center text-white
                     drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex flex-wrap justify-center
                     text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl leading-tight px-4"
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
          Enhance Everyday Living
        </motion.p>
      </motion.div>

      {/* Navigation dots with low z-index approach */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          {responsiveImages.map((_, idx) => (
            <button key={idx} onClick={() => handleDotClick(idx)}>
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}