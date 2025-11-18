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
  const resizeTimeout = useRef(null);

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

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
          Enhance Everyday Living.
        </motion.p>
      </motion.div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 p-1.5 rounded-full bg-white/20 backdrop-blur-md">
        {responsiveImages.map((_, idx) => (
          <button
            key={idx}
            className={`${
              windowWidth < 640 ? "w-2.5 h-2.5" : "w-4 h-4"
            } rounded-full transition-colors ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
   

    </section>
  );
}
