import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import banner1 from "../assets/banner4.avif";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";
import SearchBar from "../components/SearchBar";

const images = [banner1, banner2, banner3];

// Preload images immediately when module loads
images.forEach(src => {
  new Image().src = src;
});

const responsiveImages = [
  { src: banner1, alt: "Modern living room banner 1" },
  { src: banner2, alt: "Elegant kitchen interior banner 2" },
  { src: banner3, alt: "Cozy bedroom design banner 3" }
];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Ultra-smooth auto-slide with requestAnimationFrame
  useEffect(() => {
    const duration = 5000;
    
    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      
      if (elapsed >= duration) {
        setCurrentIndex(prev => (prev + 1) % images.length);
        setProgress(0);
        lastTimeRef.current = timestamp;
      } else {
        setProgress((elapsed / duration) * 100);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const sectionHeight = "h-[60vh] sm:h-[80vh] md:h-[90vh] lg:h-screen";

  // Motion variants - KEEPING THE EXACT SAME H1 EFFECT
  const container = useMemo(
    () => ({
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.02 }
      }
    }),
    []
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
    lastTimeRef.current = performance.now();
  };

  return (
    <section
      className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center`}
    >
      {/* IMMEDIATE FIRST IMAGE - No delay */}
      <img
        src={responsiveImages[0].src}
        alt={responsiveImages[0].alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="sync"
        style={{ transform: "translateZ(0)" }}
      />

      {/* Optimized image slides */}
      {responsiveImages.map((img, index) => {
        const isActive = index === currentIndex;
        return (
          <motion.img
            key={index}
            src={img.src}
            alt={img.alt}
            className="absolute w-full h-full object-cover"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              opacity: isActive ? 1 : 0,
              willChange: "opacity",
              transform: "translateZ(0)"
            }}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        );
      })}

      {/* Subtle Black Overlay for Better Text Visibility */}
    

      {/* Overlay Content - KEEPING EXACT SAME H1 ANIMATION */}
      <motion.div
        className="absolute z-10 inset-0 flex flex-col items-center justify-center gap-6 px-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>

        {/* EXACT SAME H1 LETTER-BY-LETTER EFFECT - NOT CHANGED */}
        <motion.h2
          variants={container}
          className="font-extrabold text-center text-white
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

      {/* Navigation Dots */}
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
                <div className="relative">
                  <div className="w-6 h-1 sm:w-8 sm:h-1.5 bg-white/30 rounded-full overflow-hidden" />
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ) : (
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/40 group-hover:bg-white/60 transition-all duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}