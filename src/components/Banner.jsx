import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import banner1 from "../assets/banner1.avif";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";
import SearchBar from "../components/SearchBar";

const images = [banner1, banner2, banner3];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerHeight, setBannerHeight] = useState("85vh"); // default reduced height

  // ✅ Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Adjust banner height based on screen width
  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) setBannerHeight("65vh"); // Mobile
      else if (width < 1024) setBannerHeight("75vh"); // Tablet
      else setBannerHeight("85vh"); // Desktop
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  // ✨ Animation Variants
  const textContainer = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const textChild = {
    hidden: { opacity: 0, y: 25, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const headingText = "Welcome to Catalogueya";

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: bannerHeight }}
    >
      {/* Background Images */}
      {images.map((img, index) => (
        <motion.img
          key={index}
          src={img}
          alt={`banner-${index}`}
          loading="lazy"
          className="absolute w-full h-full object-cover"
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      ))}

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-4 text-center">
        {/* Search Bar */}
        <div className="w-full max-w-md sm:max-w-2xl">
          <SearchBar />
        </div>

        {/* Animated Heading */}
        <motion.h2
          variants={textContainer}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex flex-wrap justify-center"
        >
          {headingText.split("").map((char, i) => (
            <motion.span key={i} variants={textChild} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: headingText.length * 0.05 + 0.3, duration: 1 }}
          className="text-white/90 text-base sm:text-lg md:text-xl font-medium tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
        >
          Enhance Everyday Living.
        </motion.p>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
